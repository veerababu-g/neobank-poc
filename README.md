
Project Overview

This Proof-of-Concept simulates a simplified banking system with:

✔ Two-tier architecture

System 1 – Gateway
Validates requests + card range routing

System 2 – Core Banking
Validates card, PIN, balance, processes transactions

✔ Role-based Dashboard (React + Vite)

Customer:

View balance

View personal transaction history

Perform top-up transactions

Super Admin:

Monitor ALL system transactions

✔ Security

SHA-256 PIN hashing

No plain-text PIN storage

No plain-text PIN logging

In-memory DB using H2

✔ Modern stack
Layer	Tech
Gateway	Spring Boot 3 (Java 17)
Core Banking	Spring Boot 3 + H2
UI	React + Vite + TypeScript
Styling	Custom Glassmorphism CSS
Build Tools	Maven + npm



npm install
npm run dev

Demo Login
username :admin 
password : admin 
