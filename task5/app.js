const form = document.getElementById("todo-form");
const input = document.getElementById("task-input");
const errorMsg = document.getElementById("error-msg");
const taskList = document.getElementById("task-list");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function render() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item${task.completed ? " completed" : ""}`;
    li.innerHTML = `
      <span class="task-text">${escapeHtml(task.text)}</span>
      <button class="complete-btn" data-index="${index}">
        ${task.completed ? "↩" : "✓"}
      </button>
      <button class="delete-btn" data-index="${index}">✕</button>
    `;
    taskList.appendChild(li);
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function showError(msg) {
  errorMsg.textContent = msg;
  setTimeout(() => { errorMsg.textContent = ""; }, 3000);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = input.value.trim();

  if (!text) {
    showError("Task cannot be empty");
    return;
  }

  if (tasks.some((t) => t.text.toLowerCase() === text.toLowerCase())) {
    showError("Task already exists");
    return;
  }

  tasks.push({ text, completed: false });
  save();
  render();
  input.value = "";
  input.focus();
});

taskList.addEventListener("click", (e) => {
  const index = e.target.dataset.index;
  if (index === undefined) return;

  if (e.target.classList.contains("complete-btn")) {
    tasks[index].completed = !tasks[index].completed;
    save();
    render();
  }

  if (e.target.classList.contains("delete-btn")) {
    tasks.splice(index, 1);
    save();
    render();
  }
});

render();
