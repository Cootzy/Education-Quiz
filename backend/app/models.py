from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    quiz_submissions = relationship("QuizSubmission", back_populates="student")
    feedbacks = relationship("Feedback", foreign_keys="Feedback.student_id", overlaps="student")
    user_level = relationship("UserLevel", back_populates="user", uselist=False)
    user_achievements = relationship("UserAchievement", back_populates="user")

class Subject(Base):
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    questions = relationship("Question", back_populates="subject")

class Question(Base):
    __tablename__ = "questions"
    
    id = Column(Integer, primary_key=True, index=True)
    subject_id = Column(Integer, ForeignKey("subjects.id"), nullable=False)
    question_type = Column(String, nullable=False)  # "multiple_choice", "drag_drop", "fill_blank", "true_false"
    question_text = Column(Text, nullable=False)
    options = Column(JSON)  # For multiple choice: ["option1", "option2", ...]
    correct_answer = Column(JSON, nullable=False)  # Can be string, array, or object depending on type
    explanation = Column(Text)
    points = Column(Integer, default=10)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    subject = relationship("Subject", back_populates="questions")
    quiz_submissions = relationship("QuizSubmission", back_populates="question")

class QuizSubmission(Base):
    __tablename__ = "quiz_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question_id = Column(Integer, ForeignKey("questions.id"), nullable=False)
    answer = Column(JSON, nullable=False)
    is_correct = Column(Boolean, nullable=False)
    points_earned = Column(Integer, default=0)
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("User", back_populates="quiz_submissions")
    question = relationship("Question", back_populates="quiz_submissions")

class Feedback(Base):
    __tablename__ = "feedbacks"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    admin_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    student = relationship("User", foreign_keys=[student_id], overlaps="feedbacks")

class UserLevel(Base):
    __tablename__ = "user_levels"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    level = Column(Integer, default=1)
    total_experience = Column(Integer, default=0)
    current_streak = Column(Integer, default=0)  # Consecutive correct answers
    max_streak = Column(Integer, default=0)  # Maximum streak achieved
    total_correct = Column(Integer, default=0)
    total_questions = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="user_level")

class Achievement(Base):
    __tablename__ = "achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    description = Column(Text, nullable=False)
    icon = Column(String, default="🏆")  # Emoji icon
    requirement_type = Column(String, nullable=False)  # "streak", "total_correct", "level", "total_points"
    requirement_value = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user_achievements = relationship("UserAchievement", back_populates="achievement")

class UserAchievement(Base):
    __tablename__ = "user_achievements"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    achievement_id = Column(Integer, ForeignKey("achievements.id"), nullable=False)
    unlocked_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="user_achievements")
    achievement = relationship("Achievement", back_populates="user_achievements")
    
    # Unique constraint: user can only have each achievement once
    __table_args__ = (
        {'sqlite_autoincrement': True},
    )

