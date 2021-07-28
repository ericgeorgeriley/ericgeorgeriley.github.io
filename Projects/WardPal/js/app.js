//TODO
/*
    - Help screens for empty/me/bed
    -BUG empty beds are highest priority; they should be least..
*/

let taskLists = [];

//show specific list view
let activeListId = null;
let editingList = false;
//show the handover view
let handoverView = false;
let handoverPriorityToggle = false;

let addingBed = false;
let addingTask = false;
let taskPreposition = "IN"; //default to IN
let taskHours = 0; //default to 0 hours
let taskMinutes = 15; //default to 15 mins
let orderByPriority = true;
let showClearBed = false;
let showCredits = false;
let showReset = false;

//animations
let successAnim = bodymovin.loadAnimation({
  container: document.getElementById("success_svg"),
  autoplay: false,
  loop: false,
  animationData: animation.successPulse,
  renderer: "svg",
});

let heartAnim = bodymovin.loadAnimation({
  container: document.getElementById("heart_svg"),
  autoplay: false,
  loop: false,
  animationData: animation.heartPulse,
  renderer: "svg",
});

let addedAnim = bodymovin.loadAnimation({
  container: document.getElementById("added_svg"),
  autoplay: false,
  loop: false,
  animationData: animation.addedPulse,
  renderer: "svg",
});

function drawView() {
  if (!showReset) {
    updateStatusBar();

    if (activeListId) {
      //show list view
      renderActiveList();
    } else if (handoverView) {
      //show handover list
      renderHandover();
    } else {
      //show dashboard
      renderDashboard();
    }
  }

  var bedModal = document.getElementById("new_bed_modal");
  if (addingBed) {
    //show new bed modal
    bedModal.classList.remove("hidden");
  } else {
    bedModal.classList.add("hidden");
  }

  var taskModal = document.getElementById("new_task_modal");
  if (addingTask) {
    //show new task modal
    taskModal.classList.remove("hidden");
  } else {
    taskModal.classList.add("hidden");
  }

  var resetModal = document.getElementById("reset_modal");
  if (showReset) {
    //show reset modal

    //hide all views
    document.getElementById("status_view").classList.add("hidden");
    document.getElementById("tasks_view").classList.add("hidden");
    document.getElementById("handover_view").classList.add("hidden");
    document.getElementById("dashboard_view").classList.add("hidden");

    resetModal.classList.remove("hidden");
  } else {
    resetModal.classList.add("hidden");
  }

  var clearBedModal = document.getElementById("clear_bed_modal");
  if (showClearBed) {
    //show clear bed modal
    clearBedModal.classList.remove("hidden");
  } else {
    clearBedModal.classList.add("hidden");
  }

  var creditsModal = document.getElementById("credits_modal");
  if (showCredits) {
    //show credits modal
    creditsModal.classList.remove("hidden");
  } else {
    creditsModal.classList.add("hidden");
  }

  attachAnimations();
}

function attachAnimations() {
  var completeButtons = document.getElementsByClassName("item-complete");
  for (var i = 0; i < completeButtons.length; i++) {
    completeButtons[i].addEventListener("click", () => {
      successAnim.addEventListener("complete", () =>
        successAnim.goToAndStop(0)
      );
      successAnim.goToAndPlay(0, true);
    });
  }

  var momentButton = document.getElementById("update_moment");
  momentButton.addEventListener("click", () => {
    heartAnim.addEventListener("complete", () => heartAnim.goToAndStop(0));
    heartAnim.goToAndPlay(0, true);
  });

  var createButton = document.getElementById("create_task");
  createButton.addEventListener("click", () => {
    addedAnim.addEventListener("complete", () => addedAnim.goToAndStop(0));
    addedAnim.goToAndPlay(0, true);
  });
}

