# Echo — AI-Powered Customer Support Platform

## What is Echo?

Echo is a **full-stack AI-powered customer support platform** that businesses can embed on their websites. Think of it like **Intercom or Zendesk**, but with built-in AI that automatically answers customer questions using your uploaded knowledge base documents, and can escalate to a human operator when needed.

In simple terms: A customer visits your website → clicks a chat bubble → gets instant AI-powered help → if the AI can't help, a human operator takes over.

---

## High-Level Architecture (How Everything Fits Together)

```
┌──────────────────────────────────────────────────────────────────────┐
│                      CUSTOMER'S WEBSITE                              │
│  (Any website adds a single <script> tag to get Echo support chat)   │
└──────────────────────┬───────────────────────────────────────────────┘
                       │ loads
                       ▼
              ┌─────────────────┐
              │   EMBED APP     │  ← A tiny JS file that creates a
              │  (widget.js)    │     floating chat button on the site
              └────────┬────────┘
                       │ opens an iframe containing
                       ▼
              ┌─────────────────┐
              │   WIDGET APP    │  ← The actual chat/voice interface
              │   (Next.js)     │     customers interact with
              └────────┬────────┘
                       │ communicates with
                       ▼
              ┌─────────────────┐
              │ CONVEX BACKEND  │  ← Serverless backend: database, AI agent,
              │ (API + Database)│     file storage, authentication
              └────────┬────────┘
                       │ managed by operators via
                       ▼
              ┌─────────────────┐
              │  WEB DASHBOARD  │  ← Admin panel where support operators
              │   (Next.js)     │     manage conversations, upload docs, etc.
              └─────────────────┘
```

The project is a **monorepo** (multiple apps in one repository) managed by:
- **pnpm** — package manager
- **Turborepo** — runs all apps simultaneously with `pnpm turbo dev`

---

## The 4 Applications Explained

### 1. Embed App (`apps/embed/`) — The Chat Bubble Script

**Purpose:** A tiny JavaScript file (~5KB) that website owners add to their site with a single `<script>` tag.

**What it does:**
- Creates a **floating blue chat bubble** button in the bottom-right corner of any website
- When clicked, it opens/closes a **400×600px popup** containing the Widget app (loaded in an iframe)
- Handles smooth open/close animations
- Communicates with the Widget via browser's PostMessage API

**How a customer integrates it:**
```html
<!-- Just add this one line to any website -->
<script src="https://echo-widget.vercel.app/widget.js"
        data-organization-id="org_xxxxx"></script>
```

**Programmatic API** (for developers):
```javascript
EchoWidget.show();     // Open the widget
EchoWidget.hide();     // Close the widget
EchoWidget.destroy();  // Remove completely
```

**Tech:** Built with Vite, outputs a single IIFE JavaScript file.

---

### 2. Widget App (`apps/widget/`) — The Customer-Facing Chat Interface

**Purpose:** The full chat interface that customers see and interact with. Loaded inside the iframe created by the Embed script.

**Screens (8 total):**

| Screen | What it does |
|--------|-------------|
| **Loading** | Validates the organization, checks for existing sessions, loads settings (4-step initialization) |
| **Auth** | Collects customer's name and email (first-time visitors only) |
| **Selection** | Main menu — choose between Chat, Voice Call, or Phone Callback |
| **Chat** | Real-time text conversation with AI (or human operator) |
| **Voice** | In-browser voice call powered by Vapi AI |
| **Contact** | Shows a phone number for the customer to call back |
| **Inbox** | History of all past conversations for this customer |
| **Error** | Shown when something goes wrong (invalid org, network error) |

**Customer Journey:**

```
1. Customer clicks chat bubble on website
       ↓
2. Widget loads in iframe → Loading Screen validates everything
       ↓
3. First-time? → Auth Screen (enter name + email)
   Returning? → Skip to Selection (session saved in browser localStorage)
       ↓
4. Selection Screen — customer picks what they want:
   • "Chat with us" → AI Chat Screen
   • "Voice call" → Vapi Voice Call Screen (if configured)
   • "Call us" → Shows phone number (if configured)
       ↓
5. Chat Screen:
   • AI responds automatically using knowledge base docs
   • If AI can't help → escalates to human operator
   • Operator can take over from the Web Dashboard
       ↓
6. Inbox — customer can revisit past conversations anytime
```

