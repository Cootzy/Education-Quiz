from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, questions, quizzes, admin, students
from app.database import engine, Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Platform Kuis Edukatif", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(questions.router, prefix="/api/questions", tags=["questions"])
app.include_router(quizzes.router, prefix="/api/quizzes", tags=["quizzes"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(students.router, prefix="/api/students", tags=["students"])

@app.get("/")
async def root():
    return {"message": "Platform Kuis Edukatif API"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

