const taskInput = document.getElementById('taskInput');
const taskDateInput = document.getElementById('taskDate');
const taskTimeInput = document.getElementById('taskTime');
const taskList = document.getElementById('taskList');
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromLocalStorage();
});

function addTask() {
    const taskText = taskInput.value.trim();
    const taskDate = taskDateInput.value;
    const taskTime = taskTimeInput.value;
    const currentDateTime = new Date();
    const taskDateTime = new Date(taskDate);
    const [hours, minutes] = taskTime.split(':');
    taskDateTime.setHours(hours, minutes);
    if (taskText === '') {
        alert('Please enter a valid task.');
        return;
    }
    if (taskDateTime < currentDateTime) {
        alert('Please check the date and time.');
        return;
    }
    if (taskText !== '') {
        const listItem = document.createElement('div');
        listItem.className = 'task-box';
        listItem.innerHTML = `
            <div>
                <span><b>${taskText}</b></span>
            <br />
                <span class="task-datetime">${formatDate(taskDate)} at ${formatTime(taskTime)}</span>
        </div>
                <button class="update-btn" onclick="updateTask(this)">Update</button>
                <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
                <button class="complete-btn" onclick="completeTask(this)">Complete</button>
                
        `;
        taskList.appendChild(listItem);
        taskInput.value = '';
        taskDateInput.value = '';
        taskTimeInput.value = '';
        saveTasksToLocalStorage();
        const timeDifference = taskDateTime - currentDateTime;
        setTimeout(() => {
            playAlarmSound();
        }, timeDifference);
    }
}
function playAlarmSound() {
    const alarmSound = document.getElementById('alarmSound');
    alarmSound.play().then(() => {
    }).catch((error) => {
       
        console.error('Sound playback failed:', error);
    });
}
function completeTask(button) {
    const listItem = button.parentElement;
    if (button.innerText === 'Complete') {
        button.innerText = 'Not-yet-completed';
      } else if (button.innerText === 'Not-yet-completed') {
        button.innerText = 'Complete';
      }
    
    listItem.classList.toggle('completed');
    saveTasksToLocalStorage();
}

function updateTask(button) {
    const listItem = button.parentElement;
    const taskSpan = listItem.querySelector('span');
    const taskDatetime = listItem.querySelector('.task-datetime');
    const updateInput = document.createElement('input');
    updateInput.type = 'text';
    updateInput.value = taskSpan.innerText;
    const updateDateInput = document.createElement('input');
    updateDateInput.type = 'date';
    updateDateInput.value = parseDate(taskDatetime.innerText);
    const updateTimeInput = document.createElement('input');
    updateTimeInput.type = 'time';
    updateTimeInput.value = parseTime(taskDatetime.innerText);  taskSpan.replaceWith(updateInput);
    taskDatetime.replaceWith(updateDateInput);
    listItem.appendChild(updateTimeInput);

    button.innerText = 'Save';
    button.onclick = function () {
        const newTaskText = updateInput.value.trim();
        if (newTaskText !== '') {
            taskSpan.innerText = newTaskText;
            const taskDate = updateDateInput.value;
            const taskTime = updateTimeInput.value;
            taskDatetime.innerText = formatDate(taskDate) + ' at ' + formatTime(taskTime);
        }

        updateInput.replaceWith(taskSpan);
        updateDateInput.replaceWith(taskDatetime);
        updateTimeInput.remove();

        button.innerText = 'Update';
        button.onclick = function () {
            updateTask(button);
        };
    };
    saveTasksToLocalStorage();
}

function deleteTask(button) {
    const listItem = button.parentElement;
    taskList.removeChild(listItem);
    saveTasksToLocalStorage();
}

function displayCompletedTasks() {
    const taskBoxes = document.getElementsByClassName('task-box');
    for (const taskBox of taskBoxes) {
        if (taskBox.classList.contains('completed')) {
            taskBox.style.display = 'block';
        } else {
            taskBox.style.display = 'none';
        }
    }
}

function displayActiveTasks() {
    const taskBoxes = document.getElementsByClassName('task-box');
    for (const taskBox of taskBoxes) {
        if (taskBox.classList.contains('completed')) {
            taskBox.style.display = 'none';
        } else {
            taskBox.style.display = 'block';
        }
    }
}

function saveTasksToLocalStorage() {
    const taskBoxes = taskList.getElementsByClassName('task-box');

    const tasks = [];
    for (const taskBox of taskBoxes) {
        const taskText = taskBox.querySelector('b').innerText;
        const taskDate = parseDate(taskBox.querySelector('.task-datetime').innerText);
        const taskTime = parseTime(taskBox.querySelector('.task-datetime').innerText);
        const isCompleted = taskBox.classList.contains('completed');

        const task = {
            text: taskText,
            date: taskDate,
            time: taskTime,
            completed: isCompleted,
        };

        tasks.push(task);
    }

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasksFromLocalStorage() {
    const tasksJson = localStorage.getItem('tasks');
    if (tasksJson) {
        const tasks = JSON.parse(tasksJson);
        for (const task of tasks) {
            const listItem = document.createElement('div');
            listItem.className = 'task-box';
            listItem.innerHTML = `
                <div>
                    <span><b>${task.text}</b></span>
                    <br />
                    <span class="task-datetime">${formatDate(task.date)} at ${formatTime(task.time)}</span>
                </div>
                <button class="update-btn" onclick="updateTask(this)">Update</button>
                <button class="delete-btn" onclick="deleteTask(this)">Delete</button>
                <button class="complete-btn" onclick="completeTask(this)">Complete</button>
            `;

            if (task.completed) {
                listItem.classList.add('completed');
            }
            taskList.appendChild(listItem);
        }
    }
}

function parseDate(datetimeString) {
    return datetimeString.split(' at ')[0];
}

function parseTime(datetimeString) {
    return datetimeString.split(' at ')[1];
}

function formatDate(dateString) {
    const options = {year: 'numeric' , month: 'long',day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
}
function isFutureDateTime(dateTimeString) {
    const givenDateTime = new Date(dateTimeString);
    const currentDateTime = new Date();
    if( givenDateTime < currentDateTime){
        prompt('please enter valid date and time');
    }
}