**Key Technical Details:**
- **State management:** Jotai (lightweight atomic state library)
- **Session persistence:** Contact session ID stored in `localStorage` — returning visitors skip auth
- **Voice calls:** Vapi AI SDK — real-time transcription, start/stop call control
- **Backend communication:** Convex React hooks for real-time data sync

---

### 3. Web Dashboard (`apps/web/`) — The Admin/Operator Panel

**Purpose:** The admin panel where business owners and support operators manage everything. This is the "back office" of Echo.

**Authentication:**
- Built with **Clerk** (authentication-as-a-service)
- Supports organizations (teams) — multiple operators per business
- Routes: `/sign-in`, `/sign-up`, `/org-selection`
- All dashboard routes are protected — must be logged in with an organization selected

**Dashboard Features:**

#### A. Conversations (`/conversations`)
The core feature — manage customer support conversations in real-time.

- **Left panel:** List of all conversations with filters (All / Unresolved / Escalated / Resolved)
- **Middle panel:** Selected conversation's message thread
- **Right panel:** Customer's device/browser information

**Operator capabilities:**
- View all incoming customer conversations
- Read AI-generated responses
- Send direct messages to customers (bypasses AI)
- **Enhance** button — AI polishes your draft response for grammar and clarity
- Change conversation status: Unresolved → Escalated → Resolved
- View customer metadata: browser, OS, timezone, language, screen size

**How it connects to the backend:**
- `api.private.conversations.getMany` — list conversations (filterable by status)
- `api.private.messages.create` — operator sends a message
- `api.private.messages.enhanceResponse` — AI improves message text
- `api.private.conversations.updateStatus` — change status
- `api.private.contactSessions.getOneByConversationId` — get customer info

#### B. Knowledge Base / Files (`/files`)
Upload documents that train the AI to answer customer questions.

- Upload files (PDF, images, text, HTML) via drag-and-drop
- Files are processed: text is extracted (using GPT-4o for PDFs/images) and stored in a vector database (RAG)
- When a customer asks a question, the AI searches these documents for relevant answers
- Each organization's documents are isolated — no cross-org data leakage
- **Requires Pro subscription**

**How it works behind the scenes:**
1. Operator uploads a PDF (e.g., product FAQ)
2. Backend extracts text using OpenAI's GPT-4o
3. Text is split into chunks and embedded as vectors (text-embedding-3-small)
4. When a customer asks "How do I reset my password?", the AI searches these vectors
5. Most relevant chunks are fed to GPT-4o-mini to generate a helpful answer

#### C. Widget Customization (`/customization`)
Customize the chat widget's behavior.

- **Greeting Message** — the first message customers see when they open the widget
- **Default Suggestions** — up to 3 quick-reply buttons (e.g., "How do I get started?", "Pricing info")
- **Vapi Voice Settings** — select which AI assistant and phone number to use (if Vapi is connected)
- **Requires Pro subscription**

#### D. Integrations (`/integrations`)
Get the code snippet to embed Echo on your website.

- Shows your **Organization ID**
- Provides ready-to-copy code snippets for:
  - HTML
  - React
  - Next.js
  - JavaScript
- All snippets are essentially the same `<script>` tag with your org ID

#### E. Voice Assistant / Plugins (`/plugins/vapi`)
Connect Vapi AI for voice call support.

**Disconnected state:**
- Shows what Vapi offers (web voice calls, phone numbers, outbound calls, workflows)
- Form to enter Vapi API keys (public + private)
- Keys are stored securely in **AWS Secrets Manager**

**Connected state:**
- View connected Vapi assistants and phone numbers
- Configure which assistant/phone number to use in the widget
- Disconnect option with confirmation dialog
- **Requires Pro subscription**

#### F. Billing (`/billing`)
Manage subscription plans.

- Uses Clerk's built-in pricing table
- **Free plan:** Basic access, 1 team member
- **Pro plan:** All features — AI support, voice agent, knowledge base, customization, up to 5 operators
- Premium features show a blurred overlay with "Upgrade Plan" button when on free tier

