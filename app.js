/* =========================================================
   KENTECH Study Hub — app.js
   Features: task CRUD, localStorage, progress tracking,
   dark mode, motivational quotes, filters
   ========================================================= */

// ── Dark mode ──────────────────────────────────────────────
const darkToggle = document.getElementById('darkToggle');
const savedDark = localStorage.getItem('ksh-dark') === 'true';
if (savedDark) document.body.classList.add('dark');
if (darkToggle) {
  darkToggle.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
  darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('ksh-dark', isDark);
    darkToggle.textContent = isDark ? '☀️' : '🌙';
  });
}

// ── Hamburger ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
}

// ── Motivational quotes ────────────────────────────────────
const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Study hard, for the well is deep, and our brains are shallow.", author: "Richard Baxter" },
  { text: "The more that you read, the more things you will know.", author: "Dr. Seuss" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
];

const quoteText = document.getElementById('quoteText');
const quoteAuthor = document.getElementById('quoteAuthor');
const newQuoteBtn = document.getElementById('newQuote');

let quoteIdx = Math.floor(Math.random() * QUOTES.length);
function setQuote(idx) {
  if (!quoteText) return;
  quoteText.textContent = `"${QUOTES[idx].text}"`;
  quoteAuthor.textContent = `— ${QUOTES[idx].author}`;
}
if (quoteText) setQuote(quoteIdx);
if (newQuoteBtn) {
  newQuoteBtn.addEventListener('click', () => {
    quoteIdx = (quoteIdx + 1) % QUOTES.length;
    setQuote(quoteIdx);
  });
}

// ── Task storage helpers ───────────────────────────────────
const STORAGE_KEY = 'ksh-tasks';

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch { return []; }
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function generateId() {
  return 'task-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
}

// ── Planner page ───────────────────────────────────────────
const taskList = document.getElementById('taskList');
if (taskList) {
  const addTaskBtn  = document.getElementById('addTaskBtn');
  const taskTitle   = document.getElementById('taskTitle');
  const taskSubject = document.getElementById('taskSubject');
  const taskDue     = document.getElementById('taskDue');
  const taskPriority = document.getElementById('taskPriority');
  const emptyState  = document.getElementById('emptyState');
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const filterSubject = document.getElementById('filterSubject');
  const progressLabel = document.getElementById('progressLabel');
  const miniProgressFill = document.getElementById('miniProgressFill');
  const progressPct = document.getElementById('progressPct');

  let currentFilter = 'all';
  let currentSubjectFilter = '';
  let editingId = null;

  // Render tasks
  function renderTasks() {
    const tasks = loadTasks();
    let filtered = tasks.filter(t => {
      if (currentFilter === 'active' && t.done) return false;
      if (currentFilter === 'completed' && !t.done) return false;
      if (currentSubjectFilter && t.subject !== currentSubjectFilter) return false;
      return true;
    });

    taskList.innerHTML = '';
    if (filtered.length === 0) {
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      filtered.forEach(task => taskList.appendChild(createTaskEl(task)));
    }
    updateProgress(tasks);
  }

  function isOverdue(dueStr) {
    if (!dueStr) return false;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const due = new Date(dueStr);
    return due < today;
  }

  function createTaskEl(task) {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.done ? ' done' : '');
    li.dataset.id = task.id;

    const overdue = !task.done && isOverdue(task.dueDate);

    li.innerHTML = `
      <div class="task-check" title="Toggle complete">${task.done ? '✓' : ''}</div>
      <div class="task-body">
        <div class="task-title">${escapeHtml(task.title)}</div>
        <div class="task-meta">
          ${task.subject ? `<span class="task-tag">${escapeHtml(task.subject)}</span>` : ''}
          <span class="task-tag prio-${task.priority}">${capitalize(task.priority)}</span>
          ${overdue ? '<span class="task-tag tag-overdue">Overdue</span>' : ''}
          ${task.dueDate ? `<span class="task-due-text">Due ${formatDate(task.dueDate)}</span>` : ''}
        </div>
      </div>
      <div class="task-actions">
        <button class="task-btn edit" title="Edit">✏️</button>
        <button class="task-btn delete" title="Delete">🗑️</button>
      </div>
    `;

    // Toggle done
    li.querySelector('.task-check').addEventListener('click', () => {
      const tasks = loadTasks();
      const t = tasks.find(x => x.id === task.id);
      if (t) { t.done = !t.done; saveTasks(tasks); renderTasks(); }
    });

    // Edit
    li.querySelector('.edit').addEventListener('click', () => {
      editingId = task.id;
      taskTitle.value = task.title;
      taskSubject.value = task.subject || '';
      taskDue.value = task.dueDate || '';
      taskPriority.value = task.priority || 'medium';
      addTaskBtn.textContent = 'Update Task';
      taskTitle.focus();
    });

    // Delete
    li.querySelector('.delete').addEventListener('click', () => {
      const tasks = loadTasks().filter(x => x.id !== task.id);
      saveTasks(tasks);
      renderTasks();
    });

    return li;
  }

  function updateProgress(tasks) {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    if (progressLabel) progressLabel.textContent = `${done} / ${total} completed`;
    if (miniProgressFill) miniProgressFill.style.width = pct + '%';
    if (progressPct) progressPct.textContent = pct + '%';
  }

  // Add / update task
  addTaskBtn.addEventListener('click', () => {
    const title = taskTitle.value.trim();
    if (!title) { taskTitle.focus(); taskTitle.style.borderColor = 'var(--red)'; return; }
    taskTitle.style.borderColor = '';

    const tasks = loadTasks();
    if (editingId) {
      const t = tasks.find(x => x.id === editingId);
      if (t) {
        t.title = title;
        t.subject = taskSubject.value;
        t.dueDate = taskDue.value;
        t.priority = taskPriority.value;
      }
      editingId = null;
      addTaskBtn.textContent = 'Add Task';
    } else {
      tasks.push({
        id: generateId(),
        title,
        subject: taskSubject.value,
        dueDate: taskDue.value,
        priority: taskPriority.value,
        done: false,
        createdAt: Date.now(),
      });
    }
    saveTasks(tasks);
    taskTitle.value = ''; taskSubject.value = ''; taskDue.value = ''; taskPriority.value = 'medium';
    renderTasks();
  });

  // Enter key
  taskTitle.addEventListener('keydown', e => { if (e.key === 'Enter') addTaskBtn.click(); });

  // Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.dataset.filter;
      renderTasks();
    });
  });

  if (filterSubject) {
    filterSubject.addEventListener('change', () => {
      currentSubjectFilter = filterSubject.value;
      renderTasks();
    });
  }

  renderTasks();
}

