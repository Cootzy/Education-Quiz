from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import math
from app.database import get_db
from app.models import QuizSubmission, Question, Subject, UserLevel, Achievement, UserAchievement
from app.schemas import StudentProgress, FeedbackResponse, UserLevelResponse, UserAchievementResponse, AchievementResponse
from app.auth import get_current_user
from app.models import User, Feedback

router = APIRouter()

@router.get("/progress", response_model=StudentProgress)
def get_my_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Get all submissions
    submissions = db.query(QuizSubmission).filter(
        QuizSubmission.student_id == current_user.id
    ).all()
    
    total_questions = len(submissions)
    total_correct = sum(1 for s in submissions if s.is_correct)
    total_points = sum(s.points_earned for s in submissions)
    accuracy = (total_correct / total_questions * 100) if total_questions > 0 else 0
    
    # Get progress by subject
    subject_progress = []
    subjects = db.query(Subject).all()
    
    for subject in subjects:
        subject_questions = db.query(Question).filter(
            Question.subject_id == subject.id
        ).all()
        question_ids = [q.id for q in subject_questions]
        
        subject_submissions = [s for s in submissions if s.question_id in question_ids]
        subject_total = len(subject_submissions)
        subject_correct = sum(1 for s in subject_submissions if s.is_correct)
        subject_points = sum(s.points_earned for s in subject_submissions)
        subject_accuracy = (subject_correct / subject_total * 100) if subject_total > 0 else 0
        
        subject_progress.append({
            "subject_id": subject.id,
            "subject_name": subject.name,
            "total_questions": subject_total,
            "correct_answers": subject_correct,
            "total_points": subject_points,
            "accuracy": round(subject_accuracy, 2)
        })
    
    return StudentProgress(
        total_questions_attempted=total_questions,
        total_correct=total_correct,
        total_points=total_points,
        accuracy=round(accuracy, 2),
        subjects=subject_progress
    )

@router.get("/feedback", response_model=List[FeedbackResponse])
def get_my_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    feedbacks = db.query(Feedback).filter(
        Feedback.student_id == current_user.id
    ).order_by(Feedback.created_at.desc()).all()
    return feedbacks

@router.get("/level", response_model=UserLevelResponse)
def get_my_level(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_level = db.query(UserLevel).filter(UserLevel.user_id == current_user.id).first()
    
    if not user_level:
        # Create default level if not exists
        user_level = UserLevel(
            user_id=current_user.id,
            level=1,
            total_experience=0,
            current_streak=0,
            max_streak=0,
            total_correct=0,
            total_questions=0
        )
        db.add(user_level)
        db.commit()
        db.refresh(user_level)
    
    # Calculate experience needed for next level
    current_level_exp = ((user_level.level - 1) ** 2) * 100
    next_level_exp = (user_level.level ** 2) * 100
    experience_to_next_level = next_level_exp - user_level.total_experience
    
    return UserLevelResponse(
        level=user_level.level,
        total_experience=user_level.total_experience,
        current_streak=user_level.current_streak,
        max_streak=user_level.max_streak,
        total_correct=user_level.total_correct,
        total_questions=user_level.total_questions,
        experience_to_next_level=max(0, experience_to_next_level)
    )

@router.get("/achievements", response_model=List[UserAchievementResponse])
def get_my_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_achievements = db.query(UserAchievement).filter(
        UserAchievement.user_id == current_user.id
    ).order_by(UserAchievement.unlocked_at.desc()).all()
    
    result = []
    for ua in user_achievements:
        result.append(UserAchievementResponse(
            id=ua.id,
            achievement=AchievementResponse(
                id=ua.achievement.id,
                name=ua.achievement.name,
                description=ua.achievement.description,
                icon=ua.achievement.icon,
                requirement_type=ua.achievement.requirement_type,
                requirement_value=ua.achievement.requirement_value
            ),
            unlocked_at=ua.unlocked_at
        ))
    
    return result

@router.get("/achievements/available", response_model=List[AchievementResponse])
def get_available_achievements(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get all achievements, including locked and unlocked ones"""
    all_achievements = db.query(Achievement).all()
    unlocked_achievement_ids = [
        ua.achievement_id for ua in db.query(UserAchievement).filter(
            UserAchievement.user_id == current_user.id
        ).all()
    ]
    
    result = []
    for achievement in all_achievements:
        result.append(AchievementResponse(
            id=achievement.id,
            name=achievement.name,
            description=achievement.description,
            icon=achievement.icon,
            requirement_type=achievement.requirement_type,
            requirement_value=achievement.requirement_value
        ))
    
    return result