---

### 4. Convex Backend (`packages/backend/`) — The Server-Side Brain

**Purpose:** The entire backend — database, API functions, AI agent, file storage, webhooks. Built on **Convex** (serverless backend platform).

**Database Tables:**

| Table | Purpose |
|-------|---------|
| `contactSessions` | Visitor sessions — name, email, browser metadata, 24h expiry |
| `conversations` | Chat threads — linked to sessions, status tracking (unresolved/escalated/resolved) |
| `widgetSettings` | Per-org widget config — greeting, suggestions, Vapi settings |
| `plugins` | Integration configs — currently supports Vapi |
| `subscriptions` | Organization subscription status (active/inactive) |
| `users` | Minimal user records |
| Messages | Managed by @convex-dev/agent (AI conversation framework) |

**API Layers (3 tiers):**

| Layer | Who uses it | Auth required? |
|-------|-------------|----------------|
| **Public** | Widget app (customers) | No (session-based) |
| **Private** | Web dashboard (operators) | Yes (Clerk JWT) |
| **System** | Internal only (AI tools, scheduled jobs) | N/A (isolated) |

**AI System — The Support Agent:**

The heart of Echo — an AI agent built with `@convex-dev/agent` framework:

- **Model:** OpenAI GPT-4o-mini
- **Behavior:** Friendly customer service AI that:
  1. Searches the knowledge base first for product/service questions
  2. Never makes up information — admits when it doesn't know
  3. Escalates to human when the customer asks or gets frustrated
  4. Marks conversations resolved when the customer confirms they're done

**AI Tools (functions the agent can call):**

| Tool | What it does |
|------|-------------|
| **Search** | Queries the organization's RAG vector database for relevant documents, then interprets the results using GPT-4o-mini |
| **Escalate** | Changes conversation status to "escalated" — notifying human operators |
| **Resolve** | Changes conversation status to "resolved" — conversation ended |

**RAG (Retrieval-Augmented Generation) System:**
- Framework: `@convex-dev/rag`
- Embedding model: OpenAI text-embedding-3-small (1536 dimensions)
- Each organization has its own isolated search namespace
- When asked a question, finds the 5 most relevant document chunks

**Webhook (Clerk Integration):**
- Listens for subscription update events from Clerk
- When a subscription changes:
  - Updates the subscription record in the database
  - Adjusts max team members (5 for active, 1 for inactive)

**Secrets Management:**
- Vapi API keys are stored in **AWS Secrets Manager** (not in the database)
- Path format: `tenant/{organizationId}/{service}`
- Only public keys are returned to the widget; private keys stay server-side

---

## Tech Stack Summary

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Monorepo** | pnpm + Turborepo | Manages multiple apps in one repo |
| **Frontend Framework** | Next.js 15 (React) | Web dashboard + Widget app |
| **Embed Script** | Vite (IIFE build) | Tiny embeddable JavaScript file |
| **Authentication** | Clerk | User login, organizations, billing |
| **Backend** | Convex | Serverless database, functions, real-time sync |
| **AI Model** | OpenAI GPT-4o / GPT-4o-mini | Text generation, document parsing, support agent |
| **AI Framework** | @convex-dev/agent | Agent with tools (search, escalate, resolve) |
| **RAG** | @convex-dev/rag + text-embedding-3-small | Vector search over uploaded documents |
| **Voice AI** | Vapi | In-browser voice calls, phone numbers |
| **Secrets** | AWS Secrets Manager | Secure API key storage |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **State Management** | Jotai | Lightweight atomic state (widget) |
| **UI Components** | Radix UI + shadcn/ui | Accessible, customizable components |
| **Error Monitoring** | Sentry | Error tracking and reporting |
| **Deployment** | Vercel | Hosting for Next.js apps |

---

## How the Complete Flow Works (End to End)

### Setup Flow (Business Owner)
```
1. Signs up on Echo Web Dashboard (Clerk auth)
2. Creates an organization (team)
3. Subscribes to Pro plan (Clerk billing)
4. Uploads knowledge base documents (PDFs, FAQs, etc.)
   → Documents are parsed and embedded as vectors
5. Customizes widget (greeting message, suggestions)
6. (Optional) Connects Vapi for voice support
7. Copies the <script> tag from Integrations page
8. Pastes it into their website's HTML
```

