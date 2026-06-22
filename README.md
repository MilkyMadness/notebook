# 📓 Notebook

A lightweight, browser-based notebook app built with vanilla HTML, CSS, and JavaScript. No frameworks, no backend — everything runs in the browser and saves to localStorage.

## Features

- **Multiple notes** — create, load, and delete notes from the sidebar
- **Auto-save** — notes save automatically 2 seconds after you stop typing
- **Export to PDF** — download any note as a formatted PDF
- **Print** — print the current note directly from the browser
- **Find** — search for text within the current note
- **Cut / Copy / Paste / Select All** — toolbar and dropdown menu support
- **Font size & colour** — customise the appearance of your text
- **Zoom in / out / fullscreen** — via the View menu
- **Dark mode** — toggle with the 🌙 button in the toolbar

## Getting Started

No install needed. Just open `index.html` in your browser.

If you want live reload while editing:
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension in VS Code
2. Right-click `index.html` → Open with Live Server

## Usage

| Action | How |
|---|---|
| New note | Sidebar `+ New` button or File → New Document |
| Save note | `Save` button, File → Save, or just type (auto-saves) |
| Load note | Click any note in the sidebar |
| Delete note | Click `✕` next to a note in the sidebar |
| Export PDF | `Export PDF` button or File → Export PDF |
| Find text | `Find` button or Edit → Find |
| Dark mode | 🌙 button in the top-right of the toolbar |

## Tech Stack

- HTML
- CSS
- JavaScript (vanilla)
- [jsPDF](https://github.com/parallax/jsPDF) — PDF export

## Storage

All notes are saved to your browser's `localStorage`. Clearing your browser data will delete your notes.