# 🚀 Echo – Team Development & Branching Guide

This repository follows a **feature-based team workflow** designed for  
**parallel development, minimal conflicts, and clean integration**.

⚠️ READ THIS COMPLETELY BEFORE STARTING ANY WORK.

---

## 👥 Team Members & Roles

- **Pranshu Sharma** – Maintainer / Lead  
  - Final decision authority  
  - Reviews all Pull Requests  
  - Merges `dev → main`

- **Suryansh** – Developer  
- **Arushi** – Developer  

👑 Only **Pranshu** can merge into `dev` and `main`

---

## 🌿 Branch Structure (VERY IMPORTANT)

We use **3 types of branches**:

---

### 1️⃣ `main` — 🔒 Production / Final Branch
- Always **stable**
- Used for:
  - Final submission
  - Demo-ready code
  - Releases
- ❌ No direct push allowed
- ✅ Only merged from `dev`
- 👤 Only Pranshu merges here

---

### 2️⃣ `dev` — Integration Branch
- Active development branch
- All completed features come here
- Can be slightly unstable (allowed)
- ❌ No direct push allowed
- ✅ Only merged via Pull Requests from `feature/*`

---

### 3️⃣ `feature/*` — Feature Branches (MOST IMPORTANT)

Each feature MUST have its own branch.

Branches are **feature-based**, NOT person-based.

✅ Correct examples:
- feature/chat-ui
- feature/dashboard-layout
- feature/ai-escalation
- feature/knowledge-upload
- feature/voice-agent

❌ Incorrect examples:
- feature/pranshu
- feature/suryansh
- feature/arushi

RULE:
One branch = One feature = One Pull Request

---

## 🔁 Overall Workflow

feature/*  →  dev  →  main

- Features are merged early into `dev`
- Releases are merged late into `main`

---

## 🟢 1. Clone the Repository (First Time Only)

git clone https://github.com/PranshuSharma14/Echo.git  
cd Echo

---

## 🧩 2. Start Any New Work (MANDATORY)

Always start from the latest `dev` branch.

git checkout dev  
git pull origin dev

---

## 🧩 3. Create a Feature Branch

Create a branch ONLY for the feature you are working on.

git checkout -b feature/feature-name

Example:

git checkout -b feature/chat-ui

---

## 🛠 4. Work on Your Feature Branch

- Work ONLY on your feature branch  
- Do NOT touch `dev` or `main`  
- Do NOT mix multiple features in one branch  
- Make small, meaningful commits  

git add .  
git commit -m "feat: add chat message bubble UI"  
git push origin feature/feature-name

---

## 🔁 5. Create Pull Request (MANDATORY)

When your feature is **logically complete**:

1. Go to GitHub → Pull Requests  
2. Click **New Pull Request**  
3. From: feature/feature-name  
4. To: dev  
5. Clearly explain:
   - What you built
   - What files changed  
6. Create PR  

Only **Pranshu** will review and merge PRs.

---

## 🔄 6. If Someone Else Merged to `dev` While You Were Working

This is NORMAL in team work.

Before your PR is merged, update your branch:

git fetch origin  
git merge origin/dev

If conflicts appear:
- Resolve conflicts carefully
- Test the app
- Commit the fix
- Push again

The PR will auto-update.

---

## ❌ Strict Rules (NO EXCEPTIONS)

- ❌ Do NOT push directly to `main`
- ❌ Do NOT push directly to `dev`
- ❌ Do NOT create person-based branches
- ❌ Do NOT mix multiple features in one branch
- ❌ Do NOT merge your own PR
- ❌ Do NOT work without pulling latest `dev`

---

## ✅ Allowed & Expected

- ✅ Feature-based branches only
- ✅ Frequent clean commits
- ✅ Early PRs to `dev`
- ✅ Ask before major changes

---

## 🧠 Workflow Summary (REMEMBER THIS)

main   ← final & stable  
  ↑  
dev    ← integration branch  
  ↑  
feature/* ← one feature only  

---

## 👑 Maintainer Responsibilities (Pranshu)

- Review all Pull Requests
- Ensure feature completeness
- Resolve merge conflicts
- Merge feature/* → dev
- Merge dev → main
- Maintain overall project stability

---

## 🆘 Help & Communication

If you are confused at ANY step:

STOP and ask **Pranshu** before pushing anything.

Better to ask than to break the repository.

---

## ⭐ GOLDEN RULE

Merge features, not people.  
Integrate early, release late.
