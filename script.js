// ==========================================
// 1. SELECTORS
// ==========================================
const notebookTitle = document.getElementById('notebookTitle');
const noteInput = document.getElementById('noteInput');
const fileDropdown = document.querySelector('select[name="File"]');
const editDropdown = document.querySelector('select[name="Edit"]');
const insertDropdown = document.querySelector('select[name="Insert"]');
const formatDropdown = document.querySelector('select[name="Format"]');
const viewDropdown = document.querySelector('select[name="View"]');
const fontSizeSelect = document.getElementById('fontSize');
const fontColorInput = document.getElementById('fontColor');
const wordCount = document.getElementById('wordCount');
const notesList = document.getElementById('notesList');
const darkModeToggle = document.getElementById('darkModeToggle');

let currentNoteId = null;
let autoSaveTimer = null;

// ==========================================
// 2. NOTES MANAGEMENT
// ==========================================
function getNotes() {
    return JSON.parse(localStorage.getItem('notes') || '{}');
}

function saveNotes(notes) {
    localStorage.setItem('notes', JSON.stringify(notes));
}

function generateId() {
    return Date.now().toString();
}

function renderNotesList() {
    const notes = getNotes();
    notesList.innerHTML = '';
    Object.entries(notes).reverse().forEach(([id, note]) => {
        const li = document.createElement('li');
        li.className = 'notes-list-item' + (id === currentNoteId ? ' active' : '');
        li.innerHTML = `
            <span class="notes-list-title">${note.title || 'Untitled'}</span>
            <button class="delete-note-btn" data-id="${id}">✕</button>
        `;
        li.querySelector('.notes-list-title').addEventListener('click', () => loadNote(id));
        li.querySelector('.delete-note-btn').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteNote(id);
        });
        notesList.appendChild(li);
    });
}

function loadNote(id) {
    const notes = getNotes();
    const note = notes[id];
    if (!note) return;
    currentNoteId = id;
    notebookTitle.value = note.title || '';
    noteInput.value = note.body || '';
    noteInput.style.fontSize = note.fontSize || '16px';
    noteInput.style.color = note.color || '#000000';
    if (fontSizeSelect) fontSizeSelect.value = note.fontSize || '16px';
    if (fontColorInput) fontColorInput.value = note.color || '#000000';
    updateWordCount();
    renderNotesList();
}

function saveCurrentNote() {
    const notes = getNotes();
    if (!currentNoteId) currentNoteId = generateId();
    notes[currentNoteId] = {
        title: notebookTitle.value || 'Untitled',
        body: noteInput.value,
        fontSize: noteInput.style.fontSize || '16px',
        color: noteInput.style.color || '#000000',
        savedAt: new Date().toLocaleTimeString()
    };
    saveNotes(notes);
    renderNotesList();
}

function deleteNote(id) {
    const notes = getNotes();
    delete notes[id];
    saveNotes(notes);
    if (currentNoteId === id) {
        currentNoteId = null;
        notebookTitle.value = 'Untitled Document';
        noteInput.value = '';
        updateWordCount();
    }
    renderNotesList();
}

function startNewDocument() {
    const confirmClear = confirm("Start a new document? Unsaved changes will be lost.");
    if (confirmClear) {
        currentNoteId = null;
        notebookTitle.value = 'Untitled Document';
        noteInput.value = '';
        updateWordCount();
        renderNotesList();
    }
}

// ==========================================
// 3. AUTO SAVE
// ==========================================
function triggerAutoSave() {
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(() => {
        saveCurrentNote();
    }, 2000);
}

// ==========================================
// 4. PDF EXPORT
// ==========================================
function triggerPdfDownload() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const titleText = notebookTitle.value || 'Untitled Document';
    const bodyText = noteInput.value || '';
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text(titleText, 20, 20);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(14);
    const splitBody = doc.splitTextToSize(bodyText, 170);
    doc.text(splitBody, 20, 35);
    const safeFileName = titleText.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    doc.save(`${safeFileName}.pdf`);
}

// ==========================================
// 5. EDIT ACTIONS
// ==========================================
function cutText() {
    const start = noteInput.selectionStart;
    const end = noteInput.selectionEnd;
    if (start === end) return;
    navigator.clipboard.writeText(noteInput.value.substring(start, end));
    noteInput.value = noteInput.value.substring(0, start) + noteInput.value.substring(end);
}

