// 个人工作看板 - 交互功能

document.addEventListener('DOMContentLoaded', function() {
    // 初始化所有功能
    initThemeToggle();
    initSalesChart();
    initCalendar();
    initKanbanDragDrop();
    initTaskCheckboxes();
    initNotifications();
    initStatsRefresh();
    initGlassEffect();
    
    // 显示欢迎消息
    showWelcomeMessage();
});

// 主题切换功能
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const themeText = themeToggle.querySelector('span');
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        document.body.classList.toggle('light-theme');
        
        if (document.body.classList.contains('dark-theme')) {
            themeIcon.className = 'fas fa-sun';
            themeText.textContent = '亮色模式';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeText.textContent = '暗色模式';
        }
        
        // 保存主题偏好
        localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
    });
    
    // 加载保存的主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = '亮色模式';
    }
}

// 销售图表初始化
function initSalesChart() {
    const ctx = document.getElementById('salesChart').getContext('2d');
    
    // 模拟销售数据
    const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
    const salesData = [65000, 82000, 75000, 92000, 88000, 95000];
    const targetData = [70000, 80000, 85000, 90000, 85000, 90000];
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {
                    label: '实际销售额',
                    data: salesData,
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4
                },
                {
                    label: '目标销售额',
                    data: targetData,
                    borderColor: '#f72585',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
                        font: {
                            family: "'Poppins', sans-serif"
                        }
                    }
                },
                tooltip: {
                    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-card').trim(),
                    titleColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
                    bodyColor: getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim(),
                    borderColor: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
                    borderWidth: 1,
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ¥${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim()
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
                    },
                    ticks: {
                        color: getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim(),
                        callback: function(value) {
                            return '¥' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// 日历初始化
function initCalendar() {
    const calendarDays = document.querySelector('.calendar-days');
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    // 获取当月天数
    const daysInMonth = lastDay.getDate();
    
    // 获取第一天是星期几（0=周日，6=周六）
    const firstDayIndex = firstDay.getDay();
    
    // 清空日历
    calendarDays.innerHTML = '';
    
    // 添加上个月的日期
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = firstDayIndex; i > 0; i--) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = prevMonthLastDay - i + 1;
        calendarDays.appendChild(day);
    }
    
    // 添加当月日期
    for (let i = 1; i <= daysInMonth; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day';
        day.textContent = i;
        
        // 标记今天
        if (i === today.getDate() && currentMonth === today.getMonth()) {
            day.classList.add('today');
        }
        
        // 随机添加一些事件标记
        if (Math.random() > 0.7 && i > today.getDate()) {
            day.classList.add('event');
        }
        
        // 添加点击事件
        day.addEventListener('click', function() {
            document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
            this.classList.add('selected');
            showDayEvents(i);
        });
        
        calendarDays.appendChild(day);
    }
    
    // 添加下个月的日期
    const totalCells = 42; // 6行×7列
    const nextMonthDays = totalCells - (firstDayIndex + daysInMonth);
    for (let i = 1; i <= nextMonthDays; i++) {
        const day = document.createElement('div');
        day.className = 'calendar-day other-month';
        day.textContent = i;
        calendarDays.appendChild(day);
    }
}

// 显示日期事件
function showDayEvents(day) {
    const events = [
        { time: '10:30', title: '团队会议', type: 'meeting' },
        { time: '14:00', title: '客户演示', type: 'demo' },
        { time: '16:30', title: '项目评审', type: 'review' }
    ];
    
    const eventList = document.querySelector('.event-list');
    eventList.innerHTML = '';
    
    events.forEach(event => {
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.innerHTML = `
            <div class="event-time">${event.time}</div>
            <div class="event-details">
                <div class="event-title">${event.title}</div>
                <div class="event-location">会议室${Math.floor(Math.random() * 5) + 1}</div>
            </div>
        `;
        eventList.appendChild(eventItem);
    });
}

// 看板拖拽功能
function initKanbanDragDrop() {
    const kanbanItems = document.querySelectorAll('.kanban-item');
    const kanbanColumns = document.querySelectorAll('.kanban-column');
    
    let draggedItem = null;
    
    // 添加拖拽事件
    kanbanItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            draggedItem = this;
            setTimeout(() => {
                this.style.opacity = '0.4';
            }, 0);
        });
        
        item.addEventListener('dragend', function() {
            setTimeout(() => {
                draggedItem.style.opacity = '1';
                draggedItem = null;
            }, 0);
            
            // 更新列计数
            updateColumnCounts();
        });
        
        item.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        item.addEventListener('dragenter', function(e) {
            e.preventDefault();
            this.style.backgroundColor = 'rgba(67, 97, 238, 0.1)';
        });
        
        item.addEventListener('dragleave', function() {
            this.style.backgroundColor = '';
        });
        
        item.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
            if (draggedItem !== this) {
                const kanbanItemsContainer = this.closest('.kanban-items');
                kanbanItemsContainer.insertBefore(draggedItem, this);
            }
        });
    });
    
    // 列容器也支持拖放
    kanbanColumns.forEach(column => {
        const itemsContainer = column.querySelector('.kanban-items');
        
        itemsContainer.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.backgroundColor = 'rgba(67, 97, 238, 0.05)';
        });
        
        itemsContainer.addEventListener('dragleave', function() {
            this.style.backgroundColor = '';
        });
        
        itemsContainer.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.backgroundColor = '';
            if (draggedItem && !this.contains(draggedItem)) {
                this.appendChild(draggedItem);
                updateColumnCounts();
            }
        });
    });
}

