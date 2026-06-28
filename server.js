const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const os = require('os');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.text({ limit: '50mb' }));

const SECURITY_RULES = [
    { type: 'SQLI', regex: /UNION|SELECT|INSERT|UPDATE|DELETE|OR '1'='1'/i },
    { type: 'XSS', regex: /<script|alert\(|onerror|onload/i },
    { type: 'PATH_TRAVERSAL', regex: /\.\.\//i },
    { type: 'SHELLSHOCK', regex: /\(\)\s*\{\s*:\s*;\s*\}\s*/i }
];

function parseLogLine(line) {
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

app.post('/api/analyze', (req, res) => {
    const logData = req.body;
    if (!logData) {
        return res.status(400).json({ error: 'No data provided' });
    }

    const lines = logData.split('\n');
    const parsedLogs = [];
    let threatCount = 0;

    for (const line of lines) {
        if (!line.trim()) continue;
        const parsed = parseLogLine(line);
        if (parsed) {
            if (parsed.threat !== 'NONE') threatCount++;
            parsedLogs.push(parsed);
        }
    }

    res.json({
        totalLines: lines.length,
        parsedCount: parsedLogs.length,
        threatsDetected: threatCount,
        logs: parsedLogs.slice(-200)
    });
});

wss.on('connection', (ws) => {
    const metricsInterval = setInterval(() => {
        const freeMem = os.freemem();
        const totalMem = os.totalmem();
        const memUsage = ((totalMem - freeMem) / totalMem) * 100;
        
        const cpus = os.cpus();
        let totalIdle = 0, totalTick = 0;
        cpus.forEach(core => {
            for (type in core.times) {
                totalTick += core.times[type];
            }
            totalIdle += core.times.idle;
        });
        const cpuUsage = 100 - parseFloat((100 * totalIdle / totalTick).toFixed(1));

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({
                type: 'METRICS',
                cpu: cpuUsage,
                ram: memUsage.toFixed(1)
            }));
        }
    }, 1000);

    ws.on('close', () => {
        clearInterval(metricsInterval);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});