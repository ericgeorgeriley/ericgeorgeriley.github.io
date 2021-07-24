let taskLists = [];

//show specific list view
let activeListId = null;
let editingList = false;
//show the handover view
let handoverView = false;

let addingBed = false;
let addingTask = false;
let taskPreposition = "IN"; //default to IN
let taskHours = 0; //default to 0 hours
let taskMinutes = 15; //default to 15 mins
let orderByProity = true;
let showCredits = false;


function drawView(){

    updateStatusBar();

    if(activeListId){
        //show list view
        renderActiveList();
    }
    else if(handoverView){
        //show handover list
    }
    else {
        //show dashboard
        renderDashboard();   
    }

    if(addingBed){//show new bed modal
        var bedModal = document.getElementById("new_bed_modal");
        bedModal.classList.remove("hidden");
    } else {
        var bedModal = document.getElementById("new_bed_modal");
        bedModal.classList.add("hidden");
    }

    if(addingTask){//show new task modal
        var bedModal = document.getElementById("new_task_modal");
        bedModal.classList.remove("hidden");
    } else {
        var bedModal = document.getElementById("new_task_modal");
        bedModal.classList.add("hidden");
    }

    if(showCredits){//show credits modal
        var bedModal = document.getElementById("credits_modal");
        bedModal.classList.remove("hidden");
    } else {
        var bedModal = document.getElementById("credits_modal");
        bedModal.classList.add("hidden");
    }
}