function updateStatusBar() {
  let s_overdue = (s_alert = s_warn = s_normal = s_any = 0);

  for (let i in taskLists) {
    for (let j in taskLists[i].tasks) {
      if (taskLists[i].tasks[j].complete !== false) continue;

      let duestate = getDueState(taskLists[i].tasks[j].due);
      switch (duestate.state) {
        case 4:
          s_overdue++;
          break;
        case 3:
          s_alert++;
          break;
        case 2:
          s_warn++;
          break;
        case 1:
          s_normal++;
          break;
        case 0:
          s_any++;
          break;
        default:
          break;
      }
    }
  }

  //shows the view if it was hidden (by reset prompt)
  document.getElementById("status_view").classList.remove("hidden");

  //hides the overdue border when nothing to show
  if (s_overdue < 1)
    document.getElementsByClassName("status-overdue")[0].style.display = "none";
  else
    document.getElementsByClassName("status-overdue")[0].style.display =
      "block";

  let total = s_overdue + s_alert + s_warn + s_normal + s_any;
  let showBar = total > 0;

  let overdueBar = document.getElementsByClassName("status-overdue")[0];
  let alertBar = document.getElementsByClassName("status-alert")[0];
  let warnBar = document.getElementsByClassName("status-warn")[0];
  let normalBar = document.getElementsByClassName("status-normal")[0];
  let anyBar = document.getElementsByClassName("status-any")[0];

  let overduePercent = (s_overdue / total) * 100;
  overdueBar.style.width = (showBar ? overduePercent : 0) + "%";
  overdueBar.innerText =
    overduePercent > 10 ? (s_overdue > 0 ? s_overdue : "") : "";

  let alertPercent = (s_alert / total) * 100;
  alertBar.style.width = (showBar ? alertPercent : 0) + "%";
  alertBar.innerText = alertPercent > 10 ? (s_alert > 0 ? s_alert : "") : "";

  let warnPercent = (s_warn / total) * 100;
  warnBar.style.width = (showBar ? warnPercent : 0) + "%";
  warnBar.innerText = warnPercent > 10 ? (s_warn > 0 ? s_warn : "") : "";

  let normalPercent = (s_normal / total) * 100;
  normalBar.style.width = (showBar ? normalPercent : 0) + "%";
  normalBar.innerText =
    normalPercent > 10 ? (s_normal > 0 ? s_normal : "") : "";

  let anyPercent = (s_any / total) * 100;
  anyBar.style.width = (showBar ? anyPercent : 0) + "%";
  anyBar.innerText = anyPercent > 10 ? (s_any > 0 ? s_any : "") : "";
}

function togglePriorityOrder() {
  orderByPriority = !orderByPriority;

  let button = document.getElementsByClassName("priority-button")[0];

  if (orderByPriority) button.classList.add("active");
  else button.classList.remove("active");

  saveState();
}

function toggleHandoverView() {
  handoverView = !handoverView;

  let button = document.getElementsByClassName("handover-button")[0];

  if (handoverView) {
    button.classList.add("active");

    //default the handover view to alphabetical
    if (orderByPriority) {
      togglePriorityOrder();
      //toggle priority when handover view is closed
      handoverPriorityToggle = true;
    }
  } else {
    button.classList.remove("active");

    if (handoverPriorityToggle && orderByPriority == false) {
      handoverPriorityToggle = false;
      togglePriorityOrder();
    }
  }

  saveState();
}

