const input = document.querySelector('.todo-input');
const addButton = document.querySelector('.add-button');
const todoList = document.querySelector('.todo-list');

const number = 1000;
const BASE_URL = 'http://localhost:8081/todos';

// Function to add a new to-do item
function addTodo() {
    const task = input.value.trim();
    if (task) {
        const todoItem = document.createElement('li');
        todoItem.classList.add('todo-item');
        
        const taskText = document.createElement('span');
        taskText.textContent = task;

        // Toggle task completion on click
        taskText.addEventListener('click', () => {
            todoItem.classList.toggle('completed');
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.addEventListener('click', () => {
            todoList.removeChild(todoItem);
        });

        todoItem.appendChild(taskText);
        todoItem.appendChild(deleteBtn);
        todoList.appendChild(todoItem);

        input.value = '';

        // Send the new todo to the server
        fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: task, completed: false })
        });
    }
}

// Function to fetch and render todos from the server
function fetchTodos() {
    fetch(BASE_URL)
        .then(response => response.json())
        .then(todos => {
            todos.forEach(todo => {
                const todoItem = document.createElement('li');
                todoItem.classList.add('todo-item');
                
                const taskText = document.createElement('span');
                taskText.textContent = todo.title;

                // Toggle task completion on click
                if (todo.completed) {
                    todoItem.classList.add('completed');
                }

                taskText.addEventListener('click', () => {
                    todoItem.classList.toggle('completed');

                    // Send the updated completion status to the server
                    fetch(`${BASE_URL}/${todo.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            ...todo,
                            completed: !todo.completed
                        })
                    });
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '✕';
                deleteBtn.addEventListener('click', () => {
                    todoList.removeChild(todoItem);
                    fetch(`${BASE_URL}/${todo.id}`, {
                        method: 'DELETE'
                    });
                });

                todoItem.appendChild(taskText);
                todoItem.appendChild(deleteBtn);
                todoList.appendChild(todoItem);
            });
        })
        .catch(error => console.error('Error fetching todos:', error));
}

// Listen for Enter key to add a new to-do
input.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        addTodo();
    }
});

// Listen for button click to add a new to-do
addButton.addEventListener('click', addTodo);

// Fetch and render todos when the page loads
document.addEventListener('DOMContentLoaded', fetchTodos);