### Customer Support Flow (End User)
```
1. Visitor lands on the business's website
2. Sees a floating blue chat bubble (bottom-right)
3. Clicks it → Echo widget popup opens
4. First time: enters name + email
5. Chooses "Chat with us"
6. Types a question: "How do I reset my password?"
7. AI searches the knowledge base documents
8. AI finds relevant FAQ section → generates helpful answer
9. If AI can't help → auto-escalates to human operator
10. Human operator sees it in Dashboard → responds directly
11. Conversation resolved → customer satisfied
```

### Operator Support Flow (Support Team)
```
1. Operator logs into Web Dashboard
2. Goes to Conversations page
3. Sees list of conversations:
   - Unresolved (AI is handling)
   - Escalated (needs human attention)  ← Focus here
   - Resolved (completed)
4. Clicks an escalated conversation
5. Reads the chat history (AI + customer messages)
6. Types a response → optionally clicks "Enhance" for AI polish
7. Sends message → customer sees it in real-time
8. Marks as "Resolved" when done
```

---

## Project Structure (Files & Folders)

```
Echo/
├── apps/
│   ├── embed/                    # Embeddable chat button script
│   │   ├── embed.ts              # Core logic — creates button, iframe, handles events
│   │   ├── config.ts             # Widget URL, default settings
│   │   ├── icons.ts              # Chat bubble + close SVG icons
│   │   ├── demo.html             # Test page for development
│   │   └── vite.config.ts        # Builds into single widget.js file
│   │
│   ├── web/                      # Admin Dashboard (Next.js)
│   │   ├── app/
│   │   │   ├── (auth)/           # Auth pages (sign-in, sign-up, org-selection)
│   │   │   ├── (dashboard)/      # Protected dashboard pages
│   │   │   │   ├── conversations/ # Chat management
│   │   │   │   ├── files/         # Knowledge base file uploads
│   │   │   │   ├── customization/ # Widget settings
│   │   │   │   ├── integrations/  # Embed code snippets
│   │   │   │   ├── plugins/       # Vapi voice integration
│   │   │   │   └── billing/       # Subscription management
│   │   │   └── layout.tsx        # Root layout with Clerk provider
│   │   ├── modules/              # Feature modules (business logic + UI)
│   │   │   ├── auth/             # Auth guards and views
│   │   │   ├── billing/          # Pricing table, premium overlay
│   │   │   ├── customization/    # Widget settings form
│   │   │   ├── dashboard/        # Sidebar, layouts, conversation UI
│   │   │   ├── files/            # File upload/delete dialogs
│   │   │   ├── integrations/     # Integration code snippets
│   │   │   └── plugins/          # Vapi connection UI
│   │   └── middleware.ts         # Clerk auth + org redirect middleware
│   │
│   └── widget/                   # Customer-facing chat widget (Next.js)
│       ├── app/                  # Single-page app
│       ├── modules/widget/
│       │   ├── atoms/            # Jotai state atoms (screen, session, settings)
│       │   ├── hooks/            # useVapi hook for voice calls
│       │   └── ui/
│       │       ├── screens/      # 8 screen components
│       │       ├── components/   # Header, footer, shared pieces
│       │       └── views/        # Main widget view router
│       └── public/widget.js      # Pre-built embed script
│
├── packages/
│   ├── backend/                  # Convex serverless backend
│   │   └── convex/
│   │       ├── schema.ts         # Database table definitions
│   │       ├── http.ts           # Clerk webhook handler
│   │       ├── public/           # Unauthenticated APIs (widget-facing)
│   │       ├── private/          # Authenticated APIs (dashboard-facing)
│   │       ├── system/           # Internal functions + AI agent
│   │       │   └── ai/
│   │       │       ├── agent/    # Support agent definition (GPT-4o-mini)
│   │       │       ├── tools/    # search, escalate, resolve tools
│   │       │       ├── rag.ts    # Vector search setup
│   │       │       └── constants.ts # AI prompts
│   │       └── lib/              # Utilities (text extraction, AWS secrets)
│   │
│   ├── ui/                       # Shared UI component library
│   │   └── src/components/       # Button, Form, Sidebar, Dialog, etc.
│   │
│   ├── typescript-config/        # Shared TypeScript configs
│   └── eslint-config/            # Shared ESLint configs
│
├── package.json                  # Root monorepo config
├── turbo.json                    # Turborepo task config
└── pnpm-workspace.yaml           # Workspace definition
```