// ── Dashboard page ─────────────────────────────────────────
const statTotal = document.getElementById('statTotal');
if (statTotal) {
  function renderDashboard() {
    const tasks = loadTasks();
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const active = tasks.filter(t => !t.done).length;
    const overdue = tasks.filter(t => !t.done && isOverdue2(t.dueDate)).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);

    document.getElementById('statTotal').textContent = total;
    document.getElementById('statDone').textContent = done;
    document.getElementById('statActive').textContent = active;
    document.getElementById('statOverdue').textContent = overdue;
    document.getElementById('overallFill').style.width = pct + '%';
    document.getElementById('overallPct').textContent = pct + '%';

    // Subject breakdown
    const sbDiv = document.getElementById('subjectBreakdown');
    const subjects = [...new Set(tasks.map(t => t.subject).filter(Boolean))];
    if (subjects.length === 0) {
      sbDiv.innerHTML = '<p class="empty-hint">No tasks yet — head to the Planner to add some!</p>';
    } else {
      sbDiv.innerHTML = subjects.map(s => {
        const sTotal = tasks.filter(t => t.subject === s).length;
        const sDone  = tasks.filter(t => t.subject === s && t.done).length;
        const sPct   = Math.round((sDone / sTotal) * 100);
        return `
          <div class="subj-row">
            <div class="subj-header"><span>${escapeHtml(s)}</span><span>${sDone}/${sTotal} · ${sPct}%</span></div>
            <div class="subj-track"><div class="subj-fill" style="width:${sPct}%"></div></div>
          </div>`;
      }).join('');
    }

    // High priority
    const hpList = document.getElementById('highPriorityList');
    const hp = tasks.filter(t => t.priority === 'high' && !t.done);
    hpList.innerHTML = hp.length
      ? hp.map(t => `<li class="dash-task-item high">${escapeHtml(t.title)}${t.dueDate ? ' <span style="opacity:.6;font-size:.75rem">· ' + formatDate(t.dueDate) + '</span>' : ''}</li>`).join('')
      : '<li class="empty-hint">No high priority tasks.</li>';

    // Due soon (next 3 days)
    const soon = new Date(today); soon.setDate(soon.getDate() + 3);
    const dsList = document.getElementById('dueSoonList');
    const ds = tasks.filter(t => {
      if (!t.dueDate || t.done) return false;
      const d = new Date(t.dueDate);
      return d >= today && d <= soon;
    }).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    dsList.innerHTML = ds.length
      ? ds.map(t => `<li class="dash-task-item">${escapeHtml(t.title)} <span style="opacity:.6;font-size:.75rem">· ${formatDate(t.dueDate)}</span></li>`).join('')
      : '<li class="empty-hint">Nothing due in the next 3 days.</li>';
  }

  function isOverdue2(dueStr) {
    if (!dueStr) return false;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    return new Date(dueStr) < today;
  }

  const clearAllBtn = document.getElementById('clearAllBtn');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      if (confirm('Clear all tasks? This cannot be undone.')) {
        localStorage.removeItem(STORAGE_KEY);
        renderDashboard();
      }
    });
  }

  renderDashboard();
}

// ── Utilities ──────────────────────────────────────────────
function escapeHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function capitalize(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function isOverdue(dueStr) {
  if (!dueStr) return false;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return new Date(dueStr + 'T00:00:00') < today;
}
