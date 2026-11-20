# CSCI 310 Deployment & Publishing Guide
## GitHub Repository Setup and Vercel Cloud Deployment

> **Course:** CSCI 310 Principles of Programming Languages  
> **Institution:** Amity University Dubai, EAID  
> **Assignment Component:** Task 6: GitHub, Publication and Project Report (3 Marks)

---

## 1. Overview

As required by the CSCI 310 assessment remit, the complete project source code must be published to a public **GitHub** repository, and the working application must be published online via a hosting platform such as **Vercel** or Netlify.

Follow the instructions below to upload your repository and publish your live web application link.

---

## 2. Part 1: GitHub Repository Setup

### Step 1: Initialize Git in your project folder (if not already done)
Open PowerShell or your terminal in `C:\Users\ss\OneDrive\Desktop\PPl project` and run:

```bash
git init
```

### Step 2: Add all files and create the initial commit
```bash
git add .
git commit -m "feat: complete StudyFlow application for CSCI 310"
```

### Step 3: Create a new repository on GitHub
1. Log into your account on [GitHub.com](https://github.com).
2. Click the **"+"** icon in the upper right corner and select **"New repository"**.
3. Name your repository (e.g., `studyflow-csci310`).
4. Keep the repository **Public** as per assignment submission guidelines.
5. Do **NOT** initialize with a README, .gitignore, or license (these already exist in the project).
6. Click **"Create repository"**.

### Step 4: Push your local code to GitHub
Run the commands provided by GitHub (replace `<YOUR_USERNAME>` with your GitHub username):

```bash
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/studyflow-csci310.git
git push -u origin main
```

---

## 3. Part 2: Publishing the Website on Vercel

Vercel provides free, high-performance static hosting with zero configuration for Vite and React applications.

### Option A: Deploy via the Vercel Web Dashboard (Recommended)

1. Navigate to [https://vercel.com](https://vercel.com) and log in using your GitHub account.
2. On your Vercel dashboard, click **"Add New..."** $\to$ **"Project"**.
3. Under **"Import Git Repository"**, find your `studyflow-csci310` repository and click **"Import"**.
4. Configure the project settings:
   - **Framework Preset:** Vite (detected automatically).
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Click **"Deploy"**.
6. Within 60 seconds, your site will be live at a public URL (e.g., `https://studyflow-csci310.vercel.app`).

### Option B: Deploy via Vercel CLI (Alternative)

You can also deploy directly from the command line:

```bash
# Install Vercel CLI globally
npm install -g vercel

# Log in and deploy
vercel
```
Follow the interactive terminal prompts:
- *Set up and deploy?* `Y`
- *Which scope?* (Select your account)
- *Link to existing project?* `N`
- *What's your project's name?* `studyflow`
- *In which directory is your code located?* `./`
- *Want to modify settings?* `N`

To deploy to production:
```bash
vercel --prod
```

### Option C: GitHub Pages (automated)

The repository includes a GitHub Actions workflow that builds and publishes the app to GitHub Pages whenever a commit is pushed to `main`. The Vite build uses `/ppl/` as its base path on GitHub Actions so the app assets load from the project site URL:

`https://umbreenasif0817-tech.github.io/ppl/`

---

## 4. Single-Page Application (SPA) Routing Note

StudyFlow uses state-based tab routing (`activeTab`), so all navigation works seamlessly out-of-the-box on static hosting platforms without requiring rewrites or 404 fallbacks.

---

## 5. CSCI 310 Final Submission Checklist

Before submitting your final project package through LMS / TurnItIn, verify that you have assembled all required components:

- [ ] **GitHub Repository Link:** Complete source code pushed to public GitHub repository.
- [ ] **Published Application Link:** Working web URL hosted on Vercel or GitHub Pages.
- [ ] **Five-Page Project Report:** Formatted according to the page-by-page structure specified in the assessment remit:
  - *Page 1:* Introduction, problem statement, and objectives.
  - *Page 2:* Development tools, architecture, and implementation details.
  - *Page 3:* AI-assisted coding, prompt engineering, and debugging log.
  - *Page 4:* Achievement of CLO3, CLO4, and CLO5 (OOP, FP, and Mini-Interpreter).
  - *Page 5:* Testing verification results, group member contributions, and conclusion.
- [ ] **Presentation Readiness:** 10–12 minute live demonstration covering application walkthrough, OOP vs. FP code explanation, and mini-interpreter execution.
