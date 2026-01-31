# Contributing to iocraft

Thank you for considering contributing to **iocraft**! We strive to maintain a high-quality, type-safe ecosystem for Vue developers, and your help makes that possible.

---

## Project Structure

This repository is a **pnpm monorepo**. Understanding the directory layout is key to making effective contributions:

* **`packages/iocraft`** — The core library. All production code and logic live here.
* **`packages/playground`** — A Vue 3 development environment for testing and demoing changes.

---

## Getting Started

### 1. Fork and Clone

Fork the repository and clone it to your local machine.

### 2. Install Dependencies

We use **pnpm**. From the root of the repository, run:

```bash
pnpm i:all
```

### 3. Development

To see your changes in real time, run the playground:

```bash
pnpm playground:dev
```

---

## Commit Message Guidelines (Strict)

We use **Conventional Commits** to automate versioning and changelog generation. Commits that do not follow this format may be requested to be renamed.

### Format

```
<type>: <description>
```

### Types

* **feat** — A new feature (triggers a **minor** version bump)
* **fix** — A bug fix (triggers a **patch** version bump)
* **perf** — Performance improvements (triggers a **patch** version bump)
* **refactor** — Code changes that neither fix a bug nor add a feature
* **docs** — Documentation-only changes
* **chore** — Maintenance tasks (dependencies, CI, tooling, etc.)

### Breaking Changes

For changes that break backward compatibility, append an exclamation mark (`!`) after the type:

```
feat!: change initialization API
```

---

## Pull Request Process

1. **Branching**
   Create a branch from `main` with a descriptive name (e.g., `feat/inject-hook`).

2. **Quality Check**
   Run linting and type-checking before submitting:

   ```bash
   pnpm typecheck
   ```

3. **Submit**
   Open a pull request against the `main` branch. Provide a clear description of the problem you are solving and the approach taken.

4. **Review & Release**
   Once approved and merged, our **Release Please** bot will automatically handle versioning and include your changes in the next official release.

---

## Code of Conduct

We are committed to providing a welcoming and inspiring community. Please be respectful, inclusive, and constructive in all communications and code reviews.

---


> If you have questions or concerns about the project's direction, feel free to open a **Discussion** or an **Issue** for architectural feedback before starting large features.
