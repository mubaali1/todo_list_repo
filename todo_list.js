let btn = document.querySelector("button");
let input = document.querySelector("input");
let ul = document.querySelector("ul");

btn.addEventListener("click", function() {
    let li = document.createElement("li");
    if(input.value === "") {
        alert("Please enter a task.");
        return;
    }
    li.textContent = input.value;

    let span = document.createElement("span");
    span.textContent = "";
    li.appendChild(span);

    let deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Delete";
    deleteBtn.classList.add("Delete");
    
    li.appendChild(deleteBtn);
    ul.appendChild(li);
    input.value = "";
});

ul.addEventListener("click", function(event) {
    if (event.target.classList.contains("Delete")) {
        ul.removeChild(event.target.parentElement);
    }
});