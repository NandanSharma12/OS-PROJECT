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
