# 🚀 Echo – Team Development Guide (Phase-based Workflow)

This repository follows a **phase-based team workflow** where each team member
works on a **dedicated branch for their assigned part**, and integration is done
via Pull Requests.

⚠️ READ THIS COMPLETELY BEFORE STARTING ANY WORK.

---

## 👥 Team Members & Work Distribution

Total tutorial duration: **22 hours**

Work is divided equally:

- **Pranshu Sharma** – Phase 1 (Initial 7 hours) ✅ COMPLETED  
- **Arushi** – Phase 2 (Next ~7 hours)  
- **Suryansh** – Phase 3 (Remaining ~7 hours)

Each member is responsible for **completing their entire assigned part**
before pushing to GitHub.

---

## 🌿 Branch Structure (CURRENT PHASE)

We use **person-based branches for this phase only**.

### Branches in use:

- `main` → Final & stable (protected)
- `dev` → Integration branch
- `feature/pranshu` → Pranshu’s complete work (Phase 1)
- `feature/suryansh` → Suryansh’s complete work (Phase 2)
- `feature/arushi` → Arushi’s complete work (Phase 3)

⚠️ Feature-wise branching is **NOT required in this phase**.

---

## 🔒 Branch Rules

### `main`
- Final submission branch
- ❌ No direct push
- ✅ Only merged from `dev`
- 👑 Only Pranshu merges here

### `dev`
- Integration branch
- ❌ No direct push
- ✅ Receives PRs from `feature/*`

### `feature/*`
- Each member works **only on their own branch**
- Entire assigned part is pushed together

---

## 🔁 High-Level Workflow


---

## 🟢 1. Clone the Repository (First Time Only)

git clone https://github.com/PranshuSharma14/Echo.git  
cd Echo

---

## 🧩 2. Start Your Assigned Work

Always create your branch from the latest `dev`.

git checkout dev  
git pull origin dev  

### Create your personal branch

For Pranshu:
git checkout -b feature/pranshu

For Suryansh:
git checkout -b feature/suryansh

For Arushi:
git checkout -b feature/arushi

---

## 🛠 3. Work on Your Branch

- Work **only** on your assigned branch  
- Complete your **entire part (≈7 hours content)**  
- You may create multiple commits  
- Do NOT merge partial or unfinished work  

Example:

git add .  
git commit -m "phase: complete initial setup and core architecture"  
git push origin feature/your-name

---

## 🔁 4. Create Pull Request (MANDATORY)

After completing **your entire assigned part**:

1. Go to GitHub → Pull Requests  
2. Click **New Pull Request**  
3. From: `feature/your-name`  
4. To: `dev`  
5. Clearly mention:
   - Which phase you completed
   - What major changes were made
6. Create PR

👑 Only **Pranshu** will review and merge PRs.

---

## 🔄 5. If `dev` Gets Updated While You Are Working

Before final push or PR:

git fetch origin  
git merge origin/dev  

- Resolve conflicts if any
- Test the project
- Commit the fix
- Push again

---

## ❌ Strict Rules (NO EXCEPTIONS)

- ❌ Do NOT push directly to `main`
- ❌ Do NOT push directly to `dev`
- ❌ Do NOT work on someone else’s branch
- ❌ Do NOT merge your own PR
- ❌ Do NOT submit half-complete work

---

## ✅ What Is Expected

- ✅ One branch per person (for this phase)
- ✅ Entire assigned part completed before PR
- ✅ Clear commit messages
- ✅ Communication before major changes

---

## 👑 Maintainer Responsibilities (Pranshu)

- Review phase-wise Pull Requests
- Resolve merge conflicts
- Merge `feature/* → dev`
- Merge `dev → main`
- Ensure project stability

---

## 🆘 Help & Communication

If you are confused at ANY step:

STOP and ask **Pranshu** before pushing anything.

Better to ask than to break the project.

---

## ⭐ IMPORTANT NOTE

This **person-based branching** is used **only for the current phase**  
due to large, well-separated work chunks.

Future development may switch to **feature-based branching**.

---

## 🏁 GOLDEN RULE

Complete your assigned part fully.  
Then push once.  
Then create PR.