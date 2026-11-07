# The Small Web — Full Stack Monorepo

A simulated web browser platform and local publishing network built for "The Small Web". This application architecture handles sandboxed browser frame interactions, global indexing pipelines, state-synchronized navigation history, and full-text keyword searches.

## 🏗️ Architecture Workspace

This project is orchestrated as a unified **pnpm Monorepo workspace**:

- `apps/fe` — A modern Next.js user interface simulating the browser frame and "chrome" controls.
- `apps/backend` — A robust NestJS engine driving data ingestion, visit history tracking, and search indexing.

---

## 🚀 Getting Started (Multi-Device Setup)

Follow these steps to spin up the local development environment on any machine.

### 1. Prerequisite

Ensure you have **pnpm** installed globally on your machine:

```bash
npm install -g pnpm
```

### 2. Install Workspace Dependencies

Run the installer directly from the project root. This restores all modules across both applications simultaneously:

```bash
pnpm install
```

### 3. Setup Environment Variables

Before running the system, make sure your MongoDB instance is running locally or copy your URI strings into the environment configurations inside your sub-apps:

- Frontend: `apps/fe/.env.local`
- Backend: `apps/backend/.env`

### 4. Run the Deterministic Seed

Populate your local MongoDB collection with the crawl simulation datasets:

```bash
pnpm seed
```

### 5. Launch the Monorepo (Simultaneous Boot)

To run both the Next.js frontend and NestJS backend together under a single interactive terminal log session:

```bash
pnpm dev
```

---

## 🛠️ CLI Reference

All developmental pipelines should be managed right from the root workspace using the targeted alias workflows:

| Intended Action       | Root Command Location | Execution Script    | Target Scope                             |
| :-------------------- | :-------------------- | :------------------ | :--------------------------------------- |
| **Run Core Engines**  | Project Root `/`      | `pnpm dev`          | Boots up frontend + backend concurrently |
| **Ingest Seed Data**  | Project Root `/`      | `pnpm seed`         | Triggers deterministic MongoDB seeding   |
| **Isolated Frontend** | Project Root `/`      | `pnpm dev:frontend` | Runs Next.js only                        |
| **Isolated Backend**  | Project Root `/`      | `pnpm dev:backend`  | Runs NestJS only                         |
