# CodeInsight AI - End-to-End Project Description & Architecture

## 1. Overview: What is this project?
**CodeInsight AI** is an intelligent, full-stack web application that allows users to store, analyze, and review their code snippets using AI. 

By integrating with the Google Gemini API, the platform analyzes user-submitted code and automatically generates:
- **Time and Space Complexity Analysis** (Big-O notation).
- **Algorithm & DSA Pattern Identification** (e.g., Sliding Window, Dynamic Programming).
- **Plain-English Explanations** of how the code works.
- **AI-Generated Interview/Viva Q&A** to help users practice for technical interviews.

The platform features a modern, visually rich UI with glassmorphism, animated gradients, and dark-themed aesthetics.

---

## 2. How It Works (The User Journey)

1. **Authentication:** 
   - Users register or log in securely using email and password.
   - The system uses JWTs (Access and Refresh tokens) for session management, providing a seamless and secure experience.

2. **Dashboard & Code Management:** 
   - Upon logging in, users are greeted with a dashboard displaying their previously analyzed code snippets as visually rich cards.
   - Users can filter snippets by language, search by title, and bookmark important snippets for focused revision.

3. **Uploading & AI Analysis:** 
   - A user clicks "Upload New" and submits a code snippet (e.g., Python, C++, or JavaScript).
   - The backend sends this code to the **Google Gemini API** with a highly structured prompt to enforce a strict JSON response.
   - The AI processes the code and returns the complexities, pattern, explanation, and 5 practice interview questions.
   - The result is saved to the database and instantly displayed to the user.

4. **Review & Interview Prep:** 
   - Users can click on any snippet to view its full detailed analysis.
   - They can view the highlighted code, read the AI's explanation, and interact with the "Viva Q&A" section in a practice mode (where answers are hidden until clicked) to simulate real interview conditions.

---

## 3. The Architecture

The project utilizes a Monorepo structure containing a decoupled frontend and backend, communicating via RESTful APIs.

### A. Frontend (Client-Side)
- **Framework:** React.js (bootstrapped with Vite for fast builds).
- **Styling & UI:** Tailwind CSS for layout and styling, Framer Motion for complex micro-animations and page transitions, and Lucide React for icons.
- **Components:** `React Syntax Highlighter` is used for rendering formatted code blocks.
- **State & Routing:** `React Router DOM` for navigation and `Context API` for global authentication state. `Axios` interceptors automatically handle the refreshing of JWT tokens.

### B. Backend (Server-Side API)
- **Framework:** Node.js with Express.js.
- **Security:** `bcryptjs` for password hashing, `helmet` for HTTP security headers, and `express-validator` for input validation.
- **AI Integration:** The `@google/generative-ai` SDK connects the backend to the Gemini 1.5 Flash model.
- **Architecture Pattern:** Standard MVC (Controllers, Middlewares, Routes, Services, Models). All LLM interactions are abstracted into a dedicated `gemini.service.js`.

### C. Database (Data Layer)
- **System:** MySQL (Relational Database).
- **ORM:** `Sequelize` is used to define relationships and interact with the database programmatically.
- **Core Models & Relationships:**
  - **User:** Stores credentials and profile data.
  - **CodeSnippet:** Belongs to a User. Stores the raw code, language, and title.
  - **Analysis:** Has a one-to-one relationship with a CodeSnippet. Stores the AI-generated algorithm name, complexities, summary, explanation, and a JSON array of viva questions.
  - **Bookmark:** A many-to-many junction mapping Users to their bookmarked CodeSnippets.

---

## 4. System Flow & Data Lifecycle (AI Analysis)

1. **Client Request:** The React frontend sends the raw code and language to the backend via `POST /api/code/upload` and subsequently triggers `POST /api/analysis/analyze/:snippetId`.
2. **AI Service:** 
   - The `AnalysisController` passes the raw code to `gemini.service.js`.
   - A strict prompt is built instructing Gemini to act as a DSA tutor and return **only** valid JSON.
3. **Response Parsing:** 
   - The backend receives the LLM response, strips any accidental markdown formatting using `responseParser.js`, and parses the JSON.
4. **Database Storage:** The structured AI data is saved into the `Analysis` MySQL table via Sequelize.
5. **UI Rendering:** The frontend receives the response and animates the new snippet card into the user's dashboard.

---

## 5. Folder Directory Breakdown

### Backend (`/server`)
```text
server/
 ├── config/         # db.js (Sequelize MySQL connection setup)
 ├── controllers/    # auth, code, and analysis controllers
 ├── middleware/     # authMiddleware (JWT checks), errorHandler, validation
 ├── models/         # Sequelize schemas: User, CodeSnippet, Analysis, Bookmark
 ├── routes/         # Express API route definitions
 ├── services/       # External API integrations (gemini.service.js)
 ├── utils/          # promptBuilder, responseParser
 ├── .env            # Server environment variables
 └── server.js       # Main entry point for the Express server
```

### Frontend (`/client`)
```text
client/
 ├── src/
 │   ├── api/        # Axios instance, API call wrappers (auth.api.js, code.api.js)
 │   ├── components/ # Reusable UI (Navbar, CodeCard, Loader, Modal, Badges)
 │   ├── context/    # AuthContext for global user state
 │   ├── hooks/      # Custom React hooks (useAuth, useCode)
 │   ├── pages/      # Route components (Landing, Login, Dashboard, AnalysisResult)
 │   ├── utils/      # Helper functions (date formatting, language maps)
 │   ├── App.jsx     # Main React Router setup
 │   └── main.jsx    # React DOM root
 ├── tailwind.config.js # Tailwind CSS theme and styling rules
 └── vite.config.js  # Vite bundler config
```

## Summary
CodeInsight AI is a modern, AI-powered application that seamlessly bridges the gap between code storage and intelligent code review. By utilizing an Express/MySQL backend for robust data management and a React/Framer Motion frontend for a premium user experience, it acts as a personal AI tutor for software engineers.
