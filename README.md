# Team Productivity Tracker - Professional PWA & APK Wrapper

This repository contains the standalone, production-ready Progressive Web App (PWA) wrapper for the **Team Productivity Tracker** Google Apps Script web application.

---

## 🚀 Key Features

1. **No Google Apps Script Warning Banner:**
   - Shifting the iframe top by `-38px` pushes Google's default notice (`"This application was created by another user, not by Google"`) completely off-screen.
2. **True Fullscreen Standalone App (No Top Website / Address Bar):**
   - Configured with `display: "standalone"` and `display_override: ["standalone", "window-controls-overlay"]`.
   - Includes `.well-known/assetlinks.json` support to verify Digital Asset Links with Android TWA (Trusted Web Activity).
3. **Native Look & Feel:**
   - Dark Slate & Sky Blue theme matching the app.
   - Branded splash screen with smooth progress loader during initial iframe bootup.
   - Offline detection overlay with a native "Retry Connection" dialog.
4. **PWABuilder 100% Score Ready:**
   - Complete Web App Manifest (`manifest.json`).
   - Active offline Service Worker (`sw.js`).
   - 192x192 and 512x512 maskable PNG icons.

---

## 🛠️ Deployment Steps (GitHub -> Vercel -> PWABuilder)

### Step 1: Push to GitHub
1. Open terminal inside this folder:
   ```bash
   git remote add origin https://github.com/ompatel4423/team-productivity-tracker.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New Project** -> **Import Git Repository**.
3. Select `team-productivity-tracker` and click **Deploy** (no build settings needed, it's a static PWA).
4. Note your deployed Vercel URL (e.g., `https://team-productivity-tracker.vercel.app`).

### Step 3: Turn into an APK via PWABuilder
1. Go to [pwabuilder.com](https://www.pwabuilder.com).
2. Enter your Vercel URL (e.g., `https://team-productivity-tracker.vercel.app`) and click **Start**.
3. Once the PWA audit passes with high marks, click **Package for Stores** -> **Android**.
4. In the Android settings popup:
   - **Package ID:** e.g., `com.productivity.tracker` (or your company package ID).
   - **App Name:** `Team Productivity Tracker`
   - **Short Name:** `Productivity`
   - **Display Mode:** `Standalone`
   - **Signing key:** Choose either a new key or an existing keystore.
5. Click **Generate Package / APK**.

---

## 🔒 Crucial Step: Completely Remove the Top Browser / URL Bar in Android

When Android installs an APK made from a PWA (TWA), Android will show a top browser address bar with the domain name **unless** you verify your site with Digital Asset Links.

To make the address bar disappear completely:
1. When PWABuilder finishes generating your package, it gives you:
   - The **SHA-256 Fingerprint** (looks like `14:6D:E9:A8:...`).
   - The **Package Name** (e.g. `com.productivity.tracker`).
2. Open `.well-known/assetlinks.json` in this repository and replace `PASTE_YOUR_PWABUILDER_SHA256_FINGERPRINT_HERE` with your actual fingerprint.
3. Commit and push to GitHub:
   ```bash
   git add .well-known/assetlinks.json
   git commit -m "Update assetlinks with PWABuilder SHA-256"
   git push
   ```
4. Vercel will instantly redeploy. Android Chrome will verify the domain within minutes and **never show any website URL bar or browser header again**!
