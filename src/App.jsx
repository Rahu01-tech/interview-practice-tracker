import "./App.css";
import { useEffect, useMemo, useState } from "react";
import {
  Activity, ArrowDownUp, BookOpen, Check, CheckCircle2, ChevronDown,
  CircleHelp, Code2, Filter, Github, LayoutDashboard, ListChecks, Plus,
  Search, SlidersHorizontal, Sparkles, Target, Trash2, Pencil, X,
  Menu, PanelLeftClose, CircleDot, Clock3, Layers3, Braces
} from "lucide-react";
import { loadMachineStatus, loadQuestions, saveMachineStatus, saveQuestions } from "./utils/storage";

const CATEGORIES = ["DSA", "Git", "Technical"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const STATUSES = ["Pending", "In Progress", "Completed"];
const MACHINE_STATUSES = ["Not Started", "In Progress", "Completed"];

const initialForm = {
  title: "",
  category: "DSA",
  difficulty: "Medium",
  status: "Pending",
  notes: "",
};

const demoQuestions = [
  { id: "sample-1", title: "Two Sum", category: "DSA", difficulty: "Easy", status: "Completed", notes: "Hash map approach", createdAt: Date.now() - 600000 },
  { id: "sample-2", title: "Explain Git rebase vs merge", category: "Git", difficulty: "Medium", status: "In Progress", notes: "", createdAt: Date.now() - 500000 },
  { id: "sample-3", title: "How does the JavaScript event loop work?", category: "Technical", difficulty: "Medium", status: "Pending", notes: "", createdAt: Date.now() - 400000 },
  { id: "sample-4", title: "Longest substring without repeating characters", category: "DSA", difficulty: "Medium", status: "In Progress", notes: "Sliding window", createdAt: Date.now() - 300000 },
];

function StatCard({ icon: Icon, label, value, helper, tone = "pink" }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={19} /></div>
      <p className="stat-label">{label}</p>
      <div className="stat-value-row"><strong>{value}</strong></div>
      <p className="stat-helper">{helper}</p>
    </article>
  );
}

function ProgressBar({ value }) {
  return (
    <div className="progress-track" role="progressbar" aria-label="Overall completion" aria-valuenow={value} aria-valuemin="0" aria-valuemax="100">
      <div className="progress-fill" style={{ width: `${value}%` }} />
    </div>
  );
}

function QuestionModal({ open, onClose, onSave, editingQuestion }) {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    setForm(editingQuestion ? {
      title: editingQuestion.title || "",
      category: editingQuestion.category || "DSA",
      difficulty: editingQuestion.difficulty || "Medium",
      status: editingQuestion.status || "Pending",
      notes: editingQuestion.notes || "",
    } : initialForm);
    setErrors({});
  }, [open, editingQuestion]);

  if (!open) return null;

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: "" }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.title.trim()) nextErrors.title = "Enter a question or topic title.";
    if (form.title.trim().length > 120) nextErrors.title = "Keep the title under 120 characters.";
    if (!CATEGORIES.includes(form.category)) nextErrors.category = "Choose a valid category.";
    if (!DIFFICULTIES.includes(form.difficulty)) nextErrors.difficulty = "Choose a difficulty.";
    if (!STATUSES.includes(form.status)) nextErrors.status = "Choose a status.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({ ...form, title: form.title.trim(), notes: form.notes.trim() });
  }

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">{editingQuestion ? "UPDATE YOUR TRACKER" : "ADD TO YOUR TRACKER"}</p>
            <h2 id="modal-title">{editingQuestion ? "Edit question" : "Add a question"}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} aria-label="Close dialog"><X size={19} /></button>
        </div>
        <form onSubmit={submit} noValidate>
          <label className="field-label" htmlFor="question-title">Question / topic <span>*</span></label>
          <input id="question-title" autoFocus maxLength={120} value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. Reverse a linked list" />
          {errors.title && <p className="field-error">{errors.title}</p>}
          <div className="form-grid">
            <div>
              <label className="field-label" htmlFor="question-category">Category <span>*</span></label>
              <select id="question-category" value={form.category} onChange={(e) => update("category", e.target.value)}>
                {CATEGORIES.map((item) => <option key={item}>{item}</option>)}
              </select>
              {errors.category && <p className="field-error">{errors.category}</p>}
            </div>
            <div>
              <label className="field-label" htmlFor="question-difficulty">Difficulty <span>*</span></label>
              <select id="question-difficulty" value={form.difficulty} onChange={(e) => update("difficulty", e.target.value)}>
                {DIFFICULTIES.map((item) => <option key={item}>{item}</option>)}
              </select>
              {errors.difficulty && <p className="field-error">{errors.difficulty}</p>}
            </div>
          </div>
          <label className="field-label" htmlFor="question-status">Status <span>*</span></label>
          <select id="question-status" value={form.status} onChange={(e) => update("status", e.target.value)}>
            {STATUSES.map((item) => <option key={item}>{item}</option>)}
          </select>
          {errors.status && <p className="field-error">{errors.status}</p>}
          <label className="field-label" htmlFor="question-notes">Notes <span className="optional">(optional)</span></label>
          <textarea id="question-notes" rows="3" maxLength={500} value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="Approach, links, or things to revise…" />
          <div className="modal-actions">
            <button className="button button-secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="button button-primary" type="submit"><Check size={16} /> {editingQuestion ? "Save changes" : "Add question"}</button>
          </div>
        </form>
      </section>
    </div>
  );
}