function renderDashboard() {
  //display the correct view
  document.getElementById("tasks_view").classList.add("hidden");
  document.getElementById("handover_view").classList.add("hidden");
  document.getElementById("dashboard_view").classList.remove("hidden");

  //render the main view
  var container = document.getElementById("dashboard_view");
  container.innerHTML = "";

  taskLists.forEach((el) => {
    container.appendChild(getWidget(el));
  });

  let buttonWidget = document.createElement("div");
  buttonWidget.id = "new-bed-widget";
  buttonWidget.className = "widget";
  buttonWidget.onclick = function () {
    addBedPrompt();
  };
  buttonWidget.innerHTML = `   
            <div class="content">
                <div class="new-bed-label">
                    <img src="./img/bed-lg.png"/>
                    <p>CREATE A NEW BED</p>         
                </div>
            </div>`;

  container.appendChild(buttonWidget);

  var blankWidget = document.createElement("div");
  blankWidget.className = "widget widget-empty";
  blankWidget.innerHTML = `   
            <div class="content">
                
            </div>`;

  if (window.innerWidth > 640) {
    //3 columns
    if ((taskLists.length + 1) % 3 != 0) {
      //not divisible by 3

      let nextMultiple = Math.ceil((taskLists.length + 1) / 3) * 3;
      let blankCount = nextMultiple - (taskLists.length + 1);

      for (var i = 0; i < blankCount; i++)
        container.appendChild(blankWidget.cloneNode(true));
    }
  } else {
    //2 columns
    if ((taskLists.length + 1) % 2 != 0) {
      //not divisible by 2
      container.appendChild(blankWidget);
    }
  }

  if (taskLists.length === 1 && taskLists[0].tasks.length === 0) {
    //this is an empty ward, show welcome message

    let welcomeHelper = document.createElement("div");
    welcomeHelper.className = "helper welcome-helper";

    welcomeHelper.innerHTML = `
            <div>
                <h2>Welcome to WardPal!</h2>
                <p> Tap on <span class="highlight">create a new bed</span> to start building your ward.</p>
                <p>New to WardPal? There's a handy <span class="highlight">help</span> guide if you get stuck.</p>
            <div>
            `;

    container.appendChild(welcomeHelper);
  }
}

function renderActiveList() {
  //display the correct view
  document.getElementById("dashboard_view").classList.add("hidden");
  document.getElementById("handover_view").classList.add("hidden");
  document.getElementById("tasks_view").classList.remove("hidden");

  //get the active list
  var activeList = taskLists.find((e) => e.id === activeListId);

  document.getElementById("active_list_name").innerText = activeList.name;

  //update moment button
  let momentButton = document.getElementById("update_moment");
  momentButton.style.opacity = getMoment(activeList.moment).opacity;
  momentButton.onclick = function () {
    activeList.moment = moment();
    saveState();
  };

  if (activeList.tasks.length > 0) getTasksHtml(activeList);
  else {
    //clear out any old task data
    var helperTarget = document.getElementById("active_list_tasks");
    helperTarget.innerHTML = "";
    document.getElementById("active_list_history").innerHTML = "";

    //show the no-tasks icon
    let noTasks = document.createElement("div");
    noTasks.className = "no-tasks";
    noTasks.innerHTML = `<img src="./img/bookmark.png"/><p>No tasks</p>`;

    helperTarget.appendChild(noTasks);

    //create the helper div
    let welcomeHelper = document.createElement("div");
    welcomeHelper.className = "helper welcome-helper";

    let taskText = activeList.isMe
      ? `<p> This is your personal task list! tap the <span class="highlight">new task</span> button below.</p>`
      : `<p> You can create tasks for this bed by tapping on the <span class="highlight">new task</span> button below.</p>`;
    let momentText = activeList.isMe
      ? `<p>Take a moment for yourself, tap <img width="20" src="./img/heart.png" width=.5em/> to record a moment.</p>`
      : `<p>Take a moment <img width="15" src="./img/heart.png" width=.5em/> to think about the patients in your care.</p>`;

    welcomeHelper.innerHTML = `<div>
            ${taskText}
            ${momentText}
            <p><small><a href="https://google.com">Learn more</a> about moments.<small></p>
        </div>`;

    helperTarget.appendChild(welcomeHelper);
  }

  //toggle clear/remove bed
  let anyTasks = activeList.tasks.length > 0;
  let isMe = activeList.isMe;
  document.getElementsByClassName("clear-bed")[0].style.display = anyTasks
    ? "block"
    : "none";
  document.getElementsByClassName("remove-bed")[0].style.display = isMe
    ? "none"
    : anyTasks
    ? "none"
    : "block";

  document.getElementById("active_list_icon").src = isMe
    ? "./img/nurse.png"
    : (src = "./img/bed.png");
}

