# 🌊 Ocean Cleaner Dashboard

## Overview

**Ocean Cleaner Dashboard** is a **web-based monitoring and control application** developed as a **core subsystem** of a larger **AI-powered autonomous ocean-cleaning robotic boat system**.

This dashboard is designed to provide **real-time observability, supervision, and interaction** with an autonomous robotic cleaning boat. It enables operators, engineers, and researchers to **monitor robot behavior, visualize sensor data, evaluate AI performance, and manually intervene when necessary**.

> ⚠️ This application is **not a standalone product**. It is a **frontend component** that integrates with a **dedicated AI backend server** developed as part of the same global system.

---

## System Context

This repository represents **one component** of a broader end-to-end system composed of:

* 🛥️ **Autonomous cleaning robot boat**
* 🧠 **AI server** (perception, decision-making, performance evaluation)
* 🖥️ **Web dashboard (this repository)** for monitoring and control

The dashboard acts as the **human–machine interface (HMI)** of the system, enabling transparency, control, and validation of autonomous behavior.

---

## Key Features

### 🔍 Real-Time Monitoring

* Live visualization of the robot’s **operational state**
* Continuous monitoring of system metrics and health indicators

### 🎥 Robot Point of View

* Visualization of the robot’s **camera feed or perception outputs**
* Support for AI observation and debugging

### 📊 Data Visualization

* Interactive **charts and graphs** displaying:

  * Sensor data
  * Performance metrics
  * Behavioral indicators
* Designed for analysis and decision support

### 🗺️ Geographical Tracking

* Real-time **map-based tracking** of the robot’s position
* Visualization of movement paths and operational zones

### 🎮 Manual Control Interface

* Human-in-the-loop control capabilities
* Allows direct intervention when required (testing, safety, or fallback scenarios)

### 🔗 AI Server Integration

* Communication with a **separate AI backend**
* Enables:

  * Inspection of AI model outputs
  * Evaluation of AI reliability and performance
  * Validation and debugging of autonomous decisions

---
### Architectural Notes

* The **AI server and dashboard are decoupled**
* This repository contains **only the frontend application**
* Backend logic, AI models, and data processing are handled externally

---

## Technology Stack

* **Frontend Framework:** Modern web framework (Vite-based)
* **Language:** TypeScript
* **UI & Styling:** Tailwind CSS
* **Data Visualization:** Charting libraries
* **Mapping:** Geospatial visualization tools
* **Build Tooling:** Vite
* **Linting & Formatting:** ESLint, PostCSS

---

## Installation & Setup

```bash
git clone https://github.com/Fedi-Nasri/Ocean_Cleaner_Dashboard.git
cd Ocean_Cleaner_Dashboard
npm install
npm run dev
```

> ⚠️ Requires the AI server to be running separately for full functionality.

---

## 👨‍💻 Realized By

**Fedi Nasri**  
Computer Engineering Student  

- 🔗 LinkedIn: [https://www.linkedin.com/in/fedinasri](https://www.linkedin.com/in/fedinasri)
- 📧 Email: [fedinasri.fsb@gmail.com](mailto:fedinasri.fsb@gmail.com)
This dashboard is part of a comprehensive autonomous ocean-cleaning system developed as an end-to-end engineering project.

## 📸 Screenshots
