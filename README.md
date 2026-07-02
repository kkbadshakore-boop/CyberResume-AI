# CyberResume — AI-Powered Cybersecurity Resume Builder

A single-file, client-side web app for building and polishing resumes tailored to cybersecurity roles (penetration testing, SOC analysis, GRC, security engineering, CISO tracks, etc.), with built-in AI feedback powered by Claude.

## Screenshots

**Build tab** — structured resume form:

![Build tab](Screenshots/build-tab.png)

**Preview tab** — print-ready resume output:

![Preview tab](Screenshots/preview-tab.png)

## Features

- **Build** — A structured resume form covering:
  - Identity & Contact (name, title, email, phone, location, clearance level, LinkedIn, GitHub/portfolio)
  - Professional Summary
  - Work Experience (add/remove multiple entries)
  - Projects
  - Education
  - Skills (rendered as chips for quick scanning)
- **AI Analyze** — Sends your resume content to Claude, which acts as a cybersecurity hiring manager/resume coach and returns structured feedback: section-by-section scoring, missing ATS keywords, and improvement suggestions.
- **Preview** — A clean, print-ready resume layout. Use your browser's print dialog (Ctrl+P / Cmd+P) to save it as a PDF.
- **Local autosave** — Your resume data is saved to `localStorage` in the browser (`cyberresume_v2`), so it persists between visits on the same device.

## Tech Stack

- Plain HTML, CSS, and vanilla JavaScript — no build step, no framework, no backend required.
- Fonts: `Share Tech Mono`, `Rajdhani`, and `Exo 2` (via Google Fonts) for a terminal/cyberpunk aesthetic.
- AI Analyze calls the Anthropic API (`https://api.anthropic.com/v1/messages`) directly from the browser.

## Getting Started

1. Open `cybersec-resume-builder.html` in any modern browser — that's it, no installation needed.
2. Fill in your details under the **Build** tab.
3. Click **AI Analyze** to get cybersecurity-specific resume feedback.
4. Switch to **Preview**, then use your browser's print function to export as a PDF.

### Running the AI Analyze feature

The AI Analyze feature makes a request to the Anthropic Messages API. To use it:
- You'll need a valid Anthropic API key with access to the `/v1/messages` endpoint.
- Because the request is made client-side, you'll want to supply the key via your own proxy/backend rather than embedding it directly in the HTML if you plan to deploy this publicly — exposing an API key in client-side JavaScript lets anyone who views the page use (and bill against) your key.

## File Structure

This is currently a single file:

```
cybersec-resume-builder.html   # entire app: markup, styles, and JS in one file
```

## Notes

- All resume data stays in the browser (`localStorage`) unless you explicitly send it to the AI Analyze endpoint.
- No user accounts, database, or server-side storage — it's designed to be lightweight and fully static.