function renderHandover() {
  //display the correct view
  document.getElementById("dashboard_view").classList.add("hidden");
  document.getElementById("tasks_view").classList.add("hidden");
  document.getElementById("handover_view").classList.remove("hidden");

  //render the handover
  var container = document.getElementById("handover_view");
  container.innerHTML = "";

  taskLists.forEach((el) => {
    let tasks = ``;
    if (el.tasks.filter((x) => x.complete == false).length > 0) {
      el.tasks.forEach((t) => {
        if (t.complete == false) {
          let name = t.name.length > 0 ? t.name : ".";
          let overdue = getDueState(t.due).state == 4;
          let dueClass = overdue ? "text-alert" : "";

          tasks += `<li>${name}<span class="${dueClass}">${
            t.due !== ""
              ? moment(t.due).format("DD/MM HH:mm")
              : "<small> Anytime </small>"
          }</span></li>`;
        }
      });
    } else {
      //no tasks
      tasks += "<li><small>No outstanding tasks</small></li>";
    }

    let handoverItem = document.createElement("div");
    handoverItem.classList.add("handover-item");
    handoverItem.innerHTML = `
                <h4>${el.name}</h4>
                <ul>
                    ${tasks}
                </ul>
            `;

    container.appendChild(handoverItem);
  });
}

function getTasksHtml(activeList) {
  //show active tasks
  var active = document.getElementById("active_list_tasks");

  let listItems = `
        <div class="task-item">
            <div class="item-name"></div>
            <div class="item-due"></div>
            ${
              editingList
                ? `<div class="item-edit" onclick="editList(false)">
                    DONE
                </div>`
                : `<div class="item-edit" onclick="editList(true)">
                    EDIT TASKS
                </div>`
            }
        </div>
    `;

  let pendingTasks = activeList.tasks.filter((x) => x.complete === false);
  pendingTasks.forEach((t, i) => {
    let taskAction = editingList
      ? `<div class="item-edit" onclick="removeTask('${t.id}')">
            <p class="text-alert">REMOVE</p>
         </div>`
      : `<div class="item-complete" onclick="completeTask('${t.id}')">
            <img src="./img/tick.png"/>
        </div>`;

    let repeatIcon = t.repeat > 0 ? `<img src="./img/repeat.png"/>` : ``;
    listItems += `
            <div class="task-item" id="task-item-${t.id}">
                <div class="item-name">${t.name}</div>
                <div class="item-due">${repeatIcon}${getDuePillHtml(
      t.due
    )}</div>
                ${taskAction}
            </div>
        `;
  });

  listItems += active.innerHTML = listItems;

  //show task history
  var history = document.getElementById("active_list_history");
  let completeTasks = activeList.tasks.filter((x) => x.complete !== false);
  listItems = completeTasks.length > 0 ? "<h3>Complete</h3>" : "";

  completeTasks.forEach((t, i) => {
    let taskAction = editingList
      ? `<div class="item-remove" onclick="removeTask('${t.id}')">
            <p class="text-alert">REMOVE</p>
         </div>`
      : `<div class="item-undo" onclick="undoComplete('${t.id}')">
            <p>UNDO</p>
         </div>`;

    listItems += `
            <div class="history-item">
                <div class="item-name">${t.name}</div>
                <div class="item-complete-date">${moment(t.complete).format(
                  "DD/MM HH:mm"
                )}</div>
                ${taskAction}
            </div>
        `;
  });

  history.innerHTML = listItems;
}

function getDuePillHtml(taskDue) {
  let pill = ``;
  let dueModel = getDueState(taskDue);

  if (dueModel.state === 0) pill = `<span class="pill">ANY</span>`;
  if (dueModel.state === 1)
    pill = `<span class="pill pill-green">${dueModel.label}</span>`;
  if (dueModel.state === 2)
    pill = `<span class="pill pill-amber">${dueModel.label}</span>`;
  if (dueModel.state === 3)
    pill = `<span class="pill pill-red">${dueModel.label}</span>`;
  if (dueModel.state === 4)
    pill = `<span class="pill pill-alert">OVERDUE ${dueModel.label}</span>`;

  return pill;
}

