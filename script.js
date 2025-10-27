// ===== LocalStorage Key =====
const STORAGE_KEY = "tasks_nm";
let tasks = [];

// ===== DOM Elements =====
const views = document.querySelectorAll(".view");
const navLinks = document.querySelectorAll(".nav-link");
const statsEl = document.getElementById("stats");
const listEl = document.getElementById("task-list");
const completedEl = document.getElementById("completed-list");
const emptyHome = document.getElementById("empty-home");
const emptyCompleted = document.getElementById("empty-completed");
const form = document.getElementById("task-form");
const titleInput = document.getElementById("task-title");
const descInput = document.getElementById("task-desc");

// ===== Load Tasks from LocalStorage =====
function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  tasks = saved ? JSON.parse(saved) : [];
  render();
}

// ===== Save Tasks to LocalStorage =====
function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ===== Render Tasks =====
function render() {
  const active = tasks.filter(t => !t.done);
  const completed = tasks.filter(t => t.done);

  statsEl.textContent = `${tasks.length} total — ${completed.length} completed`;

  // --- Active Tasks ---
  listEl.innerHTML = "";
  if (active.length === 0) {
    emptyHome.style.display = "block";
  } else {
    emptyHome.style.display = "none";
    active.forEach(t => {
      const div = document.createElement("div");
      div.className = "task";
      div.innerHTML = `
        <h3>${t.title}</h3>
        <p>${t.desc || ""}</p>
        <button onclick="markDone('${t.id}')">✅ Mark Done</button>
        <button onclick="deleteTask('${t.id}')">🗑 Delete</button>
      `;
      listEl.appendChild(div);
    });
  }

  // --- Completed Tasks ---
  completedEl.innerHTML = "";
  if (completed.length === 0) {
    emptyCompleted.style.display = "block";
  } else {
    emptyCompleted.style.display = "none";
    completed.forEach(t => {
      const div = document.createElement("div");
      div.className = "task";
      div.innerHTML = `
        <h3>${t.title}</h3>
        <p>${t.desc || ""}</p>
        <button onclick="deleteTask('${t.id}')">🗑 Remove</button>
      `;
      completedEl.appendChild(div);
    });
  }
}

// ===== Mark Task as Done =====
function markDone(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.done = true;
  saveTasks();
  render();
}

// ===== Delete Task =====
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

// ===== Add New Task =====
form.addEventListener("submit", e => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const desc = descInput.value.trim();
  if (title === "") return;

  const newTask = {
    id: Date.now().toString(),
    title,
    desc,
    done: false
  };
  tasks.push(newTask);
  saveTasks();
  form.reset();
  switchView("home");
  render();
});

// ===== SPA Navigation =====
function switchView(viewId) {
  views.forEach(v => v.classList.remove("active"));
  document.getElementById(viewId).classList.add("active");
  navLinks.forEach(n => n.classList.remove("active"));
  document.querySelector(`[data-view="${viewId}"]`).classList.add("active");
}

navLinks.forEach(link => {
  link.addEventListener("click", () => switchView(link.dataset.view));
});

// ===== Initial Load =====
loadTasks();