function updateStatusBar(){

    let s_overdue = s_alert = s_warn = s_normal = s_any = 0;


    for(let i in taskLists){
        for(let j in taskLists[i].tasks)
        {
            if(taskLists[i].tasks[j].complete !== false)continue;
            
            let duestate = getDueState(taskLists[i].tasks[j].due)
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



    //hides the overdue border when nothing to show
    if(s_overdue<1)document.getElementsByClassName("status-overdue")[0].style.display = "none";
    else document.getElementsByClassName("status-overdue")[0].style.display = "block";

    let total = s_overdue+s_alert+s_warn+s_normal+s_any;
    let showBar = total > 0;

    document.getElementsByClassName("status-overdue")[0].style.width = (showBar? (s_overdue/total)*100 : 0) +"%";
    document.getElementsByClassName("status-alert")[0].style.width = (showBar? (s_alert/total)*100 : 0) +"%";
    document.getElementsByClassName("status-warn")[0].style.width = (showBar? (s_warn/total)*100 : 0) +"%";
    document.getElementsByClassName("status-normal")[0].style.width = (showBar? (s_normal/total)*100 : 0) +"%";
    document.getElementsByClassName("status-any")[0].style.width = (showBar? (s_any/total)*100 : 0) +"%";

}

function togglePriorityOrder(){
    orderByProity = !orderByProity;

    let button = document.getElementsByClassName("priority-button")[0];
    
    if(orderByProity) button.classList.add("active");
    else button.classList.remove("active");

    saveState();
}

function renderDashboard(){

        //display the correct view
        document.getElementById("tasks_view").classList.add("hidden");
        document.getElementById("dashboard_view").classList.remove("hidden");
        


        //render the main view
        var container = document.getElementById("dashboard_view");
        container.innerHTML = "";
        
        taskLists.forEach(el => {     
            container.appendChild(getWidget(el));
        });

        let buttonWidget = document.createElement("div");
        buttonWidget.id = "new-bed-widget";
        buttonWidget.className = "widget";
        buttonWidget.onclick = function(){ addBedPrompt();}
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

        if(window.innerWidth > 640){ //3 columns 
            if((taskLists.length + 1) % 3 != 0){ //not divisible by 3

                let nextMultiple = Math.ceil((taskLists.length + 1)/3)*3;
                let blankCount = nextMultiple - (taskLists.length +1);

                for(var i = 0; i<blankCount; i++)
                    container.appendChild(blankWidget.cloneNode(true));
            }
        } else { //2 columns
            if((taskLists.length + 1) % 2 != 0){ //not divisible by 2
                container.appendChild(blankWidget);
            }
        } 
}

function renderActiveList(){

    //display the correct view
    document.getElementById("dashboard_view").classList.add("hidden");
    document.getElementById("tasks_view").classList.remove("hidden");


    //get the active list
    var activeList = taskLists.find(e => e.id === activeListId);

    document.getElementById("active_list_name").innerText = activeList.name;

    //update moment button
    let momentButton = document.getElementById("update_moment");
    momentButton.style.opacity = getMoment(activeList.moment).opacity;
    momentButton.onclick=function(){
        activeList.moment = moment()
        saveState();
    }

    if(activeList.tasks.length>0)
        getTasksHtml(activeList);
    else{
        //this should show some help info with arrows
        //about moments
        //new task
        //etc..
        getTasksHtml(activeList);

    }

    //toggle clear/remove bed
    let anyTasks = activeList.tasks.length > 0;
    document.getElementsByClassName("clear-bed")[0].style.display = anyTasks ? "block" : "none";
    document.getElementsByClassName("remove-bed")[0].style.display = anyTasks ? "none" : "block";;




}

function getTasksHtml(activeList){

    //show active tasks
    var active = document.getElementById("active_list_tasks");

    let listItems = `
        <div class="task-item">
            <div class="item-name"></div>
            <div class="item-due"></div>
            ${editingList ? 
                `<div class="item-edit" onclick="editList(false)">
                    DONE
                </div>`
                :
                `<div class="item-edit" onclick="editList(true)">
                    EDIT TASKS
                </div>`
            }
        </div>
    `;
    

    let pendingTasks = activeList.tasks.filter(x=>x.complete===false);
    pendingTasks.forEach((t,i)=> {

        let taskAction = editingList ? 
        `<div class="item-edit" onclick="removeTask('${t.id}')">
            <p class="text-alert">REMOVE</p>
         </div>`
        :
        `<div class="item-complete" onclick="completeTask('${t.id}')">
            <img src="./img/tick.png"/>
        </div>`;

        listItems+=`
            <div class="task-item">
                <div class="item-name">${t.name}</div>
                <div class="item-due">${getDuePillHtml(t.due)}</div>
                ${taskAction}
            </div>
        `;
    });

    listItems +=

    active.innerHTML = listItems;


    //show task history
    var history = document.getElementById("active_list_history");
    let completeTasks = activeList.tasks.filter(x=>x.complete!==false);
    listItems = completeTasks.length > 0 ? "<h3>Complete</h3>" :"";



    completeTasks.forEach((t,i)=> {

        let taskAction = editingList ? 
        `<div class="item-remove" onclick="removeTask('${t.id}')">
            <p class="text-alert">REMOVE</p>
         </div>`
        :
        `<div class="item-undo" onclick="undoComplete('${t.id}')">
            <p>UNDO</p>
         </div>`;

        listItems+=`
            <div class="history-item">
                <div class="item-name">${t.name}</div>
                <div class="item-complete-date">${moment(t.complete).format('DD/MM HH:mm')}</div>
                ${taskAction}
            </div>
        `;
    });

    history.innerHTML = listItems;
}

function getDuePillHtml(taskDue){
    let pill = ``;
    let dueModel = getDueState(taskDue);

    if(dueModel.state === 0) pill = `<span class="pill pill-green">ANY</span>`;
    if(dueModel.state === 1) pill = `<span class="pill">${dueModel.label}</span>`;
    if(dueModel.state === 2) pill = `<span class="pill pill-amber">${dueModel.label}</span>`;
    if(dueModel.state === 3) pill = `<span class="pill pill-red">${dueModel.label}</span>`;
    if(dueModel.state === 4) pill = `<span class="pill pill-alert">OVERDUE ${dueModel.label}</span>`;

    return pill;

}

function getDueState(time){
    let dueMinutes = time ? moment(time).diff(moment(), 'minutes') : null;
    
    let state = 0
    let label = null;
    
    if(dueMinutes !== null){

        label = dueMinutes > 59 || dueMinutes < -59 ? 
        
        Math.floor(Math.abs(dueMinutes)/60) + " HRS" :
        Math.floor(Math.abs(dueMinutes)) + " MINS";

        if(dueMinutes< 0)
            state = 4;  //OVERDUE
        else if(dueMinutes <= 15)
            state = 3   //ALERT
        else if (dueMinutes <= 60)
            state = 2   //WARN
        else 
            state = 1   //NORMAL
    }
    else state = 0;     //ANY


    return { label, state }

}

function getWidget(el){
    let widget = document.createElement("div");
    widget.id = el.id;
    widget.className = "widget";

    let widgetContent = document.createElement("div");
    widgetContent.className = "content";
    
    pendingItems = "";
    let pendingTasks =el.tasks.filter(x=>x.complete===false);
    let itemsVisible = window.innerWidth < 380 ? 1 : 2;
    
    pendingTasks.forEach((t,i)=> {
        if(i<itemsVisible){ 
            pendingItems+=`
                <li class="widget-task">
                    <span class="widget-task-due">${getDuePillHtml(t.due)}</span>
                    <span class="widget-task-name">${t.name}</span>
                </li>`
        }
    });

    let icon = el.isMe ? "./img/nurse.png" : "./img/bed.png"

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
            <div class="widget-totals"><p>${/*el.tasks.length*/' '}</p></div>
        </div>            
    `;  
    
    widget.appendChild(widgetContent);

    widget.onclick = ()=>openActiveList(el.id);

    return widget;
}

function getMoment(datetime){
    let hoursAgo = moment.duration(moment().diff(datetime)).asHours();
    let momentOpacity = hoursAgo > 2 ? 1 : hoursAgo > 1 ? .6 : .2; 

    return {hours:hoursAgo, opacity:momentOpacity};
}

function selectTaskList(id){

    //used to show the modal for a taskList
    activeListId = id;
}

function addBedPrompt(){
    addingBed = true;
    drawView();
    document.getElementById("bed_name_input").focus();
}

function cancelBed(){
   let bedInput = document.getElementById("bed_name_input");
   bedInput.value = "";
   addingBed = false;
   drawView();
}

function createBed(){ 
    let bedInput = document.getElementById("bed_name_input");

    let bedId = uuidv4();
    taskLists.push({
        id: bedId,
        name: bedInput.value,
        isMe:false,
        tasks:[]
    });
    bedInput.value = "";
    addingBed = false;
    setActiveList(bedId);
    saveState();
}

function removeBed(){
    let id = activeListId;

    for (let i in taskLists) {
        if (taskLists[i].id == id) {

            taskLists.splice(i,1);
        
            break;
        }    
    }  

    setActiveList();    
    saveState();
}

function openActiveList(id){
    setActiveList(id);
    drawView();
}

function closeActiveList(e){
    setActiveList(null);
    drawView();
}

function setActiveList(id){
    activeListId = id ? id : null;
}

function addTaskPrompt() {
    
    //set the defaults

    
    addingTask = true;
    drawView();

    document.getElementById("task_name_input").focus();

}

function setTaskPreposition(p,e){

    clearTaskPreposition();
    taskPreposition=p;
    e.classList.add("active");

    let timePickerContainer = document.getElementsByClassName("time-picker-container")[0];

    if(p === "ANY")
        timePickerContainer.style.display = "none";
    else timePickerContainer.style.display = "flex";
        

}

function clearTaskPreposition(){
    taskPreposition = "";
    let options = document.getElementsByClassName("option");

    for(let i = 0; i<options.length; i++)
        options[i].classList.remove("active");
    
}

function setTaskHours(el){
    taskHours=el.value;
    document.getElementById("hour_picker_text").value = el.value;
    document.getElementById("hour_picker_slider").value = el.value;
}

function setTaskMinutes(el){
    
    let val = parseInt(el.value);
    
    if(parseInt(val,10)<10)
        val='0'+val;

    taskMinutes=val;
    document.getElementById("minute_picker_text").value = val;
    document.getElementById("minute_picker_slider").value = val;

}

function cancelTask(){

    addingTask = false;
    drawView();

    //reset to defaults
    document.getElementById("task_name_input").value = "";
    setTaskPreposition('IN', document.getElementById("default_option"));
    setTaskHours({value:0});
    setTaskMinutes({value:15})
   
}

function createTask(){


    let id = activeListId;
    let name = document.getElementById("task_name_input").value;

    for (var i in taskLists) {
        if (taskLists[i].id == id) {

            //TODO take the model and work out the due datetime of the task
            let due = "";
            let repeat = 0;
            
            if(taskPreposition == "IN" || taskPreposition == "EVERY"){
                //set due date in x minutes ((hours*60) + mins) from now
                var totalMinutes = (taskHours*60) + parseInt(taskMinutes);
                due = moment().add(totalMinutes,'m');
                
                if(taskPreposition == "EVERY")
                    repeat = totalMinutes;
            }
            
            if(taskPreposition == "AT"){
                //set due date to the specific hour and minute in the future
                let datetime = moment();

                datetime.hours(taskHours).minutes(parseInt(taskMinutes));
                if(datetime < moment())
                    datetime.add(1,'d');
                
                due=datetime;  
            }
            
            taskLists[i].tasks.push({
                id:uuidv4(),
                name: name,
                due: due,
                complete:false,
                repeat:repeat
            });
            
            break;
        }
    
    
    
    
    }  
    
    saveState();
    cancelTask();
}

function completeTask(taskId){
    let id = activeListId;

    for (let i in taskLists) {
        if (taskLists[i].id == id) {
        
            //found the task list
            for(let j in taskLists[i].tasks){
                if(taskLists[i].tasks[j].id == taskId){

                    //found the task
                    taskLists[i].tasks[j].complete = moment();
                    break;
                }
            }

            break;
        }    
    }  
    
    saveState();

}

function editList(setting){
    editingList = setting;
    saveState();
}

function removeTask(taskId){

    let id = activeListId;

    for (let i in taskLists) {
        if (taskLists[i].id == id) {
        
            //found the task list
            for(let j in taskLists[i].tasks){
                if(taskLists[i].tasks[j].id == taskId){

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

function undoComplete(taskId){
    let id = activeListId;

    for (let i in taskLists) {
        if (taskLists[i].id == id) {
        
            //found the task list
            for(let j in taskLists[i].tasks){
                if(taskLists[i].tasks[j].id == taskId){

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

function showCreditsPrompt(){
    showCredits = true;
    drawView();
}

function closeCreditsPrompt(){
   showCredits = false;
   drawView();
}

function saveState(){	
    

   
    //sort the tasks in each tasklist by datetime
    taskLists.forEach(list =>{
        if(list.tasks && list.tasks.length > 0){

            let complete = list.tasks.filter(x=>x.complete!==false);
            let pending = list.tasks.filter(x=>x.complete===false && x.due !== "");
            let any = list.tasks.filter(x=>x.complete===false && x.due === "");
            
            //sort pending
            pending.sort((left,right) => {
                return moment.utc(left.due).diff(moment(right.due));
            });
            
            pending = pending.concat(any);

            //add complete to the end
            list.tasks = pending.concat(complete)
        }
    }); 

    if(orderByProity){
        //sort the tasklists by soonest task datetime
        taskLists.sort((left,right)=>{

            let leftTask = left.tasks.length>0 ? left.tasks[0].due : 0;
            let rightTask = right.tasks.length>0? right.tasks[0].due: 0;
            return moment.utc(leftTask).diff(moment(rightTask));
        });
    } else {
        //sort the tasklists alphabetically
        taskLists.sort((a, b) => a.name.localeCompare(b.name))
    }


    //always put the main tasklist first
    taskLists.sort(function(x,y){ return x.isMe == true ? -1 : y.isMe == true ? 1 : 0; });

    localStorage.setItem("taskLists", JSON.stringify(taskLists));
    drawView();
}

function loadState(reset){

    let savedLists = JSON.parse(localStorage.getItem("taskLists"));
    if(!savedLists) reset = true;

    taskLists = !reset ? savedLists : [
        {
            id:uuidv4(),
            name: "", 
            isMe:true, 
            moment:moment().subtract({hours:3}), 
            tasks:[
                //{id:uuidv4(), name: "Complete this task", due: moment().add(10,'minutes'), complete: false}
            ]}
    ];







    window.setInterval(saveState,10000);
    saveState();
}

function uuidv4() {
//generates a guid
return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
(c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
);
}



loadState();

window.addEventListener('resize', function() {
    drawView();
}, false);