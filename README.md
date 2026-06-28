# Cyber-Sentinel: SOC Dashboard

<img width="2554" height="1320" alt="image" src="https://github.com/user-attachments/assets/749180f0-d73f-415f-87d0-826ae7270235" />


## About

**Cyber-Sentinel SOC** is a high-performance, real-time Security Operations Center (SOC) dashboard simulation. This specialized client-side build runs entirely in your web browser with zero external dependencies, making it perfect for lightweight deployments, static hosting, and instant demonstrations.

This dashboard emulates real-time system metrics, streams simulated network packets, and analyzes incoming malicious traffic patterns entirely on the client side.

---

## Features

*   **Real-time Metrics:** Simulated network load and system performance chart (HTML5 Canvas).
*   **Packet Analyzer:** Deep packet analysis with dynamic logs classification (Normal vs Threat).
*   **Threat Injection Sandbox:** Interactive panel to manually trigger Bruteforce, SQL Injection, and DDoS attacks.
*   **Incident Feed:** Real-time log tracking with threat signature recognition, geolocations, and mitigation scores.
*   **Zero-Server Log Uploading:** Local parser engine that allows you to drag and drop real access logs (Nginx/Apache format) and analyze them directly in your browser.
*   **IPS Mitigation Log:** Tracks automatic block actions and network gateway mitigations.
*   **Localization:** Built-in multi-language translation controller (English / Russian).

---

## How to run

1. Clone the repository or download the source files.
2. Ensure the files are structured in the same folder as follows:
   * index.html
   * style.css
   * script.js
3. Open `index.html` by double-clicking it, or run it through the VS Code Live Server extension.

No installation of Node.js, Docker, or npm dependencies is required.

---

## Tech stack

*   **HTML5** — Semantic markup and layout structure
*   **CSS3** — Custom Grid layouts, neon-cyberpunk UI skins, and layout responsiveness
*   **Vanilla JavaScript** — Real-time event orchestration, parsing algorithms, and language translation
*   **Canvas API** — Real-time performance chart rendering
*   **File API** — Client-side asynchronous file uploading and processing

---

## Project structure

<img width="301" height="232" alt="image" src="https://github.com/user-attachments/assets/75c48d12-3a7f-4465-8292-f7379e005af2" />