function getDueState(time) {
  let dueMinutes = time ? moment(time).diff(moment(), "minutes") : null;

  let state = 0;
  let label = null;

  if (dueMinutes !== null) {
    label =
      dueMinutes > 59 || dueMinutes < -59
        ? Math.floor(Math.abs(dueMinutes) / 60) + " HRS"
        : Math.floor(Math.abs(dueMinutes)) + " MINS";

    if (dueMinutes < 0) state = 4;
    //OVERDUE
    else if (dueMinutes <= 15) state = 3;
    //ALERT
    else if (dueMinutes <= 60) state = 2;
    //WARN
    else state = 1; //NORMAL
  } else state = 0; //ANY

  return { label, state };
}

function getWidget(el) {
  let widget = document.createElement("div");
  widget.id = el.id;
  widget.className = "widget";

  let widgetContent = document.createElement("div");
  widgetContent.className = "content";

  pendingItems = "";
  let pendingTasks = el.tasks.filter((x) => x.complete === false);
  let itemsVisible = window.innerWidth < 375 ? 1 : 2;

  pendingTasks.forEach((t, i) => {
    if (i < itemsVisible) {
      pendingItems += `
                <li class="widget-task">
                    <span class="widget-task-due">${getDuePillHtml(
                      t.due
                    )}</span>
                    <span class="widget-task-name">${t.name}</span>
                </li>`;
    }
  });

  let icon = el.isMe ? "./img/nurse.png" : "./img/bed.png";

  let momentOpacity = getMoment(el.moment).opacity;

  widgetContent.innerHTML = `
        <div class="widget-header">
            <div class="widget-icon"><img src="${icon}"/></div>
            <div class="widget-title"><p>${el.name}</p></div>
        </div>
        <div class="widget-body">
            <div class="task-summary">
                <ul>
                    ${pendingItems}
                </ul>
            </div>
        </div>
        <div class="widget-footer">
            <div class="widget-icon" style="opacity:${momentOpacity}"><img src="./img/heart.png"/></div>
            <div class="widget-totals"><p>${/*el.tasks.length*/ " "}</p></div>
        </div>            
    `;

  widget.appendChild(widgetContent);

  widget.onclick = () => openActiveList(el.id);

  return widget;
}

function getMoment(datetime) {
  let hoursAgo = moment.duration(moment().diff(datetime)).asHours();
  let momentOpacity = hoursAgo > 2 ? 1 : hoursAgo > 1 ? 0.6 : 0.2;

  return { hours: hoursAgo, opacity: momentOpacity };
}

function selectTaskList(id) {
  //used to show the modal for a taskList
  activeListId = id;
}

function addBedPrompt() {
  addingBed = true;
  drawView();
  document.getElementById("bed_name_input").focus();
}

function cancelBed() {
  let bedInput = document.getElementById("bed_name_input");
  bedInput.value = "";
  addingBed = false;
  drawView();
}

function createBed() {
  let bedInput = document.getElementById("bed_name_input");

  let bedId = uuidv4();
  taskLists.push({
    id: bedId,
    name: bedInput.value,
    isMe: false,
    tasks: [],
    moment: moment(),
  });
  bedInput.value = "";
  addingBed = false;
  setActiveList(bedId);
  saveState();
}

function removeBed() {
  let id = activeListId;

  for (let i in taskLists) {
    if (taskLists[i].id == id) {
      taskLists.splice(i, 1);

      break;
    }
  }

  setActiveList();
  saveState();
}

function openActiveList(id) {
  setActiveList(id);
  drawView();
}

function closeActiveList(e) {
  setActiveList(null);
  drawView();
}

function setActiveList(id) {
  activeListId = id ? id : null;
}

