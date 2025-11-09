# Frontend - Platform Kuis Edukatif

Frontend aplikasi platform kuis edukatif menggunakan React, TailwindCSS, dan Framer Motion.

## Instalasi

1. Install dependencies:
```bash
npm install
```

2. Jalankan development server:
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## Build untuk Production

```bash
npm run build
```

File hasil build akan berada di folder `dist/`

## Struktur Folder

```
src/
├── components/        # Komponen reusable
│   ├── Layout.jsx   # Layout utama dengan navbar
│   └── quiz/        # Komponen kuis
│       ├── MultipleChoiceQuestion.jsx
│       ├── DragDropQuestion.jsx
│       └── FillBlankQuestion.jsx
├── pages/           # Halaman aplikasi
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── StudentDashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── QuizGame.jsx
│   ├── Progress.jsx
│   ├── QuestionManagement.jsx
│   └── ScoresView.jsx
├── contexts/        # React contexts
│   └── AuthContext.jsx
├── services/        # API services
│   └── api.js
├── App.jsx         # Main app component
└── main.jsx        # Entry point
```

## Teknologi

- **React 18**: Library UI
- **Vite**: Build tool dan dev server
- **TailwindCSS**: Styling
- **Framer Motion**: Animasi
- **React Router**: Routing
- **Axios**: HTTP client

