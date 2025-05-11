let socket = io();
let tasksListContainer = document.querySelector('.tasks-list');
let input = document.querySelector('#task_input');
let form = document.querySelector('form.task-form');
let progressBar = document.querySelector('.progress-bar');
let finishBtn = document.querySelector('.finish-button');
let dashboard = document.querySelector('.dashboard');

const backBtn = document.querySelector('.back-button');
const createUserBtn = document.getElementById('submit');
const profileForm = document.querySelector('.profile-form');
// const firstName = document.querySelector('#name');
const lastName = document.querySelector('#last-name');
const displayedUsername = document.querySelector('.displayed-name');

const loader = document.querySelector('.loader');
let currentUser;
socket.emit('get online users');
const firstName = document.querySelector('#name');



// ------------------- EVENTLISTENERS -------------------
if (createUserBtn) {
    createUserBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const insertedName = firstName.value.trim();
    if (insertedName.length > 0) {
        socket.emit('new-user', insertedName);
        socket.emit('user joined', insertedName);
        currentUser = insertedName;
    }
 
    window.location.href = `/dashboard?name=${encodeURIComponent(insertedName)}`;
});
}


const params = new URLSearchParams(window.location.search);
const savedName = params.get('name');
localStorage.setItem('name', 'savedName');


if (savedName) {
    displayedUsername.innerHTML = savedName;
    socket.emit('user joined', savedName);
}

window.history.replaceState({}, document.title, "/dashboard");




if (tasksListContainer) {
    function renderTasks(tasks) {
        tasksListContainer.innerHTML = '';
        let completedCount = 0;

        tasks.forEach((task, index) => {
            let li = document.createElement('li');
            li.classList.add('list');

            let checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                socket.emit('toggleTask', index);
            });

            if (task.completed) {
                li.classList.add('completed');
                completedCount++;
            }

            li.appendChild(checkbox);
            li.appendChild(document.createTextNode(task.text));
            tasksListContainer.appendChild(li);
        });

        let percent = tasks.length ? (completedCount / tasks.length) * 100 : 0;
        progressBar.style.width = percent + '%';
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (input.value.trim()) {
            socket.emit('addTask', input.value.trim());
            input.value = '';
        }
    });

    socket.on('initialTasks', (tasks) => {
        renderTasks(tasks);
    });

    socket.on('tasks', (tasks) => {
        renderTasks(tasks);
    });

    finishBtn.addEventListener('click', () => {
        socket.emit('resetTasks');
    });

}

const avatarForm = document.getElementById('avatar');

avatarForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('avatar');
    const file = fileInput.files[0];

    const formData = new FormData();
    formData.append('avatar', file);

    const res = await fetch('http://localhost:5040/upload', {
        method: 'POST',
        body: formData,
    });

    const data = await res.json();

    if (data.success) {
        localStorage.setItem('profileImageUrl', data.imageUrl); // save URL for dashboard
        window.location.href = '/dashboard';
    } else {
        alert('Upload failed');
    }
});


