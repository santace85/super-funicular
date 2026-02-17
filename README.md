# AI Career Toolkit

A modern, AI-powered career platform designed to help job seekers craft stronger applications with precision and confidence.

AI Career Toolkit provides intelligent tools to:

- Generate tailored cover letters
- Optimize resumes for impact and ATS systems
- Align resumes to specific job descriptions
- Practice structured interview responses

Built with a scalable full-stack architecture and production-grade API patterns.

---

## 🚀 Live Demo

Coming soon

---

## ✨ Core Features

### 📝 Tailored Cover Letter Generator

Generate professional, polished cover letters customized to your resume and job description — formatted and ready to download.

### 📄 Resume Optimizer

Transform your resume into a results-driven, modern document with improved clarity, impact, and recruiter appeal.

### 🎯 Resume Tailoring Engine

Align your resume directly to a specific job description to increase relevance and keyword matching.

### 🤖 ATS Optimization Mode

Optional AI-scan optimization to improve keyword density and compatibility with Applicant Tracking Systems.

### 🎤 Interview Answer Helper

Generate strong interview responses using structured frameworks such as STAR.

---

## 🏗 Architecture Overview

Frontend and backend are fully decoupled.

### Frontend

- React + TypeScript
- React Router for SPA navigation
- Tailwind CSS for modern UI
- Docx export for downloadable cover letters
- Feature-based routing with layout architecture

### Backend

- .NET 8 Web API
- Strongly typed request/response models
- Gemini AI integration (via HTTP client)
- Per-user rate limiting
- Retry policies with exponential backoff
- Cancellation token support
- Usage metering
- Environment-based configuration

---

## 🔐 Production-Ready Patterns

This project implements:

- Dependency Injection with interface abstraction
- Service factory pattern for provider selection
- Per-user rate limiting
- Token usage estimation
- Timeout configuration
- Retry handling for 429 / 5xx responses
- Clean separation of prompt logic and controller logic

---

## 💰 Cost & Abuse Protection

To prevent API abuse and manage AI costs:

- Per-user rate limiting
- Request cancellation support
- Retry policy with exponential backoff
- Usage tracking
- Configurable token limits

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Tailwind CSS
- React Router
- Vite

### Backend

- .NET 8
- ASP.NET Core Web API
- Polly (retry policies)
- Google Gemini API
- SQLite (extensible to other DBs)

---

## 📦 Project Structure

```
/frontend
/backend
  /Super-Funicular.Api
```

Frontend and backend can run independently in development.

---

## ⚙️ Running Locally

### Development Mode

From root:

```
npm run dev
```

This runs:

- .NET backend
- Vite frontend

### Production Simulation

Build frontend:

```
cd frontend
npm run build
```

Run backend in Release:

```
dotnet run -c Release
```

---

## 🧠 Design Philosophy

AI Career Toolkit is built with:

- Strong typing over magic strings
- Explicit endpoints over generic AI gateways
- Feature-based routing
- Clear domain boundaries
- Scalable service abstraction

The goal is not just AI integration — but structured, maintainable AI-powered features.

---

## 🔮 Roadmap

- User authentication
- Tiered usage plans
- Persistent usage tracking
- Resume diff comparison
- Model fallback support
- Docker deployment

---

## 📄 License

MIT