function addTaskPrompt() {
  //set the defaults

  addingTask = true;
  drawView();

  document.getElementById("task_name_input").focus();
}

function setTaskPreposition(p, e) {
  clearTaskPreposition();
  taskPreposition = p;
  e.classList.add("active");

  let timePickerContainer = document.getElementsByClassName(
    "time-picker-container"
  )[0];

  if (p === "ANY") timePickerContainer.style.display = "none";
  else timePickerContainer.style.display = "flex";
}

function clearTaskPreposition() {
  taskPreposition = "";
  let options = document.getElementsByClassName("option");

  for (let i = 0; i < options.length; i++)
    options[i].classList.remove("active");
}

function setTaskHours(el) {
  taskHours = el.value;
  document.getElementById("hour_picker_text").value = el.value;
  document.getElementById("hour_picker_slider").value = el.value;
}

function setTaskMinutes(el) {
  let val = parseInt(el.value);

  if (parseInt(val, 10) < 10) val = "0" + val;

  taskMinutes = val;
  document.getElementById("minute_picker_text").value = val;
  document.getElementById("minute_picker_slider").value = val;
}

function cancelTask() {
  addingTask = false;
  drawView();

  //reset to defaults
  document.getElementById("task_name_input").value = "";
  setTaskPreposition("IN", document.getElementById("default_option"));
  setTaskHours({ value: 0 });
  setTaskMinutes({ value: 15 });
}

function createTask() {
  let id = activeListId;
  let name = document.getElementById("task_name_input").value;

  for (var i in taskLists) {
    if (taskLists[i].id == id) {
      //TODO take the model and work out the due datetime of the task
      let due = "";
      let repeat = 0;

      if (taskPreposition == "IN" || taskPreposition == "EVERY") {
        //set due date in x minutes ((hours*60) + mins) from now
        var totalMinutes = taskHours * 60 + parseInt(taskMinutes);
        due = moment().add(totalMinutes, "m");

        if (taskPreposition == "EVERY") repeat = totalMinutes;
      }

      if (taskPreposition == "AT") {
        //set due date to the specific hour and minute in the future
        let datetime = moment();

        datetime.hours(taskHours).minutes(parseInt(taskMinutes));
        if (datetime < moment()) datetime.add(1, "d");

        due = datetime;
      }

      taskLists[i].tasks.push({
        id: uuidv4(),
        name: name,
        due: due,
        complete: false,
        repeat: repeat,
      });

      break;
    }
  }

  saveState();
  cancelTask();
}

function completeTask(taskId) {
  let id = activeListId;

  //start the hide animation
  let taskItem = document.getElementById(`task-item-${taskId}`);
  taskItem.classList.add("hide");

  for (let i in taskLists) {
    if (taskLists[i].id == id) {
      //found the task list
      for (let j in taskLists[i].tasks) {
        if (taskLists[i].tasks[j].id == taskId) {
          //found the task
          taskLists[i].tasks[j].complete = moment();

          let thisTask = taskLists[i].tasks[j];
          if (thisTask.repeat > 0) {
            //create next task
            document.getElementById("task_name_input").value = thisTask.name;
            taskPreposition = "EVERY";
            taskMinutes = thisTask.repeat;
            createTask();
          }

          break;
        }
      }

      break;
    }
  }

  //allow animation to run
  setTimeout(saveState, 500);
}

function editList(setting) {
  editingList = setting;
  saveState();
}

function removeTask(taskId) {
  let id = activeListId;

  for (let i in taskLists) {
    if (taskLists[i].id == id) {
      //found the task list
      for (let j in taskLists[i].tasks) {
        if (taskLists[i].tasks[j].id == taskId) {
          //remove the task
          taskLists[i].tasks.splice(j, 1);

          break;
        }
      }

      break;
    }
  }

  saveState();
}

