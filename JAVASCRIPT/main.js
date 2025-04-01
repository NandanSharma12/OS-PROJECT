let systemData = {
    cpu: {
        percent: 0,
        cores: 0,
        threads: 0,
        frequency: 0,
        history: []
    },
    memory: {
        total: 0,
        used: 0,
        free: 0,
        percent: 0,
        history: []
    },
    processes: {
        total: 0,
        running: 0,
        sleeping: 0,
        other: 0,
        list: []
    },
    alerts: []
};
const cpuPercentEl = document.getElementById('cpu-percent');
const cpuCoresEl = document.getElementById('cpu-cores');
const cpuThreadsEl = document.getElementById('cpu-threads');
const cpuFreqEl = document.getElementById('cpu-freq');
const memPercentEl = document.getElementById('mem-percent');
const memTotalEl = document.getElementById('mem-total');
const memUsedEl = document.getElementById('mem-used');
const memFreeEl = document.getElementById('mem-free');
const processCountEl = document.getElementById('process-count');
const runningCountEl = document.getElementById('running-count');
const sleepingCountEl = document.getElementById('sleeping-count');
const otherCountEl = document.getElementById('other-count');
const processTableBody = document.getElementById('process-table-body');
const alertsContainer = document.getElementById('alerts-container');
const hostnameEl = document.getElementById('hostname');
const osInfoEl = document.getElementById('os-info');
const lastUpdatedEl = document.getElementById('last-updated');
const refreshBtn = document.getElementById('refresh-btn');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const processSearch = document.getElementById('process-search');
const searchBtn = document.getElementById('search-btn');
const killBtn = document.getElementById('kill-btn');
const clearAlertsBtn = document.getElementById('clear-alerts');
const priorityModal = new bootstrap.Modal(document.getElementById('priorityModal'));
const priorityProcessName = document.getElementById('priority-process-name');
const priorityProcessPid = document.getElementById('priority-process-pid');
const applyPriorityBtn = document.getElementById('apply-priority');
const cpuChart = new Chart(
    document.getElementById('cpu-chart'),
    {
        type: 'line',
        data: {
            labels: Array(60).fill(''),
            datasets: [{
                label: 'CPU Usage',
                data: [],
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.1)',
                borderWidth: 2,
                tension: 0.1,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    display: false
                }
            }
        }
    }
);
const memChart = new Chart(
    document.getElementById('mem-chart'),
    {
        type: 'doughnut',
        data: {
            labels: ['Used', 'Free', 'Cached'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    '#e74c3c',
                    '#2ecc71',
                    '#3498db'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    }
);
const processChart = new Chart(
    document.getElementById('process-chart'),
    {
        type: 'doughnut',
        data: {
            labels: ['Running', 'Sleeping', 'Other'],
            datasets: [{
                data: [0, 0, 0],
                backgroundColor: [
                    '#2ecc71',
                    '#3498db',
                    '#f39c12'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            },
            cutout: '70%'
        }
    }
);
function initDashboard() {
    hostnameEl.textContent = window.location.hostname || 'localhost';
    osInfoEl.textContent = `${navigator.platform} (${navigator.userAgent.split(') ')[0].split('(')[1]})`;
    fetchSystemData();
        setupEventListeners();
    setInterval(fetchSystemData, 2000);
}
function fetchSystemData() {
    const now = new Date();
    lastUpdatedEl.textContent = now.toLocaleTimeString();    
    systemData.cpu.cores = navigator.hardwareConcurrency / 2 || 4;
    systemData.cpu.threads = navigator.hardwareConcurrency || 8;
    systemData.cpu.frequency = (2 + Math.random()).toFixed(2);
    systemData.cpu.percent = Math.min(100, Math.max(0, systemData.cpu.percent + (Math.random() * 10 - 5)));
    systemData.cpu.history.push(systemData.cpu.percent);
    if (systemData.cpu.history.length > 60) systemData.cpu.history.shift();
    
    systemData.memory.total = 16;
    systemData.memory.used = Math.min(systemData.memory.total, Math.max(0, systemData.memory.used + (Math.random() * 2 - 1)));
    systemData.memory.free = systemData.memory.total - systemData.memory.used;
    systemData.memory.percent = (systemData.memory.used / systemData.memory.total * 100).toFixed(1);
    systemData.memory.history.push(parseFloat(systemData.memory.percent));
    if (systemData.memory.history.length > 60) systemData.memory.history.shift();
    const processStates = ['Running', 'Sleeping', 'Zombie', 'Stopped'];
    systemData.processes.list = Array.from({length: 50}, (_, i) => {
        const state = processStates[Math.floor(Math.random() * processStates.length)];
        return {
            pid: 1000 + i,
            name: ['chrome', 'node', 'python', 'mysqld', 'bash', 'systemd', 'docker', 'vscode'][Math.floor(Math.random() * 8)],
            user: ['root', 'user', 'system', 'mysql', 'docker'][Math.floor(Math.random() * 5)],
            cpu: (Math.random() * 30).toFixed(1),
            memory: (Math.random() * 5).toFixed(1),
            status: state.charAt(0)
        };
    });
    systemData.processes.running = systemData.processes.list.filter(p => p.status === 'R').length;
    systemData.processes.sleeping = systemData.processes.list.filter(p => p.status === 'S').length;
    systemData.processes.other = systemData.processes.list.length - systemData.processes.running - systemData.processes.sleeping;
    systemData.processes.total = systemData.processes.list.length;
    checkForAlerts();UI
    updateUI();
}
