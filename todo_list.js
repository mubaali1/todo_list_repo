let btn = document.querySelector(".add-btn");
let input = document.querySelector("input");
let ul = document.querySelector("ul");

// Function to create a new task item
function createNewTask(taskText) {
    let li = document.createElement("li");

    let span = document.createElement("span");
    span.textContent = taskText;
    li.appendChild(span);

    let editBtn = document.createElement("button");
    editBtn.innerText = "Edit";
    editBtn.classList.add("Edit");
    li.appendChild(editBtn);

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("Delete");
    li.appendChild(deleteBtn);
    
    return li;
}

// Add a new task
btn.addEventListener("click", function() {
    if (input.value.trim() === "") {
        alert("Please enter a task.");
        return;
    }
    const task = createNewTask(input.value);
    ul.appendChild(task);
    input.value = "";
});

// Event delegation for complete, edit, save, and delete
ul.addEventListener("click", function(event) {
    const target = event.target;
    const li = target.parentElement;

    // Mark task as completed
    if (target.tagName === "SPAN") {
        li.classList.toggle("completed");
    }

    // Delete task
    if (target.classList.contains("Delete")) {
        li.remove();
    }

    // Edit/Save task
    if (target.classList.contains("Edit")) {
        const span = li.querySelector("span");
        
        if (target.innerText.toLowerCase() === "edit") {
            // Switch to edit mode
            const currentText = span.innerText;
            const textInput = document.createElement("input");
            textInput.type = "text";
            textInput.value = currentText;
            li.insertBefore(textInput, span);
            li.removeChild(span);
            target.innerText = "Save";
            target.classList.add("Save");
        } else {
            // Switch to save mode
            const textInput = li.querySelector("input[type='text']");
            const newText = textInput.value;
            const newSpan = document.createElement("span");
            newSpan.innerText = newText;
            li.insertBefore(newSpan, textInput);
            li.removeChild(textInput);
            target.innerText = "Edit";
            target.classList.remove("Save");
        }
    }
});

// Add controls to initial static tasks
document.querySelectorAll('ul li').forEach(li => {
    if (!li.querySelector('.Edit')) {
        const editBtn = document.createElement('button');
        editBtn.innerText = 'Edit';
        editBtn.className = 'Edit';
        li.insertBefore(editBtn, li.querySelector('.Delete'));
    }
});