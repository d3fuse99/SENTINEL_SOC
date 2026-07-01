# Cyber-Sentinel: Enterprise SOC Dashboard
<img width="2554" height="1320" alt="image" src="https://github.com/user-attachments/assets/218452a7-2340-4659-990b-d5547f8903a2" />

---

## About

**Cyber-Sentinel SOC** is an enterprise-grade Security Operations Center (SOC) dashboard simulation. The application is built using a decoupled client-server architecture. 

The backend (Node.js) monitors real host system metrics and streams them via WebSockets, while the frontend provides a high-performance visual terminal for log parsing and sandbox threat injection.

The entire application is containerized using Docker, ensuring isolated, cross-platform execution on any Linux, macOS, or Windows host.

---

## Features

*   **System Telemetry:** Real-time host CPU and RAM utilization streamed via WebSockets.
*   **Deep Packet Inspection Parser:** Server-side engine designed to parse standard Nginx/Apache access logs and identify attacks (SQLi, XSS, Path Traversal).
*   **Threat Injection Sandbox:** Interactive triggers for security testing (DDoS, SQLi, Bruteforce).
*   **Incident Feed:** Real-time visual queue displaying geolocations, risk scores, and attack signatures.
*   **IPS Mitigation Engine:** Simulates active gateway blocking rules upon anomaly detection.
*   **Localization:** Dual-language engine supporting English and Russian.

---

## How to run

Ensure you have Docker and Docker Compose installed on your host system.

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/cyber-sentinel-soc.git
   ```

2. Open the directory:
   ```bash
   cd cyber-sentinel-soc
   ```

3. Build and launch the container in detached mode:
   ```bash
   docker-compose up --build -d
   ```

4. Open your browser and navigate to:
   ```text
   http://localhost:3000
   ```

To stop the dashboard execution:
```bash
docker-compose down
```

---

## Tech stack

*   **Backend** — Node.js, Express, WS (WebSockets)
*   **Frontend** — HTML5, CSS3 Grid, Vanilla JavaScript, HTML5 Canvas API
*   **DevOps** — Docker, Docker Compose, Linux Alpine

---

## Project structure
<img width="301" height="232" alt="image" src="https://github.com/user-attachments/assets/7d15c3a6-bfe6-4b8f-9b96-cf0c30236a6a" />

