# 🚀 Echo – Team Development Guide (Phase-based Workflow)

This repository follows a **phase-based team workflow** where each team member
works on a **dedicated branch for their assigned part**, and integration is done
via Pull Requests.

⚠️ READ THIS COMPLETELY BEFORE STARTING ANY WORK.

---

## 📋 Phase 1 Progress (Pranshu Sharma) – ✅ COMPLETED

**Status:** Phase 1 work is **100% complete** and pushed to `feature/pranshu` branch

### ✅ How Other Team Members Can Get This Code:

```bash
# Switch to Pranshu's completed branch
git checkout feature/pranshu
git pull origin feature/pranshu

# Install dependencies
pnpm install

# Run the development server
pnpm turbo dev
```

This will start all apps and services together.

### ✅ Completed Features:

#### Backend Infrastructure:
- ✅ Convex setup with authentication config
- ✅ Database schema for users, contactSessions, and conversations
- ✅ Contact session creation and validation mutations
- ✅ Organization validation with Clerk integration

#### UI Components Library:
- ✅ Form component with full react-hook-form integration
- ✅ Sidebar component with responsive design and collapse functionality
- ✅ Button component with multiple variants (default, outline, ghost, destructive, link)
- ✅ Shape UI components (input, checkbox, dialog, dropdown-menu, etc.)

#### Widget App:
- ✅ Auth screen with email/name form submission
- ✅ Loading screen with organization and session validation
- ✅ Chat screen with conversation display
- ✅ Selection screen layout
- ✅ Widget atoms (state management) with Jotai
- ✅ Widget view with screen routing
- ✅ Responsive widget header component

#### Web Dashboard:
- ✅ Dashboard sidebar with navigation
- ✅ Dashboard layout with Clerk auth guards
- ✅ Organization guard middleware
- ✅ Multiple sections (Conversations, Knowledge Base, Customization, Integrations, Billing)

### 🔧 Key Fixes Applied:
- ✅ Fixed missing form component creation
- ✅ Fixed sidebar component implementation
- ✅ Fixed button component Slot imports (@radix-ui/react-slot)
- ✅ Fixed invalid button variants
- ✅ Fixed API path references (bracket notation for nested paths)
- ✅ Fixed TypeScript type errors
- ✅ Installed all missing dependencies (zod, react-hook-form, @hookform/resolvers, jotai, lucide-react)

---

## 🚀 Quick Start (For All Developers)

### Prerequisites:
- Node.js 18+ 
- pnpm (package manager)
- Git
- Clerk account (for authentication)
- Convex account (for backend)

### 1️⃣ Clone & Setup

```bash
# Clone the repository
git clone https://github.com/PranshuSharma14/Echo.git
cd Echo

# Install dependencies
pnpm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local with your Clerk and Convex credentials
```

### 2️⃣ Environment Variables Setup

**Required .env files at 3 locations:**

#### `packages/backend/.env.local`
```env
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_JWT_ISSUER_DOMAIN=your_clerk_issuer_domain
```

#### `apps/web/.env.local`
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

#### `apps/widget/.env.local`
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
NEXT_PUBLIC_CONVEX_URL=your_convex_url
```

⚠️ **Note:** `.env.local` files are in `.gitignore` - Each developer creates their own copy

### 3️⃣ Start All Services (Recommended)

**Start everything at once with Turborepo:**

```bash
pnpm turbo dev
```

This will start:
- ✅ Convex backend (packages/backend)
- ✅ Web dashboard (http://localhost:3000)
- ✅ Widget app (http://localhost:3001)
- ✅ All necessary services

**OR start services individually:**

**OR start services individually:**

```bash
# Terminal 1 - Convex Backend
cd packages/backend && pnpm run dev

# Terminal 2 - Web Dashboard  
pnpm -F web run dev
# Opens at http://localhost:3000

# Terminal 3 - Widget App
pnpm -F widget run dev
# Opens at http://localhost:3001
```

### 4️⃣ Testing the Widget

Access the widget with an organization ID:
```
http://localhost:3001?organizationId=your-org-id
```

The widget will:
1. Validate the organization
2. Create a contact session
3. Show the auth form
4. Navigate to chat screen

---

## 📂 Project Structure

```
Echo/
├── apps/
│   ├── web/                 # Dashboard app (Next.js)
│   │   ├── modules/dashboard/
│   │   ├── app/(auth)/
│   │   └── app/(dashboard)/
│   └── widget/              # Widget app (Next.js)
│       ├── modules/widget/
│       ├── atoms/          # Jotai state management
│       └── app/
├── packages/
│   ├── backend/            # Convex backend
│   │   └── convex/
│   ├── ui/                 # Shared UI components library
│   │   └── src/components/
│   ├── typescript-config/
│   └── eslint-config/
└── README.md
```

---

## 👥 Team Members & Work Distribution

Total tutorial duration: **22 hours**

Work is divided equally:

- **Pranshu Sharma** – Phase 1 (Initial 7 hours) ✅ IN PROGRESS
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

## 🧪 Building the Project

Build all packages:
```bash
pnpm run build
```

Build specific app:
```bash
pnpm -F widget run build    # Build widget
pnpm -F web run build       # Build web
```

---

## 📚 Useful Commands

```bash
# List all available scripts
pnpm --help

# Run command in specific workspace
pnpm -F package-name run script-name

# Clean all dependencies
pnpm clean

# Update all dependencies
pnpm update

# Run linting
pnpm run lint
```

---

## 🐛 Common Issues & Solutions

### Issue: "organizationId is required"
**Solution:** Pass organization ID in URL query parameter:
```
http://localhost:3001?organizationId=your-org-id
```

### Issue: Convex API errors
**Solution:** Ensure Convex dev server is running:
```bash
cd packages/backend && pnpm run dev
```

### Issue: Module not found errors
**Solution:** Reinstall dependencies:
```bash
pnpm install
pnpm run build
```

### Issue: Port already in use
**Solution:** Kill the process or use different ports:
```bash
# Web app on different port
pnpm -F web run dev -- -p 3002

# Widget on different port
pnpm -F widget run dev -- -p 3003
```

---

## 📖 Documentation

- [Convex Documentation](https://docs.convex.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [React Hook Form](https://react-hook-form.com)
- [Jotai (State Management)](https://jotai.org)
- [Clerk Authentication](https://clerk.com/docs)

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