---

## Key Concepts Explained (For Presentation)

### What is RAG (Retrieval-Augmented Generation)?
Instead of the AI making up answers, RAG first **searches** a database of your actual documents (PDFs, FAQs, etc.) and then **generates** an answer based on the relevant content it found. This means the AI only gives answers grounded in real information.

### What is a Vector Database / Embeddings?
Text is converted into numerical vectors (arrays of 1536 numbers) that capture meaning. Similar texts have similar vectors. When a customer asks a question, their question is also converted to a vector, and the system finds the most similar document chunks — like a smart search engine that understands meaning, not just keywords.

### What is Convex?
A serverless backend platform that provides:
- Real-time database (changes sync instantly to all connected clients)
- Server functions (queries, mutations, actions)
- File storage
- Scheduled jobs
- No server management needed

### What is Clerk?
An authentication service that handles:
- User sign-up/sign-in
- Organization/team management
- Subscription billing
- JWT tokens for API authentication

### What is Vapi?
A voice AI platform that enables:
- In-browser voice calls with AI assistants
- Phone number management
- Real-time transcription

### What is a Monorepo?
A single Git repository containing multiple related projects (apps + shared packages). Benefits:
- Shared code (UI components, configs) without publishing to npm
- Consistent tooling across all apps
- Single `pnpm turbo dev` starts everything

---

## How to Run the Full Project (Live Demo Guide)

### Prerequisites

Make sure you have these installed on your machine:

| Tool | Version | Install Command |
|------|---------|-----------------|
| **Node.js** | 20 or higher | Download from https://nodejs.org |
| **pnpm** | 10.4+ | `npm install -g pnpm` |
| **Git** | Any recent | Download from https://git-scm.com |

You also need accounts on these services (all have free tiers):

| Service | Why You Need It | Sign Up |
|---------|----------------|---------|
| **Clerk** | User authentication, organizations, billing | https://clerk.com |
| **Convex** | Serverless backend & database | https://convex.dev |
| **OpenAI** | AI responses (GPT-4o-mini) & embeddings | https://platform.openai.com |
| **AWS** (optional) | Storing Vapi API keys securely | https://aws.amazon.com |
| **Vapi** (optional) | Voice call feature | https://vapi.ai |

---

### Step 1: Clone & Install

```bash
# Clone the repository
git clone https://github.com/PranshuSharma14/Echo.git
cd Echo

# Install ALL dependencies for every app/package at once
pnpm install
```

---

### Step 2: Set Up Convex Backend

```bash
# Login to Convex (opens browser)
npx convex login

# Initialize Convex for this project (if not already done)
cd packages/backend
npx convex dev
```

On first run, Convex will:
- Ask you to create a new project or link an existing one
- Generate a deployment URL (like `https://friendly-clam-363.convex.cloud`)
- Create environment variable files automatically

**Important:** After Convex initializes, note down the `CONVEX_URL` — you'll need it in the next step.

---

### Step 3: Set Up Clerk Authentication

1. Go to https://dashboard.clerk.com → Create a new application
2. Enable **Email** sign-in method
3. Go to **Organizations** → Enable organizations
4. Note down these values from the Clerk dashboard:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_...`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_...`)
   - `CLERK_JWT_ISSUER_DOMAIN` (from JWT Templates, looks like `https://your-app.clerk.accounts.dev`)

---

### Step 4: Create Environment Variable Files

You need to create **3 separate `.env.local` files** at specific locations:

