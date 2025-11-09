"""
Script untuk inisialisasi database dengan data awal
"""
from app.database import SessionLocal, engine, Base
from app.models import User, Subject, Question, Achievement
from app.auth import get_password_hash

# Create all tables
Base.metadata.create_all(bind=engine)

def init_db():
    db = SessionLocal()
    
    try:
        # Check if admin already exists
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            # Create admin user
            admin_user = User(
                username="admin",
                email="admin@example.com",
                full_name="Administrator",
                hashed_password=get_password_hash("admin123"),
                is_admin=True
            )
            db.add(admin_user)
            print("✓ Admin user created (username: admin, password: admin123)")
        
        # Check if sample student exists
        student = db.query(User).filter(User.username == "siswa1").first()
        if not student:
            # Create sample student
            student_user = User(
                username="siswa1",
                email="siswa1@example.com",
                full_name="Siswa Contoh",
                hashed_password=get_password_hash("siswa123"),
                is_admin=False
            )
            db.add(student_user)
            print("✓ Sample student created (username: siswa1, password: siswa123)")
        
        # Create subjects
        subjects_data = [
            {"name": "Matematika", "description": "Pelajari matematika dengan cara yang menyenangkan"},
            {"name": "Bahasa Indonesia", "description": "Tingkatkan kemampuan bahasa Indonesia Anda"},
            {"name": "IPA", "description": "Eksplorasi ilmu pengetahuan alam"},
        ]
        
        for subj_data in subjects_data:
            subject = db.query(Subject).filter(Subject.name == subj_data["name"]).first()
            if not subject:
                subject = Subject(**subj_data)
                db.add(subject)
                print(f"✓ Subject created: {subj_data['name']}")
        
        db.commit()
        
        # Get subjects for questions
        math_subject = db.query(Subject).filter(Subject.name == "Matematika").first()
        bahasa_subject = db.query(Subject).filter(Subject.name == "Bahasa Indonesia").first()
        
        # Create sample questions
        if math_subject:
            # Multiple choice question
            mc_question = db.query(Question).filter(
                Question.question_text == "Berapa hasil dari 2 + 2?"
            ).first()
            if not mc_question:
                mc_question = Question(
                    subject_id=math_subject.id,
                    question_type="multiple_choice",
                    question_text="Berapa hasil dari 2 + 2?",
                    options=["3", "4", "5", "6"],
                    correct_answer={"selected": 1},
                    explanation="2 + 2 = 4. Ini adalah operasi penjumlahan dasar.",
                    points=10
                )
                db.add(mc_question)
                print("✓ Sample multiple choice question created")
            
            # Drag and drop question
            dd_question = db.query(Question).filter(
                Question.question_text == "Urutkan bilangan dari yang terkecil ke terbesar:"
            ).first()
            if not dd_question:
                dd_question = Question(
                    subject_id=math_subject.id,
                    question_type="drag_drop",
                    question_text="Urutkan bilangan dari yang terkecil ke terbesar:",
                    options=["5", "2", "8", "1"],
                    correct_answer={"order": [3, 1, 0, 2]},  # 1, 2, 5, 8
                    explanation="Urutan yang benar adalah 1, 2, 5, 8 (dari terkecil ke terbesar).",
                    points=15
                )
                db.add(dd_question)
                print("✓ Sample drag & drop question created")
        
        if bahasa_subject:
            # Fill in the blank question
            fb_question = db.query(Question).filter(
                Question.question_text.startswith("Lengkapi kalimat berikut:")
            ).first()
            if not fb_question:
                fb_question = Question(
                    subject_id=bahasa_subject.id,
                    question_type="fill_blank",
                    question_text="Lengkapi kalimat berikut: Ibu pergi ke {pasar} untuk membeli {sayur}.",
                    options=None,
                    correct_answer={"fills": {"pasar": "pasar", "sayur": "sayur"}},
                    explanation="Kata yang tepat untuk melengkapi kalimat adalah 'pasar' dan 'sayur'.",
                    points=10
                )
                db.add(fb_question)
                print("✓ Sample fill in the blank question created")
        
        # Create default achievements
        achievements_data = [
            {
                "name": "Pemula",
                "description": "Jawab 10 pertanyaan dengan benar",
                "icon": "🌱",
                "requirement_type": "total_correct",
                "requirement_value": 10
            },
            {
                "name": "Ahli",
                "description": "Jawab 50 pertanyaan dengan benar",
                "icon": "⭐",
                "requirement_type": "total_correct",
                "requirement_value": 50
            },
            {
                "name": "Master",
                "description": "Jawab 100 pertanyaan dengan benar",
                "icon": "👑",
                "requirement_type": "total_correct",
                "requirement_value": 100
            },
            {
                "name": "Hot Streak",
                "description": "Jawab 5 pertanyaan benar berturut-turut",
                "icon": "🔥",
                "requirement_type": "streak",
                "requirement_value": 5
            },
            {
                "name": "On Fire",
                "description": "Jawab 10 pertanyaan benar berturut-turut",
                "icon": "🔥🔥",
                "requirement_type": "streak",
                "requirement_value": 10
            },
            {
                "name": "Level 5",
                "description": "Mencapai level 5",
                "icon": "🎯",
                "requirement_type": "level",
                "requirement_value": 5
            },
            {
                "name": "Level 10",
                "description": "Mencapai level 10",
                "icon": "🏆",
                "requirement_type": "level",
                "requirement_value": 10
            },
            {
                "name": "Kolektor Poin",
                "description": "Kumpulkan 500 poin",
                "icon": "💰",
                "requirement_type": "total_points",
                "requirement_value": 500
            },
        ]
        
        for ach_data in achievements_data:
            achievement = db.query(Achievement).filter(Achievement.name == ach_data["name"]).first()
            if not achievement:
                achievement = Achievement(**ach_data)
                db.add(achievement)
                print(f"✓ Achievement created: {ach_data['name']}")
        
        db.commit()
        print("\n✓ Database initialization completed successfully!")
        print("\nDefault accounts:")
        print("  Admin: username='admin', password='admin123'")
        print("  Student: username='siswa1', password='siswa123'")
        
    except Exception as e:
        db.rollback()
        print(f"✗ Error initializing database: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()