// 更新列计数
function updateColumnCounts() {
    document.querySelectorAll('.kanban-column').forEach(column => {
        const count = column.querySelectorAll('.kanban-item').length;
        const countElement = column.querySelector('.column-count');
        if (countElement) {
            countElement.textContent = count;
        }
    });
}

// 任务复选框功能
function initTaskCheckboxes() {
    const checkboxes = document.querySelectorAll('.task-item input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            const label = taskItem.querySelector('label');
            
            if (this.checked) {
                taskItem.classList.add('completed');
                label.style.textDecoration = 'line-through';
                label.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
                
                // 更新任务统计
                updateTaskStats();
                
                // 显示完成动画
                showCompletionAnimation(taskItem);
            } else {
                taskItem.classList.remove('completed');
                label.style.textDecoration = 'none';
                label.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
                
                // 更新任务统计
                updateTaskStats();
            }
        });
    });
}

// 更新任务统计
function updateTaskStats() {
    const totalTasks = document.querySelectorAll('.task-item').length;
    const completedTasks = document.querySelectorAll('.task-item.completed').length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    // 更新统计卡片
    const taskStat = document.querySelector('.task-card .stat-value');
    const taskProgress = document.querySelector('.task-card .progress-fill');
    
    if (taskStat) {
        taskStat.textContent = `${completedTasks}/${totalTasks}`;
    }
    
    if (taskProgress) {
        taskProgress.style.width = `${completionRate}%`;
        
        const progressText = taskProgress.closest('.stat-progress').querySelector('span');
        if (progressText) {
            progressText.textContent = `${completionRate}% 完成`;
        }
    }
}

// 显示完成动画
function showCompletionAnimation(element) {
    const animation = document.createElement('div');
    animation.className = 'completion-animation';
    animation.innerHTML = '<i class="fas fa-check-circle"></i>';
    animation.style.cssText = `
        position: absolute;
        right: 10px;
        color: #4ade80;
        font-size: 20px;
        animation: bounce 0.5s ease;
    `;
    
    element.style.position = 'relative';
    element.appendChild(animation);
    
    setTimeout(() => {
        animation.remove();
    }, 1000);
}

// 通知功能
function initNotifications() {
    const notificationBtn = document.querySelector('.notification-btn');
    const notificationCount = document.querySelector('.notification-count');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            // 模拟清除通知
            notificationCount.textContent = '0';
            notificationCount.style.display = 'none';
            
            showToast('所有通知已标记为已读');
        });
    }
    
    // 关闭通知提示
    const toastClose = document.querySelector('.toast-close');
    if (toastClose) {
        toastClose.addEventListener('click', function() {
            const toast = this.closest('.notification-toast');
            toast.style.animation = 'slideOut 0.3s ease forwards';
            setTimeout(() => {
                toast.style.display = 'none';
            }, 300);
        });
    }
}

// 显示提示
function showToast(message) {
    const toast = document.querySelector('.notification-toast');
    const toastContent = toast.querySelector('.toast-content span');
    
    toastContent.textContent = message;
    toast.style.display = 'flex';
    toast.style.animation = 'slideIn 0.3s ease';
    
    // 5秒后自动隐藏
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => {
            toast.style.display = 'none';
        }, 300);
    }, 5000);
}

// 统计刷新功能
function initStatsRefresh() {
    const refreshBtn = document.querySelector('.refresh-btn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            // 添加旋转动画
            const icon = this.querySelector('i');
            icon.style.animation = 'spin 1s linear';
            
            // 模拟数据更新
            setTimeout(() => {
                // 更新销售数据
                const salesValue = document.querySelector('.sales-card .stat-value');
                const salesChange = document.querySelector('.sales-card .positive');
                
                if (salesValue && salesChange) {
                    const newValue = Math.floor(248500 + Math.random() * 10000);
                    const newChange = (Math.random() * 5 + 10).toFixed(1);
                    
                    salesValue.textContent = `¥${newValue.toLocaleString()}`;
                    salesChange.textContent = `+${newChange}%`;
                }
                
                // 更新专注时间
                const focusValue = document.querySelector('.focus-card .stat-value');
                const focusProgress = document.querySelector('.focus-card .progress-fill');
                
                if (focusValue && focusProgress) {
                    const newHours = (4.2 + Math.random() * 0.5).toFixed(1);
                    const newProgress = Math.min(100, Math.floor((newHours / 6) * 100));
                    
                    focusValue.textContent = `${newHours}h`;
                    focusProgress.style.width = `${newProgress}%`;
                }
                
                // 停止旋转动画
                icon.style.animation = '';
                
                showToast('数据已刷新');
            }, 1000);
        });
    }
}

// 毛玻璃效果增强
function initGlassEffect() {
    // 为卡片添加鼠标悬停效果
    const cards = document.querySelectorAll('.card, .stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.backdropFilter = 'blur(10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.backdropFilter = '';
        });
    });
}

// 显示欢迎消息
function showWelcomeMessage() {
    const hour = new Date().getHours();
    let greeting;
    
    if (hour < 12) {
        greeting = '早上好';
    } else if (hour < 18) {
        greeting = '下午好';
    } else {
        greeting = '晚上好';
    }
    
    // 延迟显示欢迎消息
    setTimeout(() => {
        showToast(`${greeting}！今日有12个任务待完成，加油！`);
    }, 1500);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @keyframes bounce {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.2); }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .completion-animation {
        animation: bounce 0.5s ease;
    }
    
    .other-month {
        opacity: 0.3;
    }
    
    .calendar-day.selected {
        background: var(--primary-color);
        color: white;
    }
`;
document.head.appendChild(style);

// 初始化完成
console.log('个人工作看板已初始化完成！');