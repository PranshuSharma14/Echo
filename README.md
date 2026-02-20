# 🚀 Echo – Team Development Guide

This repository follows a **branch-based team workflow**.  
Please read this README carefully before starting work.

---

## 👥 Team Members

- **Pranshu Sharma** – Maintainer / Lead (Final merge authority)
- **Suryansh** – Team Member
- **Arushi** – Team Member

---

## 🌿 Branch Structure (VERY IMPORTANT)

We use **3 types of branches**:

### 1️⃣ `main` (🔒 Protected)
- Final & stable code
- ❌ No direct push allowed
- ✅ Only merged from `dev`
- 👤 **Only Pranshu merges to `main`**

---

### 2️⃣ `dev` (Integration Branch)
- Combined work of all team members
- ❌ No direct push allowed
- ✅ All feature branches are merged here via Pull Request

---

### 3️⃣ `feature/*` (Individual Work Branches)

Each team member works on their **own feature branch**:

- `feature/pranshu` → Pranshu
- `feature/suryansh` → Suryansh
- `feature/arushi` → Arushi

✅ Work ONLY on your assigned feature branch  
❌ Never work directly on `main` or `dev`

---

## 🔁 Workflow (Step-by-Step)

### 🟢 1. Clone the repository (First time only)

```bash
git clone https://github.com/PranshuSharma14/Echo.git
cd Echo
---

## 🧩 3. Create Your Feature Branch (Only Once)

⚠️ Make sure you are on `dev` branch before creating your feature branch.

```bash
git checkout dev
git pull origin dev
```

### For Suryansh
```bash
git checkout -b feature/suryansh
```

### For Arushi
```bash
git checkout -b feature/arushi
```

### For Pranshu
```bash
git checkout -b feature/pranshu
```

---

## 🛠 4. Work on Your Feature Branch

- Write code **only** in your own feature branch
- Do NOT touch `main` or `dev`
- Make small, meaningful commits

```bash
git add .
git commit -m "feat: describe your change"
git push origin feature/your-name
```

---

## 🔁 5. Create Pull Request (MANDATORY)

After completing your task:

1. Open the GitHub repository
2. Go to **Pull Requests**
3. Click **New Pull Request**
4. **From:** `feature/your-name`
5. **To:** `dev`
6. Write a short description of your work
7. Click **Create Pull Request**

👤 Only **Pranshu** will review and merge Pull Requests.

---

## 🔄 6. Sync Your Branch if `dev` Gets Updated

If someone else's code is merged into `dev` while you are working:

```bash
git checkout dev
git pull origin dev
git checkout feature/your-name
git merge dev
```

- Resolve merge conflicts if any
- Then continue working normally

---

## ❌ Strict Rules (NO EXCEPTIONS)

- ❌ Do NOT push directly to `main`
- ❌ Do NOT push directly to `dev`
- ❌ Do NOT work on someone else's branch
- ❌ Do NOT merge your own Pull Request
- ❌ Do NOT start work without pulling latest `dev`

---

## ✅ Allowed & Expected

- ✅ Work only on your feature branch
- ✅ Push regularly with clean commits
- ✅ Create Pull Requests to `dev`
- ✅ Ask before making major changes

---

## 🧠 Workflow Summary

```text
main   ← final & protected
  ↑
dev    ← integration branch
  ↑
feature/* ← individual work
```

---

## 👑 Maintainer Responsibilities (Pranshu)

- Review all Pull Requests
- Resolve merge conflicts
- Merge `feature/* → dev`
- Merge `dev → main`
- Maintain project stability

---

## 🆘 Help & Communication

If you are confused at **ANY** step:

👉 STOP and ask **Pranshu** before pushing anything.

Better to ask than to break the project 🙂

---