# PrepTrack — Interview Practice Tracker

A responsive interview-preparation dashboard built with React and Vite. It helps track DSA, Git, and technical interview questions without requiring a backend.

## Features

- Dashboard metrics for total questions, completed DSA problems, completed interview questions, and overall completion.
- Add, edit, delete, and update question status.
- Category, difficulty, and status fields.
- Combined search and filters for category, status, and difficulty.
- Sort questions by newest or oldest.
- LocalStorage persistence for questions and machine-coding status.
- Progress bars and completion ring update from real stored data.
- Empty state, no-results state, and form validation.
- Responsive desktop and mobile layout.
- Optional sample data to preview the dashboard.

## Tech stack

- React
- Vite
- Lucide React icons
- CSS
- Browser LocalStorage

## Setup

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Deploy to Vercel

1. Push this project to a GitHub repository.
2. Import the repository into Vercel.
3. Use `npm run build` as the build command.
4. Use `dist` as the output directory.
5. Deploy.

No environment variables or backend are required.

## Data and assumptions

- All data is stored in the current browser's LocalStorage. It does not sync across browsers or devices.
- “Interview questions completed” means completed items in the Technical and Git categories.
- “DSA completed” counts completed questions in the DSA category.
- Overall progress is `completed questions / total questions * 100`, rounded to the nearest whole percentage. An empty tracker shows 0%.
- Machine-coding status is tracked separately from the question list. Its visual progress is 0% for Not Started, 50% for In Progress, and 100% for Completed.
- Sample data is only added when the user chooses to load it.
- Deleting a question asks for confirmation.

## Suggested demo video (1–2 minutes)

1. Show the dashboard and progress cards.
2. Add a question and demonstrate required-field validation.
3. Change its status to Completed and show the statistics update.
4. Search for a question and combine category/status/difficulty filters.
5. Edit and delete a question.
6. Refresh the page to demonstrate LocalStorage persistence.
7. Resize to a mobile viewport.
