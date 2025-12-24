const modal = document.querySelector(".modal");
const addTodoBtn = document.getElementById("add-todo");
const addTaskBtn = document.querySelector(".add-task");

const columns = document.querySelectorAll(".task-column");
const todo = document.getElementById("todo");
const progress = document.getElementById("progress");
const done = document.getElementById("done");

const input = document.querySelector("input");
const textarea = document.querySelector("textarea");

let draggedTask = null;

/* DRAG EVENTS */
function addDrag(task) {
  task.addEventListener("dragstart", () => {
    draggedTask = task;
    task.classList.add("dragging");
  });
  
  task.addEventListener("dragend", () => {
    draggedTask = null;
    task.classList.remove("dragging");
    saveTasks();
  });
}

/* COLUMN DROP */
columns.forEach(col => {
  col.addEventListener("dragover", e => e.preventDefault());
  
  col.addEventListener("drop", () => {
    if (draggedTask) {
      col.appendChild(draggedTask);
      updateCounts();
      saveTasks();
    }
  });
});

/* COUNT */
function updateCounts() {
  [todo, progress, done].forEach(col => {
    col.querySelector(".right").textContent =
      col.querySelectorAll(".task").length;
  });
}

/* SAVE */
function saveTasks() {
  const data = [];
  [todo, progress, done].forEach(col => {
    col.querySelectorAll(".task").forEach(task => {
      data.push({
        title: task.querySelector("h2").textContent,
        desc: task.querySelector("p").textContent,
        column: col.id
      });
    });
  });
  localStorage.setItem("kanban", JSON.stringify(data));
}

/* LOAD */
function loadTasks() {
  const data = JSON.parse(localStorage.getItem("kanban")) || [];
  data.forEach(item => {
    createTask(item.title, item.desc, item.column, false);
  });
  updateCounts();
}

/* CREATE TASK */
function createTask(title, desc, columnId, save = true) {
  const task = document.createElement("div");
  task.className = "task";
  task.draggable = true;
  
  const h2 = document.createElement("h2");
  h2.textContent = title;
  
  const p = document.createElement("p");
  p.textContent = desc;
  
  const btn = document.createElement("button");
  btn.textContent = "Delete";
  btn.onclick = () => {
    task.remove();
    updateCounts();
    saveTasks();
  };
  
  task.append(h2, p, btn);
  document.getElementById(columnId).appendChild(task);
  
  addDrag(task);
  if (save) saveTasks();
}

/* MODAL */
addTodoBtn.onclick = () => modal.classList.add("active");
modal.onclick = () => modal.classList.remove("active");
document.querySelector(".add-new-task").onclick = e => e.stopPropagation();

/* ADD TASK */
addTaskBtn.onclick = () => {
  if (!input.value.trim()) return alert("Write something");
  createTask(input.value, textarea.value, "todo");
  input.value = "";
  textarea.value = "";
  modal.classList.remove("active");
  updateCounts();
};

/* INIT */
loadTasks();
updateCounts();
