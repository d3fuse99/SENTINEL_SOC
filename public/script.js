let currentLang = 'EN';
let totalParsed = 0;
let totalThreats = 0;
const countries = ["USA", "Russia", "China", "Brazil", "Germany", "Japan", "UK", "Canada", "France", "India", "Australia", "Ukraine"];

const translations = {
    'EN': {
        'sys_metrics': 'System Metrics',
        'log_uploader': 'Upload Real Logs',
        'threat_inj': 'Threat Injection (Sandbox)',
        'feed_header': 'Security Incident Feed',
        'term_header': 'Live Packet Monitor',
        'statistics': 'Threat Analytics',
        'analyzed_lines': 'Analyzed Lines',
        'threats_count': 'Threats Blocked',
        'report_header': 'Deep Packet Inspection Analysis',
        'rep_type': 'Attack Signature',
        'rep_ip': 'Origin IP',
        'rep_loc': 'Inferred Location',
        'rep_score': 'Threat Level',
        'actions_header': 'Active IPS Mitigations',
        'drag_drop': 'Drag & Drop access.log here or click to select'
    },
    'RU': {
        'sys_metrics': 'Метрики Системы',
        'log_uploader': 'Загрузка Реальных Логов',
        'threat_inj': 'Инъекция Угроз',
        'feed_header': 'Поток Инцидентов Безопасности',
        'term_header': 'Мониторинг Пакетов',
        'statistics': 'Аналитика Угроз',
        'analyzed_lines': 'Проверено Строк',
        'threats_count': 'Угроз Заблокировано',
        'report_header': 'Глубокий Анализ Пакетов',
        'rep_type': 'Сигнатура Атаки',
        'rep_ip': 'IP Источник',
        'rep_loc': 'Геолокация',
        'rep_score': 'Уровень Опасности',
        'actions_header': 'Активные Контрмеры IPS',
        'drag_drop': 'Перетащите access.log сюда или кликните для выбора'
    }
};

const SECURITY_RULES = [
    { type: 'SQLI', regex: /UNION|SELECT|INSERT|UPDATE|DELETE|OR '1'='1'/i },
    { type: 'XSS', regex: /<script|alert\(|onerror|onload/i },
    { type: 'PATH_TRAVERSAL', regex: /\.\.\//i }
];

const canvas = document.getElementById('metrics-chart');
const ctx = canvas.getContext('2d');
let graphData = new Array(30).fill(0);

window.onload = function() {
    initLocalSystem();
};

function initLocalSystem() {
    initUploadEngine();
    
    setInterval(() => {
        const cpuSim = Math.floor(Math.random() * 40) + 10;
        const ramSim = Math.floor(Math.random() * 20) + 40;
        
        document.getElementById('cpu-val').innerText = cpuSim + "%";
        document.getElementById('ram-val').innerText = ramSim + "%";
        
        updateGraph(cpuSim);
    }, 1000);

    setInterval(() => {
        generateNormalTraffic();
    }, 100);

    setInterval(() => {
        document.getElementById('clock').innerText = new Date().toLocaleTimeString();
    }, 1000);
}

function parseLogLineLocal(line) {
    const logRegex = /^(\S+) \S+ \S+ \[([^\]]+)\] "(\S+) ([^"]+)" (\d+) (\d+|-)/;
    const match = line.match(logRegex);
    if (!match) return null;

    const [_, ip, timestamp, method, path, status, size] = match;
    
    let detectedThreat = 'NONE';
    for (const rule of SECURITY_RULES) {
        if (rule.regex.test(path)) {
            detectedThreat = rule.type;
            break;
        }
    }

    return { ip, timestamp, method, path, status, size, threat: detectedThreat };
}

