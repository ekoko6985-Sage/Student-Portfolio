// Task Planner functionality
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskDate = document.getElementById('taskDate');
const taskPriority = document.getElementById('taskPriority');
const tasksList = document.getElementById('tasksList');
const tasksEmpty = document.getElementById('tasksEmpty');
const searchInput = document.getElementById('searchInput');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalTasksEl = document.getElementById('totalTasks');
const completedTasksEl = document.getElementById('completedTasks');
const pendingTasksEl = document.getElementById('pendingTasks');

let tasks = [];
let currentFilter = 'all';
const STORAGE_KEY = 'academic_tasks';

// Initialize
if (taskForm) {
    document.addEventListener('DOMContentLoaded', () => {
        loadTasks();
        renderTasks();
        setupEventListeners();
    });
}

// Setup event listeners
function setupEventListeners() {
    taskForm.addEventListener('submit', addTask);
    searchInput.addEventListener('input', handleSearch);
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => handleFilter(btn));
    });
}

// Add task
function addTask(e) {
    e.preventDefault();

    if (!taskInput.value.trim()) {
        showNotification('Please enter a task description', 'error');
        return;
    }

    const task = {
        id: Date.now(),
        title: taskInput.value.trim(),
        date: taskDate.value || new Date().toISOString().split('T')[0],
        priority: taskPriority.value,
        completed: false,
        createdAt: new Date().toISOString()
    };

    tasks.unshift(task);
    saveTasks();
    renderTasks();
    taskForm.reset();
    showNotification('Task added successfully!', 'success');
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
    showNotification('Task deleted', 'success');
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Search tasks
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = tasks.filter(task => 
        task.title.toLowerCase().includes(searchTerm)
    );
    renderTasks(filtered);
}

// Filter tasks
function handleFilter(btn) {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.getAttribute('data-filter');
    renderTasks();
}

// Render tasks
function renderTasks(tasksToRender = null) {
    const tasksToDisplay = tasksToRender || getFilteredTasks();

    if (tasksToDisplay.length === 0) {
        tasksList.innerHTML = '';
        tasksEmpty.style.display = 'block';
        updateStats();
        return;
    }

    tasksEmpty.style.display = 'none';
    tasksList.innerHTML = tasksToDisplay.map(task => `
        <div class="task-item ${task.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
                aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}"
            >
            <div class="task-content">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <div class="task-meta">
                    ${task.date ? `<span>📅 ${formatDate(task.date)}</span>` : ''}
                    <span class="task-priority-badge priority-${task.priority}">⚡ ${task.priority}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-delete-btn" onclick="deleteTask(${task.id})" aria-label="Delete task">
                    Delete
                </button>
            </div>
        </div>
    `).join('');

    updateStats();
}

// Get filtered tasks
function getFilteredTasks() {
    switch(currentFilter) {
        case 'completed':
            return tasks.filter(task => task.completed);
        case 'pending':
            return tasks.filter(task => !task.completed);
        default:
            return tasks;
    }
}

// Update statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const pending = total - completed;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    pendingTasksEl.textContent = pending;
}

// Format date
function formatDate(dateString) {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : [];
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#28A745' : '#DC3545'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 1001;
        animation: slideIn 0.3s ease-out;
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}