function EmptyState({ searched, onAdd }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{searched ? <Search size={24} /> : <ListChecks size={24} />}</div>
      <h3>{searched ? "No matching questions" : "Your tracker is ready"}</h3>
      <p>{searched ? "Try another search or adjust your filters." : "Add your first question to start tracking your preparation."}</p>
      {!searched && <button className="button button-primary" onClick={onAdd}><Plus size={16} /> Add your first question</button>}
    </div>
  );
}

function QuestionRow({ question, onEdit, onDelete, onStatusChange }) {
  return (
    <article className="question-row">
      <div className={`question-check ${question.status === "Completed" ? "is-complete" : ""}`}>
        {question.status === "Completed" ? <Check size={15} /> : <Code2 size={15} />}
      </div>
      <div className="question-main">
        <h3 className={question.status === "Completed" ? "completed-title" : ""}>{question.title}</h3>
        {question.notes && <p className="question-notes">{question.notes}</p>}
        <div className="question-tags">
          <span className={`category-tag category-${question.category.toLowerCase()}`}>{question.category}</span>
          <span className={`difficulty-tag difficulty-${question.difficulty.toLowerCase()}`}>{question.difficulty}</span>
        </div>
      </div>
      <div className="question-status">
        <label className="sr-only" htmlFor={`status-${question.id}`}>Status for {question.title}</label>
        <select id={`status-${question.id}`} className={`status-select status-${question.status.toLowerCase().replace(" ", "-")}`} value={question.status} onChange={(e) => onStatusChange(question.id, e.target.value)}>
          {STATUSES.map((status) => <option key={status}>{status}</option>)}
        </select>
      </div>
      <div className="row-actions">
        <button className="icon-button" onClick={() => onEdit(question)} aria-label={`Edit ${question.title}`} title="Edit"><Pencil size={16} /></button>
        <button className="icon-button danger-hover" onClick={() => onDelete(question.id)} aria-label={`Delete ${question.title}`} title="Delete"><Trash2 size={16} /></button>
      </div>
    </article>
  );
}