#### File 1: `packages/backend/.env.local`
```env
# Clerk Authentication
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx
CLERK_JWT_ISSUER_DOMAIN=https://your-app.clerk.accounts.dev
CLERK_WEBHOOK_SECRET=whsec_xxxxxxxxxxxx

# OpenAI API Key (for AI chatbot + document parsing)
OPENAI_API_KEY=sk-xxxxxxxxxxxx

# AWS Secrets Manager (optional — only needed for Vapi voice feature)
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxx
# AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxx
```

> To set these in Convex, you can also use the Convex dashboard → Settings → Environment Variables.

#### File 2: `apps/web/.env.local`
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx

# Convex Backend URL (from Step 2)
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

#### File 3: `apps/widget/.env.local`
```env
# Clerk Authentication (same public key as web)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx

# Convex Backend URL (same as web)
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

---

### Step 5: Start Everything

From the **root** of the project:

```bash
cd Echo
pnpm turbo dev
```

This single command starts ALL 4 services simultaneously:

| Service | URL | What to show your professor |
|---------|-----|---------------------------|
| **Web Dashboard** | http://localhost:3000 | Admin panel — sign up, manage conversations |
| **Widget App** | http://localhost:3001 | Customer chat widget — test with `?organizationId=your-org-id` |
| **Embed Demo** | http://localhost:3002 | See the floating chat bubble on a demo page |
| **Convex Backend** | (runs automatically) | Database, AI agent, API — all serverless |

**Alternative: Start services individually** (if `turbo dev` has issues):
```bash
# Terminal 1 — Backend
cd packages/backend && pnpm run dev

# Terminal 2 — Dashboard
cd apps/web && pnpm run dev

# Terminal 3 — Widget
cd apps/widget && pnpm run dev

# Terminal 4 — Embed (optional)
cd apps/embed && pnpm run dev
```

---

### Step 6: First-Time Setup in the Dashboard

1. Open **http://localhost:3000** in your browser
2. Click **Sign Up** → create an account with email
3. **Create an Organization** (this is your "business" in Echo)
4. You'll land on the Dashboard home page
5. Copy your **Organization ID** from the Integrations page

---

## Demo Script (Impress Your Professor)

Follow this exact sequence to show off every feature:

### Demo Part 1: The Admin Dashboard (http://localhost:3000)

**1. Sign Up & Create Organization (~1 min)**
- Open http://localhost:3000
- Sign up with email → Create an organization (e.g., "Echo Support Team")
- Show the dashboard sidebar with all sections

**2. Upload Knowledge Base Documents (~2 min)**
- Go to **Knowledge Base (Files)** in the sidebar
- Click **Add New** → Upload a PDF or text file (e.g., a product FAQ document)
- Explain: *"These documents are parsed by GPT-4o, converted into vector embeddings, and stored in a RAG database. When customers ask questions, the AI searches these documents to find relevant answers."*

**3. Customize the Widget (~1 min)**
- Go to **Widget Customization**
- Set a greeting message: *"Hi! How can I help you today?"*
- Add default suggestions: *"How do I get started?"*, *"What are your pricing plans?"*, *"Contact support"*
- Click Save
- Explain: *"These settings are stored per-organization and loaded by the widget app in real-time."*

**4. Show Integrations (~1 min)**
- Go to **Integrations**
- Show the Organization ID
- Show the code snippets (HTML, React, Next.js, JavaScript)
- Explain: *"Any website can embed our support widget with just one line of HTML."*
- Copy the Organization ID for the next step

### Demo Part 2: The Customer Widget (http://localhost:3001)

**5. Open the Widget (~2 min)**
- Open a new browser tab: `http://localhost:3001?organizationId=YOUR_ORG_ID`
- Watch the loading screen validate the organization
- Fill in name and email on the Auth screen
- You'll see the Selection screen with your custom greeting and suggestions

**6. Chat with the AI (~3 min)**
- Click **"Start a conversation"** or one of the suggestion buttons
- Type a question related to your uploaded document
- Watch the AI respond using RAG (searches your knowledge base!)
- Type *"I want to talk to a human"* → Watch the AI escalate automatically
- Explain: *"The AI agent uses GPT-4o-mini with three tools: Search (queries the knowledge base), Escalate (transfers to human), and Resolve (marks conversation done)."*

### Demo Part 3: Operator Takes Over (http://localhost:3000)

