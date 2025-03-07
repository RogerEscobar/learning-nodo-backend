const inputBox = document.querySelector("#newTask");
const taskList = document.querySelector("#tasksList");
const btnNew = document.querySelector("#btnNew");

btnNew.addEventListener("click", () => {
  const taskDescription = inputBox.value.trim();
  if (!taskDescription) {
    alert("Ingresa una tarea para agregar");
    return;
  }

  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(taskDescription);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  addTask(taskDescription);

  inputBox.value = "";
});

document.addEventListener("DOMContentLoaded", () => {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach((taskDescription) => {
    addTask(taskDescription);
  });
});

function addTask(taskDescription) {
  const taskItem = document.createElement("li");
  taskItem.classList.add("taskItem");

  const taskContent = document.createElement("span");
  taskContent.textContent = taskDescription;

  const buttons = document.createElement("div");
  buttons.classList.add("taskButtons");

  const btnComplete = document.createElement("button");
  btnComplete.classList.add("btnActionTask");
  btnComplete.innerHTML = '<span class="material-icons">check_circle</span>';
  btnComplete.addEventListener("click", function () {
    taskContent.classList.toggle("checked");
  });

  const btnDelete = document.createElement("button");
  btnDelete.classList.add("btnActionTask");
  btnDelete.innerHTML = '<span class="material-icons icon-hover">delete</span>';
  btnDelete.addEventListener("click", function () {
    taskItem.remove();
    removeTaskFromStorage(taskContent.textContent);
  });

  const btnEdit = document.createElement("button");
  btnEdit.classList.add("btnActionTask");
  btnEdit.innerHTML = '<span class="material-icons">edit</span>';
  btnEdit.addEventListener("click", function () {
    const newText = prompt("Editar tarea", taskContent.textContent);
    if (newText !== null) {
      updateTaskInStorage(taskContent.textContent, newText.trim());
      taskContent.textContent = newText.trim();
    }
  });

  buttons.appendChild(btnComplete);
  buttons.appendChild(btnEdit);
  buttons.appendChild(btnDelete);

  taskItem.appendChild(taskContent);
  taskItem.appendChild(buttons);

  taskList.appendChild(taskItem);
  taskList.prepend(taskItem);
}

function removeTaskFromStorage(taskDescription) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks = tasks.filter((task) => task !== taskDescription);
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateTaskInStorage(oldDescription, newDescription) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  const index = tasks.indexOf(oldDescription);
  if (index !== -1) {
    tasks[index] = newDescription;
  }
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
