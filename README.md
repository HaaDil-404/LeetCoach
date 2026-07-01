<div align="center">

# 🚀 LeetCoach AI

### Your AI-Powered Coding Interview Coach

*Daily challenges • Progressive hints • AI tutoring • Code reviews • RAG-powered knowledge base*

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Gemini](https://img.shields.io/badge/Gemini_AI-2.0_Flash-4285F4?style=flat-square&logo=google)](https://ai.google.dev)
[![LangChain](https://img.shields.io/badge/LangChain-RAG-1C3C3C?style=flat-square)](https://langchain.com)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector_Store-FF6F00?style=flat-square)](https://trychroma.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?style=flat-square&logo=mongodb)](https://mongodb.com)

</div>

---

## ✨ Features

### 🎯 Daily Coding Challenges
- Curated Easy / Medium / Hard problems assigned daily
- Streak tracking with gamification
- 100+ seeded LeetCode-style problems

### 🤖 AI-Powered Study Tools
| Tool | Description |
|------|-------------|
| **Progressive Hints** | 3-tier hints from conceptual nudge → algorithmic direction → pseudocode guidance |
| **Solution Explainer** | Beginner-friendly + detailed explanations with complexity analysis |
| **AI Tutor Chat** | Interactive DSA tutoring across 10 topic categories |
| **Code Review** | Logic analysis, bug detection, optimization suggestions, and scoring |
| **Knowledge Base (RAG)** | Vector-search powered answers from 11 curated DSA study guides |

### 🧠 RAG Knowledge Base (Day 4)
Full Retrieval-Augmented Generation pipeline using **LangChain** + **ChromaDB** + **Gemini**:
- 11 comprehensive DSA topic guides (~130-200 lines each)
- Google `text-embedding-004` for semantic embeddings
- ChromaDB in-process vector store with cosine similarity search
- Top-5 chunk retrieval → context augmentation → Gemini 2.0 Flash generation
- Source citations in every response
- Live RAG status badge UI with expandable detail panel

### 💅 Production UI Polish (Day 4)
- **Skeleton Loaders** — dedicated `SkeletonKnowledgeResult` for RAG answers
- **Toast Notifications** — animated success/error/info toasts with auto-dismiss
- **Error Handling** — detailed error cards with one-click Retry button
- **Empty States** — animated floating icons with descriptive copy
- **Better Typography** — fluid type scale, JetBrains Mono for code, Inter 800 for headings
- **Mobile Responsiveness** — full mobile nav drawer, responsive tab bar, fluid breakpoints
- **Reusable Components** — RAGStatusBadge, EmptyState, SkeletonLoader, Toast system
- **Performance** — lazy RAG init on first request, singleton vector store, concurrent guard

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (React + Vite)                 │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │Dashboard │ │Challenges│ │AI Tools  │ │Profile    │  │
│  └──────────┘ └──────────┘ └────┬─────┘ └───────────┘  │
│                                 │                       │
│   ┌──────┬──────┬────────┬──────┴────────────────┐      │
│   │Hints │Expl. │ Tutor  │ Review │ Knowledge Base│      │
│   └──────┴──────┴────────┴────────┴──────────────┘      │
│                     │  RAGStatusBadge                   │
│              Axios API Layer + JWT interceptors          │
└─────────────────────┼───────────────────────────────────┘
                      │ HTTP/JSON
┌─────────────────────┼───────────────────────────────────┐
│                 SERVER (Express.js)                      │
│                     │                                   │
│  ┌─────────────┐  ┌─┴───────────────────┐               │
│  │ Auth Routes │  │     AI Routes        │               │
│  │ /api/auth   │  │     /api/ai          │               │
│  └──────┬──────┘  └──────┬──────────────┘               │
│         │                │                              │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────────────────┐ │
│  │Auth         │  │Gemini       │  │RAG Service       │ │
│  │Controller   │  │Service      │  │(LangChain)       │ │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬───────┘ │
│         │                │                    │         │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────────┴───────┐ │
│  │MongoDB      │  │Gemini 2.0   │  │ChromaDB          │ │
│  │(Mongoose)   │  │Flash API    │  │In-Process Store  │ │
│  └─────────────┘  └─────────────┘  └──────────────────┘ │
│                                                         │
│               knowledge/ (11 .txt files)                │
└─────────────────────────────────────────────────────────┘
```

### RAG Query Flow

```
User: "How do I solve Two Sum?"
  │
  ▼
POST /api/ai/ask
  │
  ├─▶ 1. Embed query → GoogleGenerativeAIEmbeddings (text-embedding-004)
  │                     → 768-dimensional vector
  │
  ├─▶ 2. Similarity search → ChromaDB cosine similarity (top-k=5)
  │                          → Relevant chunks from arrays.txt, hashing.txt
  │
  ├─▶ 3. Build augmented prompt with retrieved context + instructions
  │
  └─▶ 4. Generate answer → Gemini 2.0 Flash
                           → { answer: "...", sources: ["arrays", "hashing"] }
```

---

## 📁 Folder Structure

```
LeetCoach/
├── client/                        # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── index.js           # Axios API layer + JWT interceptors
│   │   ├── components/
│   │   │   ├── EmptyState.jsx     # Reusable animated empty state
│   │   │   ├── Layout.jsx         # App layout with sidebar + mobile nav
│   │   │   ├── RAGStatusBadge.jsx # ⭐ Live RAG status indicator
│   │   │   ├── SkeletonLoader.jsx # Shimmer skeleton loaders (4 variants)
│   │   │   └── Toast.jsx          # Toast notification system + context
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # JWT auth state management
│   │   ├── pages/
│   │   │   ├── AIFeatures.jsx     # AI tools (5 tabs + RAGStatusBadge)
│   │   │   ├── DailyChallenges.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── Register.jsx
│   │   ├── App.jsx                # Router + route guards
│   │   ├── index.css              # Design system: theme tokens + animations
│   │   └── main.jsx               # Entry + providers (BrowserRouter, Auth, Toast)
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── server/                        # Express.js backend
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── aiController.js        # AI + RAG endpoint handlers
│   │   ├── authController.js      # Registration, login, profile
│   │   └── challengeController.js # Daily challenge CRUD
│   ├── data/
│   │   └── seedProblems.js        # 100+ LeetCode problems seeder
│   ├── knowledge/                 # ⭐ RAG knowledge base (11 files)
│   │   ├── arrays.txt
│   │   ├── binary-search.txt
│   │   ├── dynamic-programming.txt
│   │   ├── graphs.txt
│   │   ├── hashing.txt
│   │   ├── linked-list.txt
│   │   ├── queue.txt
│   │   ├── sliding-window.txt
│   │   ├── stack.txt
│   │   ├── trees.txt
│   │   └── two-pointers.txt
│   ├── middleware/
│   │   ├── auth.js                # JWT authentication guard
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   ├── DailyChallenge.js
│   │   ├── Problem.js
│   │   └── User.js
│   ├── routes/
│   │   ├── aiRoutes.js            # /api/ai/* (hints, explain, chat, review, ask, rag-status)
│   │   ├── authRoutes.js
│   │   └── challengeRoutes.js
│   ├── scripts/
│   │   └── initRAG.js             # ⭐ Standalone RAG pre-warm script
│   ├── services/
│   │   ├── challengeService.js    # Challenge generation logic
│   │   ├── geminiService.js       # Gemini AI: hints, explain, chat, review
│   │   └── ragService.js          # ⭐ Full RAG pipeline (LangChain + ChromaDB)
│   ├── utils/
│   │   └── generateToken.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js                  # Express app entry + RAG auto-init
│
└── README.md
```

---

## 🚀 Installation Guide

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Gemini API Key** ([Get one free](https://ai.google.dev/))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/LeetCoach.git
cd LeetCoach
```

### 2. Server Setup

```bash
cd server
npm install
```

Create a `.env` file in `server/`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/leetcoach
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=30d
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
```

Seed the problem database (one-time):

```bash
npm run seed
```

**(Optional)** Pre-warm the RAG knowledge base:

```bash
npm run init-rag
```

Start the development server:

```bash
npm run dev
```

> On startup, the RAG knowledge base auto-initializes:
> ```
> 🧠 Initializing RAG Knowledge Base...
>    📄 Loaded 11 knowledge documents
>    ✂️  Split into ~120 chunks
>    ✅ RAG initialized! 120 chunks embedded & stored in ChromaDB
> ```

### 3. Client Setup

```bash
cd ../client
npm install
npm run dev
```

### 4. Open the App

Navigate to **http://localhost:5173** in your browser.

---

## 📡 API Reference

### Authentication
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | `{ name, email, password }` | Register new user |
| `POST` | `/api/auth/login` | `{ email, password }` | Login |
| `GET` | `/api/auth/me` | — | Get current user profile |

### Challenges
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/challenges/generate` | — | Generate daily challenge |
| `GET` | `/api/challenges/today` | — | Get today's challenge |
| `PUT` | `/api/challenges/complete/:id` | — | Mark problem complete |

### AI Tools (all require `Authorization: Bearer <token>`)
| Method | Endpoint | Body | Description |
|--------|----------|------|-------------|
| `POST` | `/api/ai/hints` | `{ problemDescription, difficulty }` | Get progressive hints |
| `POST` | `/api/ai/explain` | `{ problemDescription, difficulty }` | Get solution explanation |
| `POST` | `/api/ai/chat` | `{ topic, question }` | Chat with AI tutor |
| `POST` | `/api/ai/review` | `{ code, problemDescription? }` | Get AI code review |
| `POST` | `/api/ai/ask` | `{ question }` | **RAG knowledge base query** |
| `GET` | `/api/ai/rag-status` | — | **RAG system health check** |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, Tailwind CSS 4, Framer Motion, Lucide Icons |
| **Backend** | Node.js 18+, Express 4, Mongoose ODM |
| **Database** | MongoDB |
| **AI Generation** | Google Gemini 2.0 Flash |
| **AI Embeddings** | Google `text-embedding-004` via `@langchain/google-genai` |
| **RAG** | LangChain, `@langchain/textsplitters`, ChromaDB |
| **Auth** | JWT (jsonwebtoken + bcryptjs) |

---

## 🔧 Troubleshooting

### RAG doesn't initialize
1. Verify `GEMINI_API_KEY` is set in `server/.env`
2. Run `npm run init-rag` to test in isolation and see detailed errors
3. Check that `server/knowledge/` contains the 11 `.txt` files

### ChromaDB errors
ChromaDB runs **in-process** (no external server needed). If you see connection errors, ensure you're NOT setting a `CHROMA_URL` environment variable pointing to an external server.

### Port already in use
Change `PORT` in `server/.env`. The client dev server runs on `5173` by default (Vite), server on `5000`.

---

## 📈 Changelog

| Day | Features |
|-----|---------|
| **Day 1** | Project setup, MongoDB models, auth (JWT), Express API skeleton |
| **Day 2** | Daily challenges, Gemini hints + explainer, basic React UI |
| **Day 3** | AI Tutor chat, Code Review, full AI Features page, Framer Motion |
| **Day 4** | ✅ **RAG pipeline** (LangChain + ChromaDB), knowledge base, RAGStatusBadge, skeleton loaders, toast system, error handling + retry, mobile polish, refined CSS design system |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Built with ❤️ using Gemini AI + LangChain + ChromaDB**

*Level up your DSA skills, one challenge at a time* 🧠✨

</div>
