const taskInput = document.getElementById("taskInput");
const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const statusMessage = document.getElementById("status");

async function loadTasks() {
  try {
    const response = await fetch("/api/tasks");
    if (!response.ok) throw new Error("Could not load tasks");
    const tasks = await response.json();
    taskList.innerHTML = "";

    tasks.forEach(task => {
      const item = document.createElement("li");
      const text = document.createElement("span");
      const deleteButton = document.createElement("button");
      text.textContent = task.text;
      deleteButton.textContent = "Delete";
      deleteButton.type = "button";
      deleteButton.addEventListener("click", () => deleteTask(task.id));
      item.append(text, deleteButton);
      taskList.appendChild(item);
    });
    emptyMessage.hidden = tasks.length > 0;
  } catch {
    statusMessage.textContent = "Cannot connect. Is the Node.js server running?";
  }
}

taskForm.addEventListener("submit", async event => {
  event.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  try {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });
    if (!response.ok) throw new Error("Could not add task");
    taskInput.value = "";
    statusMessage.textContent = "Task added!";
    await loadTasks();
    taskInput.focus();
  } catch {
    statusMessage.textContent = "Could not add task. Please try again.";
  }
});

async function deleteTask(id) {
  try {
    const response = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (!response.ok) throw new Error("Could not delete task");
    statusMessage.textContent = "Task deleted.";
    await loadTasks();
  } catch {
    statusMessage.textContent = "Could not delete task. Please try again.";
  }
}

loadTasks();