function undoComplete(taskId) {
  let id = activeListId;

  for (let i in taskLists) {
    if (taskLists[i].id == id) {
      //found the task list
      for (let j in taskLists[i].tasks) {
        if (taskLists[i].tasks[j].id == taskId) {
          //uncomplete the task
          taskLists[i].tasks[j].complete = false;

          break;
        }
      }

      break;
    }
  }

  saveState();
}

function showClearBedPrompt() {
  showClearBed = true;
  drawView();
}

function closeClearBedPrompt(confirm) {
  showClearBed = false;

  if (confirm) {
    let id = activeListId;

    for (let i in taskLists) {
      if (taskLists[i].id == id) {
        //found the task list
        taskLists[i].tasks = [];
        break;
      }
    }
    saveState();
  } else drawView();
}

function showResetPrompt() {
  showReset = true;
  drawView();
}

function closeResetPrompt(confirm) {
  showReset = false;

  if (confirm) loadState(true);

  drawView();
}

function showCreditsPrompt() {
  showCredits = true;
  drawView();
}

function closeCreditsPrompt() {
  showCredits = false;
  drawView();
}

function saveState() {
  //sort the tasks in each tasklist by datetime
  taskLists.forEach((list) => {
    if (list.tasks && list.tasks.length > 0) {
      let complete = list.tasks.filter((x) => x.complete !== false);
      let pending = list.tasks.filter(
        (x) => x.complete === false && x.due !== ""
      );
      let any = list.tasks.filter((x) => x.complete === false && x.due === "");

      //sort pending
      pending.sort((left, right) => {
        return moment.utc(left.due).diff(moment(right.due));
      });

      pending = pending.concat(any);

      //add complete to the end
      list.tasks = pending.concat(complete);
    }
  });

  if (orderByPriority) {
    //sort the tasklists by soonest task datetime

    taskLists.sort((left, right) => {
      let leftTask = left.tasks.length > 0 ? left.tasks[0].due : 0;

      let rightTask = right.tasks.length > 0 ? right.tasks[0].due : 0;

      return moment.utc(leftTask).diff(moment(rightTask));
    });

    //then move lists with no incomplete tasks to the end
    let complete = taskLists.filter(
      (x) => x.tasks.filter((y) => y.complete === false).length == 0
    );
    let incomplete = taskLists.filter(
      (x) => x.tasks.filter((y) => y.complete === false).length > 0
    );

    taskLists = incomplete.concat(complete);
  } else {
    //sort the tasklists alphabetically
    taskLists.sort((a, b) => a.name.localeCompare(b.name));
  }

  //always put the main tasklist first
  taskLists.sort(function (x, y) {
    return x.isMe == true ? -1 : y.isMe == true ? 1 : 0;
  });

  localStorage.setItem("taskLists", JSON.stringify(taskLists));
  drawView();
}

function loadState(reset) {
  let savedLists = JSON.parse(localStorage.getItem("taskLists"));
  if (!savedLists) reset = true;

  taskLists = !reset
    ? savedLists
    : [
        {
          id: uuidv4(),
          name: "Me",
          isMe: true,
          moment: moment().subtract({ hours: 3 }),
          tasks: [
            //{id:uuidv4(), name: "Complete this task", due: moment().add(10,'minutes'), complete: false}
          ],
        },
      ];

  window.setInterval(saveState, 10000);
  saveState();
}

function loadHandover() {
  console.log("loading handover");
  const pantryId = "11625bbc-a050-424e-b13f-42a15692e161";
  const wId = uuidv4();

  let appJson = {
      wardData: taskLists
    }

console.log("attempting", appJson)

  fetch(
    "https://getpantry.cloud/apiv1/pantry/11625bbc-a050-424e-b13f-42a15692e161/basket/" +
      wId,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: appJson,
    }
  ).then(
    (result) => result.json(),
    (error) => console.log(error)
  ).then(data=>{
      console.log("got data", data);
  })
  .catch(console.error);
}

function uuidv4() {
  //generates a guid
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

loadHandover();
loadState();

window.addEventListener(
  "resize",
  function () {
    drawView();
  },
  false
);
