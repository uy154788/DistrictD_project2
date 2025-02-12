const date = new Date();
const dateInput = document.getElementById("taskdate");
const taskListContainer = document.createElement("div");
taskListContainer.className = "task-list";
document.getElementById("selected-date").appendChild(taskListContainer);

document.addEventListener("DOMContentLoaded", function () {
    date.setDate(1);
    const calenderBody = document.getElementById("calender-body");
    const monthSelect = document.getElementById("month-select");
    const yearSelect = document.getElementById("year-select");

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    monthNames.forEach((month, index) => {
        let option = document.createElement("option");
        option.value = index;
        option.textContent = month;
        monthSelect.appendChild(option);
    });

    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
        let option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    function createCalender(year, month) {
        calenderBody.innerHTML = "";
        monthSelect.value = month;
        yearSelect.value = year;

        const firstDay = new Date(year, month, 1).getDay();
        const lastDay = new Date(year, month + 1, 0).getDate();
        const prevLastDay = new Date(year, month, 0).getDate();
        const nextDays = (7 - (firstDay + lastDay) % 7) % 7;
        
        let days = "<tr>";
        for (let x = firstDay; x > 0; x--) {
            days += `<td class="prev-date">${prevLastDay - x + 1}</td>`;
        }

        for (let i = 1; i <= lastDay; i++) {
            const dayClass = i === new Date().getDate() && date.getMonth() === new Date().getMonth() ? "selected-date" : "";
            days += `<td class="day-date active-calender ${dayClass}">${i}</td>`;
            if ((i + firstDay) % 7 === 0) days += "</tr><tr>";           
        }

        for (let j = 1; j <= nextDays; j++) {
            days += `<td class="next-date">${j}</td>`;
        }
        
        days += "</tr>";
        calenderBody.innerHTML = days;
    }

    function updateCalendar() {
        date.setFullYear(yearSelect.value);
        date.setMonth(monthSelect.value);
        createCalender(date.getFullYear(), date.getMonth());
    }

    // Event Listeners for Dropdowns
    monthSelect.addEventListener("change", updateCalendar);
    yearSelect.addEventListener("change", updateCalendar);

    function showNextMonth() {
        date.setMonth(date.getMonth() + 1);
        createCalender(date.getFullYear(), date.getMonth());
    }

    function showPreviousMonth() {
        date.setMonth(date.getMonth() - 1);
        createCalender(date.getFullYear(), date.getMonth());
    }

    createCalender(date.getFullYear(), date.getMonth());

    document.getElementById("prev-month").addEventListener("click", showPreviousMonth);
    document.getElementById("next-month").addEventListener("click", showNextMonth);
    document.getElementById("calender-body").addEventListener("click", handleClickedDate);
});


function handleClickedDate(event) {
    const target = event.target;
    document.getElementsByClassName("form-container")[0].style.display = "block";
    if (target.tagName === "TD" && target.classList.contains("active-calender")) {
        document.querySelectorAll(".selected-date").forEach(td => td.classList.remove("selected-date"));
        target.classList.add("selected-date");
        
        const selectedDay = target.innerText.padStart(2, '0');
        const selectedMonth = (date.getMonth() + 1).toString().padStart(2, '0');
        const selectedDate = `${selectedDay}/${selectedMonth}/${date.getFullYear()}`;
        dateInput.value = selectedDate;
        displayTasks(selectedDate);
    }
}

function validateDataAndSave() {
    const taskNameInput = document.getElementById("taskname").value.trim();
    const taskDescInput = document.getElementById("taskdescription").value.trim();
    const userSelectedDate = dateInput.value;

    if (!userSelectedDate || !taskNameInput || !taskDescInput) {
        alert("Please fill in all fields and select a date.");
        return;
    }

    let tasks = JSON.parse(localStorage.getItem(userSelectedDate)) || [];
    tasks.push({ name: taskNameInput, description: taskDescInput });
    localStorage.setItem(userSelectedDate, JSON.stringify(tasks));
    
    displayTasks(userSelectedDate);
    document.getElementById("taskname").value = "";
    document.getElementById("taskdescription").value = "";

}

function displayTasks(dateKey) {
    taskListContainer.innerHTML = "";
    const tasks = JSON.parse(localStorage.getItem(dateKey)) || [];
    
    tasks.forEach((task, index) => {
        const taskElement = document.createElement("div");
        taskElement.className = "task-item";

        taskElement.innerHTML = `
            <p><strong>${task.name}</strong>: 
                <span id="desc-${dateKey}-${index}">${task.description}</span>
                <input type="text" id="edit-${dateKey}-${index}" value="${task.description}" style="display:none;">
            </p>
            <div class="task-actions">
                <button onclick="editTask('${dateKey}', ${index})" id="editbtn-${dateKey}-${index}">Edit</button>
                <button onclick="saveTask('${dateKey}', ${index})" style="display:none;" id="save-${dateKey}-${index}">Save</button>
                <button onclick="deleteTask('${dateKey}', ${index})">X</button>
            </div>
        `;
        taskListContainer.appendChild(taskElement);
    });
}

function editTask(dateKey, index) {
    document.getElementById(`desc-${dateKey}-${index}`).style.display = "none";
    document.getElementById(`editbtn-${dateKey}-${index}`).style.display = "none";
    document.getElementById(`edit-${dateKey}-${index}`).style.display = "inline-block";
    document.getElementById(`save-${dateKey}-${index}`).style.display = "inline-block";
    
}

// Function to save edited task
function saveTask(dateKey, index) {
    let tasks = JSON.parse(localStorage.getItem(dateKey)) || [];
    const newDesc = document.getElementById(`edit-${dateKey}-${index}`).value.trim();

    if (newDesc) {
        tasks[index].description = newDesc;
        localStorage.setItem(dateKey, JSON.stringify(tasks));
        displayTasks(dateKey);
    } else {
        alert("Task description cannot be empty.");
    }
}

function deleteTask(dateKey, index) {
    let tasks = JSON.parse(localStorage.getItem(dateKey)) || [];
    tasks.splice(index, 1);
    if (tasks.length > 0) {
        localStorage.setItem(dateKey, JSON.stringify(tasks));
    }
    else {
        localStorage.removeItem(dateKey);
    }
    displayTasks(dateKey);
}

function closeTask(){
    document.getElementsByClassName("form-container")[0].style.display = "none";
    location.reload();
}