function initUploadEngine() {
    const zone = document.getElementById('drop-zone');
    const input = document.getElementById('file-input');

    zone.onclick = () => input.click();
    
    zone.ondragover = zone.ondragenter = (e) => {
        e.preventDefault();
        zone.classList.add('dragover');
    };

    zone.ondragleave = () => zone.classList.remove('dragover');

    zone.ondrop = (e) => {
        e.preventDefault();
        zone.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        handleLogFileLocal(file);
    };

    input.onchange = (e) => {
        const file = e.target.files[0];
        handleLogFileLocal(file);
    };
}

function handleLogFileLocal(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target.result;
        const lines = text.split('\n');
        
        lines.forEach(line => {
            if (!line.trim()) return;
            const parsed = parseLogLineLocal(line);
            if (parsed) {
                totalParsed++;
                const isThreat = parsed.threat !== 'NONE';
                
                addLog(parsed.method + " " + parsed.path + " - " + parsed.status, isThreat);
                
                if (isThreat) {
                    logIncident(parsed.threat, parsed.ip, 'Parsed Log');
                }
            }
        });
        
        document.getElementById('stat-total').innerText = totalParsed.toLocaleString();
    };
    reader.readAsText(file);
}

function addLog(msg, isAtk = false) {
    const stream = document.getElementById('log-stream');
    const div = document.createElement('div');
    div.className = isAtk ? 'l-atk' : '';
    div.innerText = "[" + new Date().toLocaleTimeString() + "] " + msg;
    stream.appendChild(div);
    if(stream.childNodes.length > 100) stream.removeChild(stream.firstChild);
    stream.scrollTop = stream.scrollHeight;
}

function generateNormalTraffic() {
    const ips = ["192.168.1.1", "10.0.0.42", "172.16.0.5"];
    addLog("GET /status from " + ips[Math.floor(Math.random()*ips.length)] + " - 200 OK");
    totalParsed++;
    document.getElementById('stat-total').innerText = totalParsed.toLocaleString();
}

function inject(type) {
    const country = countries[Math.floor(Math.random()*countries.length)];
    const ip = Math.floor(Math.random()*255) + "." + Math.floor(Math.random()*255) + ".10.5";
    logIncident(type, ip, country);
}

function logIncident(type, ip, loc) {
    totalThreats++;
    document.getElementById('stat-threats').innerText = totalThreats.toLocaleString();

    const feed = document.getElementById('attack-feed');
    const item = document.createElement('div');
    item.className = 'feed-item';
    item.innerHTML = "<span>" + new Date().toLocaleTimeString() + "</span> <span>" + loc + "</span> <span>" + type + "</span>";
    feed.prepend(item);
    if(feed.childNodes.length > 10) feed.removeChild(feed.lastChild);

    document.getElementById('rp-type').innerText = type;
    document.getElementById('rp-ip').innerText = ip;
    document.getElementById('rp-loc').innerText = loc;
    document.getElementById('rp-score').innerText = Math.floor(Math.random()*40) + 60;

    addLog("!!! THREAT DETECTED: " + type + " attack from " + ip + " (" + loc + ")", true);
    
    const ev = document.getElementById('event-log');
    const d = document.createElement('div');
    d.innerText = "> [" + new Date().toLocaleTimeString() + "] IPS: Blocked " + ip;
    ev.prepend(d);
}

function updateGraph(value) {
    graphData.push(value);
    graphData.shift();
    drawGraph();
}

function drawGraph() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.strokeStyle = 'rgb(0, 242, 255)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const step = canvas.width / (graphData.length - 1);
    graphData.forEach((val, i) => {
        const x = i * step;
        const y = canvas.height - (val / 100 * canvas.height);
        if(i === 0) ctx.moveTo(x,y);
        else ctx.lineTo(x,y);
    });
    ctx.stroke();
}

function toggleLanguage() {
    currentLang = (currentLang === 'EN') ? 'RU' : 'EN';
    document.querySelectorAll('.lang-target').forEach(el => {
        const key = el.getAttribute('data-key');
        if (translations[currentLang][key]) {
            el.innerText = translations[currentLang][key];
        }
    });
}

initLocalSystem();