function copyText() {
    const selected = noteInput.value.substring(noteInput.selectionStart, noteInput.selectionEnd);
    if (selected) navigator.clipboard.writeText(selected);
}

async function pasteText() {
    const text = await navigator.clipboard.readText();
    const start = noteInput.selectionStart;
    noteInput.value = noteInput.value.substring(0, start) + text + noteInput.value.substring(noteInput.selectionEnd);
}

function selectAll() {
    noteInput.focus();
    noteInput.select();
}

function findText() {
    const query = prompt('Find:');
    if (!query) return;
    const index = noteInput.value.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) { alert(`"${query}" not found.`); return; }
    noteInput.focus();
    noteInput.setSelectionRange(index, index + query.length);
}

// ==========================================
// 6. WORD COUNT
// ==========================================
function updateWordCount() {
    const text = noteInput.value.trim();
    const words = text ? text.split(/\s+/).length : 0;
    const chars = noteInput.value.length;
    wordCount.textContent = `${words} words · ${chars} characters`;
}

// ==========================================
// 7. DARK MODE
// ==========================================
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('darkMode', isDark);
    darkModeToggle.textContent = isDark ? '☀️' : '🌙';
}

function loadDarkMode() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark');
        if (darkModeToggle) darkModeToggle.textContent = '☀️';
    }
}

// ==========================================
// 8. EVENT LISTENERS
// ==========================================
noteInput.addEventListener('input', () => { updateWordCount(); triggerAutoSave(); });
notebookTitle.addEventListener('input', triggerAutoSave);

if (fontSizeSelect) fontSizeSelect.addEventListener('change', function() { noteInput.style.fontSize = this.value; });
if (fontColorInput) fontColorInput.addEventListener('input', function() { noteInput.style.color = this.value; });
if (darkModeToggle) darkModeToggle.addEventListener('click', toggleDarkMode);

document.getElementById('newDocument')?.addEventListener('click', startNewDocument);
document.getElementById('saveOption')?.addEventListener('click', saveCurrentNote);
document.getElementById('loadOption')?.addEventListener('click', () => alert('Click a note from the sidebar to load it.'));
document.getElementById('print')?.addEventListener('click', () => window.print());
document.getElementById('cut')?.addEventListener('click', cutText);
document.getElementById('copy')?.addEventListener('click', copyText);
document.getElementById('paste')?.addEventListener('click', pasteText);
document.getElementById('selectAll')?.addEventListener('click', selectAll);
document.getElementById('find')?.addEventListener('click', findText);
document.getElementById('exportPdf')?.addEventListener('click', triggerPdfDownload);

if (fileDropdown) {
    fileDropdown.addEventListener('change', function() {
        if (this.value === 'newDocument') startNewDocument();
        else if (this.value === 'saveOption') saveCurrentNote();
        else if (this.value === 'print') window.print();
        else if (this.value === 'exportPdf') triggerPdfDownload();
        this.value = '';
    });
}

if (editDropdown) {
    editDropdown.addEventListener('change', function() {
        if (this.value === 'cut') cutText();
        else if (this.value === 'copy') copyText();
        else if (this.value === 'paste') pasteText();
        else if (this.value === 'selectAll') selectAll();
        else if (this.value === 'find') findText();
        this.value = '';
    });
}

if (insertDropdown) {
    insertDropdown.addEventListener('change', function() {
        if (this.value === 'link') {
            const url = prompt('Enter URL:');
            if (url) {
                const start = noteInput.selectionStart;
                noteInput.value = noteInput.value.substring(0, start) + url + noteInput.value.substring(noteInput.selectionEnd);
            }
        }
        this.value = '';
    });
}

if (formatDropdown) {
    formatDropdown.addEventListener('change', function() {
        if (this.value === 'fontSize') fontSizeSelect?.focus();
        else if (this.value === 'fontColor') fontColorInput?.click();
        this.value = '';
    });
}

if (viewDropdown) {
    viewDropdown.addEventListener('change', function() {
        if (this.value === 'zoomIn') document.body.style.zoom = (parseFloat(document.body.style.zoom || 1) + 0.1).toFixed(1);
        else if (this.value === 'zoomOut') document.body.style.zoom = (parseFloat(document.body.style.zoom || 1) - 0.1).toFixed(1);
        else if (this.value === 'fullScreen') document.documentElement.requestFullscreen();
        this.value = '';
    });
}

// ==========================================
// 9. INIT
// ==========================================
loadDarkMode();
renderNotesList();
updateWordCount();