from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import User, QuizSubmission, Question, Subject, Feedback, Achievement
from app.schemas import (
    FeedbackCreate,
    FeedbackResponse,
    ScoreSummary,
    SubjectCreate,
    SubjectResponse,
    AchievementCreate,
    AchievementResponse
)
from app.auth import get_current_admin_user
from app.models import User as UserModel

router = APIRouter()

@router.get("/students", response_model=List[dict])
def get_all_students(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user)
):
    students = db.query(User).filter(User.is_admin == False).all()
    return [
        {
            "id": student.id,
            "username": student.username,
            "email": student.email,
            "full_name": student.full_name,
            "created_at": student.created_at
        }
        for student in students
    ]

@router.get("/scores", response_model=List[ScoreSummary])
def get_all_scores(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user)
):
    # Get all students with their scores
    students = db.query(User).filter(User.is_admin == False).all()
    score_summaries = []
    
    for student in students:
        submissions = db.query(QuizSubmission).filter(
            QuizSubmission.student_id == student.id
        ).all()
        
        total_questions = len(submissions)
        correct_answers = sum(1 for s in submissions if s.is_correct)
        total_points = sum(s.points_earned for s in submissions)
        accuracy = (correct_answers / total_questions * 100) if total_questions > 0 else 0
        
        score_summaries.append(ScoreSummary(
            student_id=student.id,
            student_name=student.full_name,
            total_questions=total_questions,
            correct_answers=correct_answers,
            total_points=total_points,
            accuracy=round(accuracy, 2)
        ))
    
    return score_summaries

@router.get("/subjects", response_model=List[SubjectResponse])
def get_all_subjects(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user)
):
    subjects = db.query(Subject).all()
    return subjects

@router.get("/subjects/{subject_id}", response_model=SubjectResponse)
def get_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user)
):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mata pelajaran tidak ditemukan"
        )
    return subject

@router.post("/subjects", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
def create_subject(
    subject_data: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user)
):
    # Check if subject with same name already exists
    existing_subject = db.query(Subject).filter(Subject.name == subject_data.name).first()
    if existing_subject:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Mata pelajaran dengan nama ini sudah ada"
        )
    
    db_subject = Subject(**subject_data.dict())
    db.add(db_subject)
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.put("/subjects/{subject_id}", response_model=SubjectResponse)
def update_subject(
    subject_id: int,
    subject_data: SubjectCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user)
):
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mata pelajaran tidak ditemukan"
        )
    
    # Check if another subject with same name exists (only if name is being changed)
    if subject_data.name != db_subject.name:
        existing_subject = db.query(Subject).filter(
            Subject.name == subject_data.name,
            Subject.id != subject_id
        ).first()
        if existing_subject:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Mata pelajaran dengan nama ini sudah ada"
            )
    
    # Update fields
    db_subject.name = subject_data.name
    db_subject.description = subject_data.description
    db.commit()
    db.refresh(db_subject)
    return db_subject

@router.delete("/subjects/{subject_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_subject(
    subject_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user)
):
    db_subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not db_subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mata pelajaran tidak ditemukan"
        )
    
    # Check if subject has questions
    question_count = db.query(Question).filter(Question.subject_id == subject_id).count()
    if question_count > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Tidak dapat menghapus mata pelajaran. Masih ada {question_count} pertanyaan yang terkait dengan mata pelajaran ini."
        )
    
    db.delete(db_subject)
    db.commit()
    return None

@router.post("/feedback", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def create_feedback(
    feedback_data: FeedbackCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user)
):
    # Verify student exists
    student = db.query(User).filter(User.id == feedback_data.student_id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Siswa tidak ditemukan"
        )
    
    db_feedback = Feedback(
        student_id=feedback_data.student_id,
        admin_id=current_user.id,
        message=feedback_data.message
    )
    db.add(db_feedback)
    db.commit()
    db.refresh(db_feedback)
    return db_feedback

@router.get("/feedback/{student_id}", response_model=List[FeedbackResponse])
def get_feedback_for_student(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user)
):
    feedbacks = db.query(Feedback).filter(
        Feedback.student_id == student_id
    ).all()
    return feedbacks

@router.get("/achievements", response_model=List[AchievementResponse])
def get_all_achievements(
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user)
):
    achievements = db.query(Achievement).all()
    return achievements

@router.post("/achievements", response_model=AchievementResponse, status_code=status.HTTP_201_CREATED)
def create_achievement(
    achievement_data: AchievementCreate,
    db: Session = Depends(get_db),
    current_user: UserModel = Depends(get_current_admin_user)
):
    db_achievement = Achievement(**achievement_data.dict())
    db.add(db_achievement)
    db.commit()
    db.refresh(db_achievement)
    return db_achievement

