# 📚 KENTECH Study Hub

A web-based study management platform built for students at Korea Institute of Energy Technology (KENTECH).  
Plan your tasks, track your progress, and stay motivated throughout the semester.

🔗 **Live Demo:** [https://kentech-study-hub.vercel.app](https://kentech-study-hub.vercel.app)

---

## ✨ Features

- ✅ **Task Management** — Add, edit, and delete study tasks with subject, due date, and priority
- 📊 **Progress Tracking** — Live progress bar showing completion percentage overall and per subject
- 🗂️ **Subject Categories** — Organize tasks by subject (Math, Physics, CS, etc.)
- 📅 **Due Date & Overdue Detection** — Tasks past their due date are automatically flagged
- 🔴 **Priority Levels** — High / Medium / Low priority with visual badges
- 🌙 **Dark Mode** — Toggle between light and dark themes (saved to localStorage)
- 💬 **Motivational Quotes** — Rotating study quotes on the home page
- 💾 **No Account Needed** — All data is saved locally in your browser via localStorage

---

## 📁 Project Structure
kentech-study-hub/

├── index.html        # Home page — hero, features, quote banner

├── planner.html      # Study Planner — task CRUD, filters, mini progress bar

├── dashboard.html    # Progress Dashboard — stats, subject breakdown, due-soon list

├── about.html        # About page — project info, tech stack, AI report

├── style.css         # Full design system (light + dark mode, responsive)

├── app.js            # All JavaScript logic (tasks, filters, dashboard, quotes)

└── README.md

---

## 🚀 How to Run Locally

No build step or dependencies required — it's a plain static website.

**Option 1 — Open directly:**
Just open index.html in your browser.

**Option 2 — Local dev server (recommended):**
Using VS Code Live Server extension:

Right-click index.html → Open with Live Server
Or using Python:

python -m http.server 8000

Then visit http://localhost:8000

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Page structure and semantic markup |
| CSS3 | Design system, dark mode, responsive layout |
| Vanilla JavaScript | Task CRUD, localStorage, DOM rendering |
| localStorage API | Client-side data persistence |
| Google Fonts | Inter + Space Grotesk typography |
| Vercel | Static site deployment |

---

## 📄 Pages

| Page | URL | Description |
|------|-----|-------------|
| Home | /index.html | Service intro, features overview, motivational quotes |
| Planner | /planner.html | Add/edit/delete tasks, filter by status and subject |
| Dashboard | /dashboard.html | Progress stats, subject breakdown, high-priority list |
| About | /about.html | Project info, tech stack, AI development report |

---

## 🤖 AI-Assisted Development

This project was built with AI assistance as part of Assignment 4 for Introduction to AI Programming, KENTECH Spring 2026.

**Tools used:** Claude (Anthropic), GitHub Copilot  
**Full AI development report** is included in the PRD PDF submission.

---

## 📬 Course Info

- **Course:** Introduction to AI Programming
- **Institution:** Korea Institute of Energy Technology (KENTECH)
- **Semester:** Spring 2026
- **Assignment:** Assignment 4 — PRD & AI-Assisted Web Service