const form = document.querySelector("#form"),
  taskInput = document.querySelector("#taskInput");
tasksList = document.querySelector("#tasksList");
emptyList = document.querySelector("#emptyList");

form.addEventListener("submit", addTask);
tasksList.addEventListener("click", deleteTask);
tasksList.addEventListener("click", doneTask);

let tasks = [];

if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => renderTask(task));
}


checkEmptyList();

function addTask(event, task) {
  event.preventDefault();

  const taskText = taskInput.value;

  const newTasks = {
    id: Date.now(),
    text: taskText,
    done: false,
  };

  tasks.push(newTasks);

  renderTask(newTasks);

  taskInput.value = "";
  taskInput.focus();

  checkEmptyList();

  saveToLocalStorage();
}

function deleteTask(event) {
  if (event.target.dataset.action !== "delete") return;

  const parentNode = event.target.closest(".list-group-item");

  const id = Number(parentNode.id);

  // const index = tasks.findIndex(task => task.id === id);

  // tasks.splice(index, 1);

  tasks = tasks.filter((task) => task.id !== id);

  parentNode.remove();

  checkEmptyList();

  saveToLocalStorage();
}

function doneTask(event) {
  if (event.target.dataset.action !== "done") return;
  const parentNode = event.target.closest(".list-group-item");
  parentNode.querySelector(".task-title").classList.toggle("task-title--done");

  const id = Number(parentNode.id);

  const task = tasks.find(function (task) {
    if (task.id === id) {
      return true;
    }
  });

  task.done = !task.done;

  saveToLocalStorage();
}

function checkEmptyList() {
  if (tasks.length === 0) {
    const emptyListHTML = `
          <li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
            <div class="empty-list__title">Список дел пуст</div>
          </li> 
    `;
    tasksList.insertAdjacentHTML("afterbegin", emptyListHTML);
  }

  if (tasks.length > 0) {
    const emptyListEl = document.querySelector("#emptyList");

    emptyListEl ? emptyListEl.remove() : null;
  }
}

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(task) {
  const cssClass = task.done ? "task-title task-title--done" : "task-title";

  const taskHtml = `
                  <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
                      <span class="${cssClass}">${task.text}</span>
                      <div class="task-item__buttons">
                          <button type="button" data-action="done" class="btn-action">
                              <img src="./img/tick.svg" alt="Done" width="18" height="18">
                          </button>
                          <button type="button" data-action="delete" class="btn-action">
                              <img src="./img/cross.svg" alt="Done" width="18" height="18">
                          </button>
                      </div>
                  </li>`;

  tasksList.insertAdjacentHTML("beforeend", taskHtml);
}
