from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
import math
from app.database import get_db
from app.models import Question, QuizSubmission, Subject, UserLevel, Achievement, UserAchievement
from app.schemas import (
    QuizSubmissionCreate,
    QuizSubmissionResponse,
    QuestionResponse,
    SubjectResponse
)
from app.auth import get_current_user
from app.models import User

router = APIRouter()

def calculate_level(total_experience: int) -> int:
    """Calculate level based on total experience"""
    # Level formula: level = floor(sqrt(total_experience / 100)) + 1
    if total_experience < 100:
        return 1
    return int(math.sqrt(total_experience / 100)) + 1

def update_user_level(db: Session, user_id: int, points_earned: int, is_correct: bool):
    """Update user level and check for achievements"""
    user_level = db.query(UserLevel).filter(UserLevel.user_id == user_id).first()
    
    if not user_level:
        user_level = UserLevel(user_id=user_id, level=1, total_experience=0)
        db.add(user_level)
        db.flush()
    
    # Update experience and stats
    user_level.total_experience += points_earned
    user_level.total_questions += 1
    
    if is_correct:
        user_level.total_correct += 1
        user_level.current_streak += 1
        if user_level.current_streak > user_level.max_streak:
            user_level.max_streak = user_level.current_streak
    else:
        user_level.current_streak = 0
    
    # Calculate new level
    old_level = user_level.level
    new_level = calculate_level(user_level.total_experience)
    level_up = new_level > old_level
    user_level.level = new_level
    user_level.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(user_level)
    
    # Check achievements
    check_achievements(db, user_id, user_level)
    
    return user_level, level_up

def check_achievements(db: Session, user_id: int, user_level: UserLevel):
    """Check and unlock achievements"""
    achievements = db.query(Achievement).all()
    
    for achievement in achievements:
        # Check if user already has this achievement
        existing = db.query(UserAchievement).filter(
            UserAchievement.user_id == user_id,
            UserAchievement.achievement_id == achievement.id
        ).first()
        
        if existing:
            continue
        
        # Check if requirement is met
        unlocked = False
        if achievement.requirement_type == "streak":
            unlocked = user_level.current_streak >= achievement.requirement_value
        elif achievement.requirement_type == "total_correct":
            unlocked = user_level.total_correct >= achievement.requirement_value
        elif achievement.requirement_type == "level":
            unlocked = user_level.level >= achievement.requirement_value
        elif achievement.requirement_type == "total_points":
            unlocked = user_level.total_experience >= achievement.requirement_value
        
        if unlocked:
            user_achievement = UserAchievement(
                user_id=user_id,
                achievement_id=achievement.id
            )
            db.add(user_achievement)
    
    db.commit()

def check_answer(question: Question, user_answer: dict) -> bool:
    """Check if user's answer is correct based on question type"""
    correct_answer = question.correct_answer
    
    if question.question_type == "multiple_choice":
        return user_answer.get("selected") == correct_answer.get("selected")
    elif question.question_type == "drag_drop":
        # For drag and drop, compare the order/positions
        user_order = user_answer.get("order", [])
        correct_order = correct_answer.get("order", [])
        return user_order == correct_order
    elif question.question_type == "fill_blank":
        # For fill in the blank, compare the filled values
        user_fills = user_answer.get("fills", {})
        correct_fills = correct_answer.get("fills", {})
        return user_fills == correct_fills
    elif question.question_type == "true_false":
        # For true/false, compare the boolean value
        user_answer_value = user_answer.get("answer")
        correct_answer_value = correct_answer.get("answer")
        return user_answer_value == correct_answer_value
    return False

@router.get("/subjects", response_model=List[SubjectResponse])
def get_subjects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subjects = db.query(Subject).all()
    return subjects

@router.get("/subjects/{subject_id}/questions", response_model=List[QuestionResponse])
def get_questions_by_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mata pelajaran tidak ditemukan"
        )
    
    questions = db.query(Question).filter(Question.subject_id == subject_id).all()
    return questions

@router.post("/submit", response_model=QuizSubmissionResponse)
def submit_answer(
    submission_data: QuizSubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    question = db.query(Question).filter(Question.id == submission_data.question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pertanyaan tidak ditemukan"
        )
    
    is_correct = check_answer(question, submission_data.answer)
    points_earned = question.points if is_correct else 0
    
    submission = QuizSubmission(
        student_id=current_user.id,
        question_id=submission_data.question_id,
        answer=submission_data.answer,
        is_correct=is_correct,
        points_earned=points_earned
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    
    # Update user level and check achievements
    user_level_obj, level_up = update_user_level(db, current_user.id, points_earned, is_correct)
    
    # Attach question to submission for response
    submission.question = question
    
    # Create response dict with level info
    response_dict = {
        "id": submission.id,
        "question_id": submission.question_id,
        "answer": submission.answer,
        "is_correct": submission.is_correct,
        "points_earned": submission.points_earned,
        "submitted_at": submission.submitted_at,
        "question": QuestionResponse(
            id=question.id,
            subject_id=question.subject_id,
            question_type=question.question_type,
            question_text=question.question_text,
            options=question.options,
            correct_answer=question.correct_answer,
            explanation=question.explanation,
            points=question.points,
            created_at=question.created_at,
            updated_at=question.updated_at
        ),
        "level_up": level_up,
        "new_level": user_level_obj.level if level_up else None
    }
    
    return QuizSubmissionResponse(**response_dict)

@router.get("/submissions", response_model=List[QuizSubmissionResponse])
def get_my_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    submissions = db.query(QuizSubmission).filter(
        QuizSubmission.student_id == current_user.id
    ).all()
    
    # Attach question details
    for submission in submissions:
        submission.question = db.query(Question).filter(
            Question.id == submission.question_id
        ).first()
    
    return submissions

@router.get("/submissions/{question_id}", response_model=QuizSubmissionResponse)
def get_submission_for_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    submission = db.query(QuizSubmission).filter(
        QuizSubmission.student_id == current_user.id,
        QuizSubmission.question_id == question_id
    ).first()
    
    if not submission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Jawaban tidak ditemukan"
        )
    
    submission.question = db.query(Question).filter(
        Question.id == question_id
    ).first()
    
    return submission

