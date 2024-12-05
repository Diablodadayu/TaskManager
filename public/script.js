document.addEventListener("DOMContentLoaded", async function() {
    const taskForm = document.getElementById("task-form");
    const taskTitleInput = document.getElementById("task-title");
    const dueDateInput = document.getElementById("due-date");
    const priorityDropdown = document.getElementById("priority-dropdown");
    const descriptionInput = document.getElementById("description");
    const assigneeInput = document.getElementById("assignee");
    const searchInput = document.getElementById("search-input");
    const taskList = document.getElementById("task-list");

    const editModal = document.getElementById("edit-modal");
    const closeEditModal = document.getElementById("close-modal");
    const saveEditButton = document.getElementById("save-edit");
    const cancelEditButton = document.getElementById("cancel-edit");

    const editTitleInput = document.getElementById("edit-title");
    const editDueDateInput = document.getElementById("edit-due-date");
    const editPriorityDropdown = document.getElementById("edit-priority-dropdown");
    const editDescriptionInput = document.getElementById("edit-description");
    const editAssigneeInput = document.getElementById("edit-assignee");

    // Load tasks from http api
    
    
    let editedTask = undefined;

    function renderTasks(rendTasks) {
        taskList.innerHTML = '';
        rendTasks.forEach((task)=>{
            const li = document.createElement("li");
            li.style.backgroundColor = getRandomColor();

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("dlt_btn");
            deleteButton.addEventListener("click", () => {
                deleteTask(task);
            });

            const editButton = document.createElement("button");
            editButton.textContent = "Edit";
            editButton.classList.add("edt_btn");
            editButton.addEventListener("click", () => {
                editTask(task);
            });

            li.textContent = `Task ${task.id}: ${task.title}, Due Date: ${task.dueDate}, Priority: ${task.priority}, Description: ${task.description}, Assigned To: ${task.assignee}`;
            
            li.appendChild(document.createElement("br"));
            li.appendChild(deleteButton);
            li.appendChild(editButton);
            taskList.appendChild(li);
        })
    }

    taskForm.addEventListener("submit", function(event) {
        event.preventDefault();
        searchInput.value = "";
        const title = taskTitleInput.value;
        const dueDate = dueDateInput.value;
        const priority = priorityDropdown.value;
        const description = descriptionInput.value;
        const assignee = assigneeInput.value;

        if (!title) {
            alert("Please input all information");
            return;
        }
        let data = {title, dueDate, priority, description, assignee};
        request("/api/tasks", "POST", data)
        .then(res=>{
            if (res.code != 0) {
                console.log(res.error.message);
                return;   
            }
            return request("/api/tasks", "GET")
        })
        .then(res=>{
            if (res.code != 0) {
                console.log(res.error.message);
                return;   
            }
            tasks = res.data;
            renderTasks(tasks);
            taskForm.reset();
        })
        .catch(error=>{
            console.log(error.message);
        })
    });
    

    function getRandomColor() {
        const colors = ["#ff9999", "#99ff99", "#9999ff", "#ff99ff", "#99ffff", "#c8f6ca", "#c8f3f6", "#e8c8f6", "#f6c8d7"];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    function deleteTask(task) {
        let id = task.id;
        request(`/api/tasks/${id}`, "DELETE")
        .then(res => {
            if (res.code != 0) {
                console.log(res.error.message);
                return;
            }
            return request("/api/tasks", "GET");
        })
        .then(res => {
            if (res.code != 0) {
                console.log(res.error.message);
                return;   
            }
            tasks = res.data;
            filterAndRenderTasks(tasks);
        })
        .catch(error=>{
            console.log(error.message);
            return;
        })
        
    }

    // Function to filter tasks and render the filtered list
    function filterAndRenderTasks(rendTasks) {
        const searchQuery = searchInput.value.trim().toLowerCase();
        if (typeof rendTasks != "Array") {
            rendTasks = tasks;
        }
        if (searchQuery) {
            rendTasks = rendTasks.filter((task) => {
                return task.title.toLowerCase().includes(searchQuery) ||
                task.dueDate.toLowerCase().includes(searchQuery) ||
                task.priority.toLowerCase().includes(searchQuery) ||
                task.description.toLowerCase().includes(searchQuery) ||
                task.assignee.toLowerCase().includes(searchQuery);
            });
        }
        renderTasks(rendTasks);
    }

    searchInput.addEventListener("input", filterAndRenderTasks);

    // Show the edit modal when clicking "Edit" button
    function editTask(task) {
        editedTask = task;
        editTitleInput.value = task.title;
        editDueDateInput.value = task.dueDate;
        editPriorityDropdown.value = task.priority;
        editDescriptionInput.value = task.description;
        editAssigneeInput.value = task.assignee;
        editModal.style.display = "block";
    }

    // Close the edit modal
    closeEditModal.addEventListener("click", function() {
        editModal.style.display = "none";
    });

    // Save the edited task
    saveEditButton.addEventListener("click", function() {
        searchInput.value = "";
        const title = editTitleInput.value;
        const dueDate = editDueDateInput.value;
        const priority = editPriorityDropdown.value;
        const description = editDescriptionInput.value;
        const assignee = editAssigneeInput.value;

        if (!title) {
            alert("Please input all information");
            return
        }
        // Update the task with edited details
        let data = { title, dueDate, priority, description, assignee };
        request(`/api/tasks/${editedTask.id}`, "PUT", data)
        .then(res=>{
            if (res.code != 0) {
                console.log(res.error.message);
                return
            }
            return request("/api/tasks", "GET")
        })
        .then(res=>{
            if (res.code != 0) {
                console.log(res.error.message);
                return;   
            }
            tasks = res.data;
            renderTasks(tasks);
            taskForm.reset();
            editModal.style.display = "none";
        })
        .catch(error=>{
            console.log(error.message);
        })
    });

    // Cancel the editing and close the modal
    cancelEditButton.addEventListener("click", function() {
        editModal.style.display = "none";
    });

    let tasks = await getAllTasks();
    renderTasks(tasks);
});

async function request(url = "", method, body) {
    let data = {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    }
    if (body) data.body = JSON.stringify(body);
    const response = await fetch(url, data);
    return response.json(); // parses JSON response into native JavaScript objects
}

async function getAllTasks() {
    let tasks = [];
    try{
        let res = await request("/api/tasks", "GET");
        if (res.code == 0) {
            tasks = res.data;
        }
    } catch(e) {
        console.log("getAllTasks error", e.message);
    } finally {
        return tasks;
    }
}
