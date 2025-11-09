from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Question, Subject
from app.schemas import QuestionCreate, QuestionUpdate, QuestionResponse
from app.auth import get_current_admin_user, get_current_user
from app.models import User

router = APIRouter()

@router.get("/", response_model=List[QuestionResponse])
def get_questions(
    subject_id: int = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Question)
    if subject_id:
        query = query.filter(Question.subject_id == subject_id)
    questions = query.all()
    return questions

@router.get("/{question_id}", response_model=QuestionResponse)
def get_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    question = db.query(Question).filter(Question.id == question_id).first()
    if not question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pertanyaan tidak ditemukan"
        )
    return question

@router.post("/", response_model=QuestionResponse, status_code=status.HTTP_201_CREATED)
def create_question(
    question_data: QuestionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    # Verify subject exists
    subject = db.query(Subject).filter(Subject.id == question_data.subject_id).first()
    if not subject:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Mata pelajaran tidak ditemukan"
        )
    
    db_question = Question(**question_data.dict())
    db.add(db_question)
    db.commit()
    db.refresh(db_question)
    return db_question

@router.put("/{question_id}", response_model=QuestionResponse)
def update_question(
    question_id: int,
    question_data: QuestionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pertanyaan tidak ditemukan"
        )
    
    update_data = question_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_question, field, value)
    
    db.commit()
    db.refresh(db_question)
    return db_question

@router.delete("/{question_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_question(
    question_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    db_question = db.query(Question).filter(Question.id == question_id).first()
    if not db_question:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Pertanyaan tidak ditemukan"
        )
    
    db.delete(db_question)
    db.commit()
    return None