**7. Handle Escalated Conversation (~2 min)**
- Go back to the Dashboard → **Conversations**
- Click the **Escalated** filter → you'll see the conversation from Step 6
- Click on it → read the full chat history (AI + customer messages)
- Type a response → click **Enhance** to let AI polish your message
- Send the message → the customer sees it in real-time in the widget!
- Click the status button → Mark as **Resolved**
- Explain: *"Operators can see all conversations in real-time, take over from AI, and use AI-enhanced responses for better quality."*

**8. Show the Contact Panel (~1 min)**
- While viewing a conversation, point out the right-side **Contact Panel**
- Show: customer's browser, OS, screen resolution, timezone, language
- Explain: *"We capture browser metadata during session creation for context."*

### Demo Part 4: The Embed Script (http://localhost:3002)

**9. Show Embed Integration (~1 min)**
- Open http://localhost:3002 → see the demo page
- Point out the floating blue chat bubble in the bottom-right
- Click it → the full widget opens in a popup
- Explain: *"This is a single JavaScript file that any website can add. It creates the floating button and loads our widget in an iframe."*

### Demo Part 5: Architecture Overview (~2 min)

**10. Technical Highlights to Mention:**
- *"It's a monorepo with 4 apps managed by Turborepo and pnpm"*
- *"The backend is entirely serverless using Convex — no servers to manage"*
- *"We use RAG (Retrieval-Augmented Generation) so the AI never makes up answers"*
- *"Vector embeddings use OpenAI's text-embedding-3-small model (1536 dimensions)"*
- *"Sessions persist in localStorage — returning visitors skip authentication"*
- *"Real-time sync — when an operator sends a message, the customer sees it instantly"*
- *"Secrets (API keys) are stored in AWS Secrets Manager, not in the database"*
- *"The AI agent has 3 tools: Search, Escalate, and Resolve — it decides when to use each"*

---

## Troubleshooting Common Issues

| Problem | Solution |
|---------|----------|
| `pnpm install` fails | Make sure you're using Node.js 20+. Run `node --version` to check |
| `pnpm turbo dev` exits with error | Check that all 3 `.env.local` files exist with correct values |
| Dashboard shows blank page | Check browser console for errors. Usually a missing env variable |
| Widget shows "Error" screen | Make sure `organizationId` in the URL matches your actual org ID |
| AI doesn't respond to messages | Check that `OPENAI_API_KEY` is set in `packages/backend/.env.local` |
| AI says "subscription not active" | Create a subscription record in Convex dashboard, or set up Clerk billing |
| Convex functions fail | Run `npx convex dev` in `packages/backend/` to see detailed error logs |
| Port already in use | Kill the process: `npx kill-port 3000` (or 3001, 3002) |
| Widget doesn't load in embed | Check that the widget app is running on port 3001 |

---

## Feature Summary Table

| Feature | Free Plan | Pro Plan | Location |
|---------|-----------|----------|----------|
| Basic chat widget | ✅ | ✅ | Widget App |
| AI-powered responses | ❌ | ✅ | Backend AI Agent |
| Knowledge base uploads | ❌ | ✅ | Dashboard → Files |
| Widget customization | ❌ | ✅ | Dashboard → Customization |
| Voice AI calls (Vapi) | ❌ | ✅ | Dashboard → Plugins |
| Phone callback | ❌ | ✅ | Dashboard → Plugins |
| Conversation management | ✅ | ✅ | Dashboard → Conversations |
| AI message enhancement | ✅ | ✅ | Dashboard → Conversations |
| Team members | 1 | 5 | Managed via Clerk |
| Integration snippets | ✅ | ✅ | Dashboard → Integrations |

---

## Team Contributions

The project was built in 3 phases:

- **Phase 1 (Pranshu Sharma):** Backend infrastructure, database schema, Convex setup, core UI components (Form, Sidebar, Button), widget screens (auth, loading, chat, selection), dashboard layout and navigation
- **Phase 2 (Arushi):** ~7 hours of additional features
- **Phase 3 (Suryansh):** ~7 hours of remaining features

---

*This document was generated for project presentation purposes. Echo is a college minor project (Semester 6) demonstrating a production-grade AI customer support SaaS platform.*
