from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

# Question Schemas
class QuestionBase(BaseModel):
    subject_id: int
    question_type: str
    question_text: str
    options: Optional[List[str]] = None
    correct_answer: Dict[str, Any]
    explanation: Optional[str] = None
    points: int = 10

class QuestionCreate(QuestionBase):
    pass

class QuestionUpdate(BaseModel):
    subject_id: Optional[int] = None
    question_type: Optional[str] = None
    question_text: Optional[str] = None
    options: Optional[List[str]] = None
    correct_answer: Optional[Dict[str, Any]] = None
    explanation: Optional[str] = None
    points: Optional[int] = None

class QuestionResponse(QuestionBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Subject Schemas
class SubjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class SubjectCreate(SubjectBase):
    pass

class SubjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class SubjectResponse(SubjectBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Quiz Submission Schemas
class QuizSubmissionCreate(BaseModel):
    question_id: int
    answer: Dict[str, Any]

class QuizSubmissionResponse(BaseModel):
    id: int
    question_id: int
    answer: Dict[str, Any]
    is_correct: bool
    points_earned: int
    submitted_at: datetime
    question: QuestionResponse
    level_up: Optional[bool] = False
    new_level: Optional[int] = None
    
    class Config:
        from_attributes = True

# Feedback Schemas
class FeedbackCreate(BaseModel):
    student_id: int
    message: str

class FeedbackResponse(BaseModel):
    id: int
    student_id: int
    admin_id: int
    message: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Progress Schemas
class StudentProgress(BaseModel):
    total_questions_attempted: int
    total_correct: int
    total_points: int
    accuracy: float
    subjects: List[Dict[str, Any]]

# Score Summary
class ScoreSummary(BaseModel):
    student_id: int
    student_name: str
    total_questions: int
    correct_answers: int
    total_points: int
    accuracy: float

# User Level Schemas
class UserLevelResponse(BaseModel):
    level: int
    total_experience: int
    current_streak: int
    max_streak: int
    total_correct: int
    total_questions: int
    experience_to_next_level: int
    
    class Config:
        from_attributes = True

# Achievement Schemas
class AchievementResponse(BaseModel):
    id: int
    name: str
    description: str
    icon: str
    requirement_type: str
    requirement_value: int
    
    class Config:
        from_attributes = True

class UserAchievementResponse(BaseModel):
    id: int
    achievement: AchievementResponse
    unlocked_at: datetime
    
    class Config:
        from_attributes = True

class AchievementCreate(BaseModel):
    name: str
    description: str
    icon: str = "🏆"
    requirement_type: str
    requirement_value: int