export default function App() {
  const [questions, setQuestions] = useState(loadQuestions);
  const [machineStatus, setMachineStatus] = useState(loadMachineStatus);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [difficultyFilter, setDifficultyFilter] = useState("All difficulties");
  const [sortOrder, setSortOrder] = useState("newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeView, setActiveView] = useState("Overview");
  const [toast, setToast] = useState("");

  useEffect(() => saveQuestions(questions), [questions]);
  useEffect(() => saveMachineStatus(machineStatus), [machineStatus]);

  const stats = useMemo(() => {
    const completed = questions.filter((q) => q.status === "Completed");
    const dsaCompleted = completed.filter((q) => q.category === "DSA").length;
    const interviewCompleted = completed.filter((q) => q.category === "Technical" || q.category === "Git").length;
    return {
      total: questions.length,
      completed: completed.length,
      dsaCompleted,
      interviewCompleted,
      progress: questions.length ? Math.round((completed.length / questions.length) * 100) : 0,
      pending: questions.filter((q) => q.status === "Pending").length,
      inProgress: questions.filter((q) => q.status === "In Progress").length,
    };
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    const query = search.trim().toLowerCase();
    return questions
      .filter((q) => !query || q.title.toLowerCase().includes(query) || (q.notes || "").toLowerCase().includes(query))
      .filter((q) => categoryFilter === "All categories" || q.category === categoryFilter)
      .filter((q) => statusFilter === "All statuses" || q.status === statusFilter)
      .filter((q) => difficultyFilter === "All difficulties" || q.difficulty === difficultyFilter)
      .sort((a, b) => sortOrder === "oldest" ? a.createdAt - b.createdAt : b.createdAt - a.createdAt);
  }, [questions, search, categoryFilter, statusFilter, difficultyFilter, sortOrder]);

  const hasActiveFilters = Boolean(search.trim()) || categoryFilter !== "All categories" || statusFilter !== "All statuses" || difficultyFilter !== "All difficulties";
  const machineProgress = machineStatus === "Completed" ? 100 : machineStatus === "In Progress" ? 50 : 0;

  function notify(message) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  function saveQuestion(form) {
    if (editingQuestion) {
      setQuestions((current) => current.map((q) => q.id === editingQuestion.id ? { ...q, ...form } : q));
      notify("Question updated");
    } else {
      const question = { ...form, id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`, createdAt: Date.now() };
      setQuestions((current) => [question, ...current]);
      notify("Question added");
    }
    setModalOpen(false);
    setEditingQuestion(null);
  }

  function editQuestion(question) {
    setEditingQuestion(question);
    setModalOpen(true);
  }

  function deleteQuestion(id) {
    const question = questions.find((q) => q.id === id);
    if (!question) return;
    if (!window.confirm(`Delete "${question.title}" from your tracker?`)) return;
    setQuestions((current) => current.filter((q) => q.id !== id));
    notify("Question deleted");
  }

  function changeStatus(id, status) {
    setQuestions((current) => current.map((q) => q.id === id ? { ...q, status } : q));
  }

  function clearFilters() {
    setSearch("");
    setCategoryFilter("All categories");
    setStatusFilter("All statuses");
    setDifficultyFilter("All difficulties");
  }

  function openAdd() {
    setEditingQuestion(null);
    setModalOpen(true);
  }

  function loadDemoData() {
    if (questions.length && !window.confirm("Add the sample questions to your existing tracker?")) return;
    setQuestions((current) => [...demoQuestions.map((q) => ({ ...q, id: `${q.id}-${Date.now()}` })), ...current]);
    notify("Sample questions added");
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenuOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Braces size={21} /></div>
          <div><strong>prep<span>track</span></strong><small>INTERVIEW WORKSPACE</small></div>
          <button className="icon-button sidebar-close" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="workspace-label">WORKSPACE</div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          <button className={`nav-item ${activeView === "Overview" ? "active" : ""}`} onClick={() => { setActiveView("Overview"); setMobileMenuOpen(false); }}><LayoutDashboard size={18} /> Overview <span className="nav-indicator" /></button>
          <button className={`nav-item ${activeView === "Questions" ? "active" : ""}`} onClick={() => { setActiveView("Questions"); setMobileMenuOpen(false); document.getElementById("questions-section")?.scrollIntoView({ behavior: "smooth" }); }}><ListChecks size={18} /> Question tracker <span className="nav-count">{questions.length}</span></button>
        </nav>
        <div className="sidebar-divider" />
        <div className="workspace-label">YOUR PREPARATION</div>
        <div className="sidebar-category"><span className="side-dot pink-dot" /> DSA practice <strong>{questions.filter(q => q.category === "DSA" && q.status === "Completed").length}</strong></div>
        <div className="sidebar-category"><span className="side-dot purple-dot" /> Technical <strong>{questions.filter(q => q.category === "Technical" && q.status === "Completed").length}</strong></div>
        <div className="sidebar-category"><span className="side-dot green-dot" /> Git & workflow <strong>{questions.filter(q => q.category === "Git" && q.status === "Completed").length}</strong></div>
        <div className="sidebar-bottom">
          <div className="sidebar-tip"><div className="tip-icon"><Sparkles size={16} /></div><strong>Small steps add up.</strong><p>Consistent practice beats last-minute cramming.</p><div className="tip-progress"><span style={{ width: `${stats.progress}%` }} /></div><small>{stats.progress}% overall progress</small></div>
          <div className="sidebar-footer"><span className="avatar">P</span><div><strong>Preparation mode</strong><small>Local workspace</small></div><CircleDot size={12} className="online-dot" /></div>
        </div>
      </aside>

      {mobileMenuOpen && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileMenuOpen(false)} />}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-menu" onClick={() => setMobileMenuOpen(true)} aria-label="Open menu"><Menu size={20} /></button>
            <span className="breadcrumb">Workspace</span><span className="breadcrumb-slash">/</span><strong>{activeView}</strong>
          </div>
          <div className="topbar-right"><span className="today-pill"><span className="live-dot" /> Your progress, at a glance</span><div className="top-avatar">P</div></div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <p className="eyebrow"><Sparkles size={13} /> YOUR INTERVIEW JOURNEY</p>
              <h1>Make progress <span>every day.</span></h1>
              <p className="welcome-copy">A little practice today is a big advantage tomorrow. Keep going.</p>
            </div>
            <button className="button button-primary add-top-button" onClick={openAdd}><Plus size={17} /> Add question</button>
          </section>

          <section className="stats-grid" aria-label="Preparation statistics">
            <StatCard icon={Layers3} label="Total questions" value={stats.total} helper={`${stats.pending} pending to tackle`} tone="pink" />
            <StatCard icon={Code2} label="DSA completed" value={stats.dsaCompleted} helper="Problem-solving practice" tone="purple" />
            <StatCard icon={BookOpen} label="Interview questions" value={stats.interviewCompleted} helper="Git + technical completed" tone="green" />
            <StatCard icon={Target} label="Overall completion" value={`${stats.progress}%`} helper={`${stats.completed} of ${stats.total} completed`} tone="orange" />
          </section>

          <section className="overview-grid">
            <article className="panel progress-panel">
              <div className="panel-heading"><div><p className="eyebrow">YOUR MOMENTUM</p><h2>Preparation progress</h2></div><span className="heading-icon"><Activity size={18} /></span></div>
              <div className="progress-summary"><div><strong>{stats.progress}<span>%</span></strong><p>of your question list completed</p></div><div className="progress-ring" style={{ "--progress": `${stats.progress * 3.6}deg` }}><div><strong>{stats.progress}%</strong><small>complete</small></div></div></div>
              <ProgressBar value={stats.progress} />
              <div className="progress-legend"><span><i className="legend-dot completed-dot" /> Completed <strong>{stats.completed}</strong></span><span><i className="legend-dot progress-dot" /> In progress <strong>{stats.inProgress}</strong></span><span><i className="legend-dot pending-dot" /> Pending <strong>{stats.pending}</strong></span></div>
            </article>
            <article className="panel machine-panel">
              <div className="panel-heading"><div><p className="eyebrow">BUILD BY DOING</p><h2>Machine coding</h2></div><span className="heading-icon machine-icon"><Code2 size={18} /></span></div>
              <p className="machine-copy">Track your hands-on UI challenges separately from individual questions.</p>
              <label className="field-label" htmlFor="machine-status">Current status</label>
              <select id="machine-status" className="machine-select" value={machineStatus} onChange={(e) => setMachineStatus(e.target.value)}>
                {MACHINE_STATUSES.map((status) => <option key={status}>{status}</option>)}
              </select>
              <div className="machine-progress-label"><span>Challenge progress</span><strong>{machineProgress}%</strong></div>
              <ProgressBar value={machineProgress} />
              <div className="machine-foot"><span className={`machine-status-dot ${machineStatus === "Completed" ? "done" : machineStatus === "In Progress" ? "working" : ""}`} />{machineStatus === "Completed" ? "Challenge completed — great work!" : machineStatus === "In Progress" ? "Keep building and testing." : "Ready when you are."}</div>
            </article>
          </section>

          <section className="panel tracker-panel" id="questions-section">
            <div className="tracker-heading">
              <div><p className="eyebrow">STAY ORGANIZED</p><h2>Question tracker <span className="count-chip">{questions.length}</span></h2><p className="section-subtitle">Manage the topics you're working through.</p></div>
              <button className="button button-primary" onClick={openAdd}><Plus size={16} /> Add question</button>
            </div>
            <div className="filter-toolbar">
              <div className="search-wrap"><Search size={17} /><input aria-label="Search questions" placeholder="Search questions or notes…" value={search} onChange={(e) => setSearch(e.target.value)} /><kbd>/</kbd></div>
              <div className="filter-select-wrap"><Filter size={15} /><select aria-label="Filter by category" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}><option>All categories</option>{CATEGORIES.map((v) => <option key={v}>{v}</option>)}</select><ChevronDown size={13} /></div>
              <div className="filter-select-wrap"><select aria-label="Filter by status" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}><option>All statuses</option>{STATUSES.map((v) => <option key={v}>{v}</option>)}</select><ChevronDown size={13} /></div>
              <div className="filter-select-wrap"><select aria-label="Filter by difficulty" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}><option>All difficulties</option>{DIFFICULTIES.map((v) => <option key={v}>{v}</option>)}</select><ChevronDown size={13} /></div>
              <button className="icon-button sort-button" title="Toggle question order" aria-label="Toggle question order" onClick={() => setSortOrder((v) => v === "newest" ? "oldest" : "newest")}><ArrowDownUp size={16} /></button>
            </div>
            {hasActiveFilters && <div className="filter-summary"><span><SlidersHorizontal size={14} /> Showing {filteredQuestions.length} of {questions.length} questions</span><button onClick={clearFilters}>Clear filters <X size={13} /></button></div>}
            <div className="question-list">
              {filteredQuestions.length ? filteredQuestions.map((question) => <QuestionRow key={question.id} question={question} onEdit={editQuestion} onDelete={deleteQuestion} onStatusChange={changeStatus} />) : (
                <EmptyState searched={hasActiveFilters} onAdd={openAdd} />
              )}
            </div>
            <div className="list-footer"><span>Showing <strong>{filteredQuestions.length}</strong> question{filteredQuestions.length === 1 ? "" : "s"}</span><span><CircleHelp size={14} /> Changes save automatically</span></div>
          </section>

          {questions.length === 0 && (
            <div className="demo-callout"><div className="demo-callout-icon"><Sparkles size={18} /></div><div><strong>Want to explore the dashboard?</strong><p>Add a few sample questions to see how the stats and progress update.</p></div><button className="button button-secondary" onClick={loadDemoData}>Load sample data</button></div>
          )}
          <footer className="page-footer"><span>PrepTrack <span className="footer-dot">·</span> Built for consistent progress</span><span><span className="storage-dot" /> Saved locally in your browser</span></footer>
        </div>
      </main>

      <QuestionModal open={modalOpen} onClose={() => { setModalOpen(false); setEditingQuestion(null); }} onSave={saveQuestion} editingQuestion={editingQuestion} />
      {toast && <div className="toast" role="status"><CheckCircle2 size={17} /> {toast}</div>}
    </div>
  );
}
