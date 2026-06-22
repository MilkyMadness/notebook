// ==========================================
// 1. GLOBAL INTERFACE ELEMENT SELECTORS
// ==========================================
const notebookTitle = document.getElementById('notebookTitle');
const noteInput = document.getElementById('noteInput');

// Target the navigation dropdown menus
const fileDropdown = document.querySelector('select[name="File"]');

// Target the quick action control buttons
const newDocButton = document.getElementById('newDocument');
const saveDocButton = document.getElementById('saveOption');


// ==========================================
// 2. CORE WORKSPACE ACTIONS
// ==========================================

// Action A: Reset/Wipe Workspace
function startNewDocument() {
    const confirmClear = confirm("Are you sure you want to start a new document? Unsaved changes will be lost.");
    if (confirmClear) {
        notebookTitle.value = "Untitled Document"; 
        noteInput.value = "";                     
    }
}

// Action B: Compile & Export text canvas to PDF
function triggerPdfDownload() {
    // Access the loaded external jsPDF tool
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const titleText = notebookTitle.value || "Untitled Document";
    const bodyText = noteInput.value || "";

    // Header Setup
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(22);
    doc.text(titleText, 20, 20); 

    // Paragraph Configuration
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(14);
    
    // Auto-wraps words to prevent cutting off text at the page edge
    const splitBody = doc.splitTextToSize(bodyText, 170);
    doc.text(splitBody, 20, 35); 

    // Creates a clean file filename profile string
    const safeFileName = titleText.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    // Downloads file to disk
    doc.save(`${safeFileName}.pdf`);
}

function saveToLocal() {
    localStorage.setItem('notebook_title', notebookTitle.value);
    localStorage.setItem('notebook_body', noteInput.value);
    alert('Saved!');
}

function loadFromLocal() {
    const title = localStorage.getItem('notebook_title');
    const body = localStorage.getItem('notebook_body');
    if (title || body) {
        notebookTitle.value = title || '';
        noteInput.value = body || '';
    } else {
        alert('No saved document found.');
    }
}

function cutText() {
    const start = noteInput.selectionStart;
    const end = noteInput.selectionEnd;
    if (start === end) return;
    const selected = noteInput.value.substring(start, end);
    navigator.clipboard.writeText(selected);
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
    if (index === -1) {
        alert(`"${query}" not found.`);
        return;
    }
    noteInput.focus();
    noteInput.setSelectionRange(index, index + query.length);
}


// ==========================================
// 3. ATTACH THE EVENT LISTENERS
// ==========================================

// Click events for the standalone toolbar buttons
if(newDocButton) newDocButton.addEventListener('click', startNewDocument);
if(saveDocButton) saveDocButton.addEventListener('click', triggerPdfDownload);

// Change event routing for the "File" navigation dropdown options
if(fileDropdown) {
    fileDropdown.addEventListener('change', function() {
        if (fileDropdown.value === 'newDocument') {
            startNewDocument();
        } else if (fileDropdown.value === 'saveOption') {
            triggerPdfDownload();
        }
        // Force the menu title banner display back to default text option
        fileDropdown.value = ""; 
    });
}
const editDropdown = document.querySelector('select[name="Edit"]');
const insertDropdown = document.querySelector('select[name="Insert"]');
const formatDropdown = document.querySelector('select[name="Format"]');
const viewDropdown = document.querySelector('select[name="View"]');

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
        if (this.value === 'image') alert('Image insert coming soon.');
        else if (this.value === 'link') {
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
        if (this.value === 'fontSize') document.getElementById('fontSize').focus();
        else if (this.value === 'fontColor') document.getElementById('fontColor').click();
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

const loadDocButton = document.getElementById('loadOption');
if (loadDocButton) loadDocButton.addEventListener('click', loadFromLocal);

const cutButton = document.getElementById('cut');
const copyButton = document.getElementById('copy');
const pasteButton = document.getElementById('paste');

if (cutButton) cutButton.addEventListener('click', cutText);
if (copyButton) copyButton.addEventListener('click', copyText);
if (pasteButton) pasteButton.addEventListener('click', pasteText);
const selectAllButton = document.getElementById('selectAll');
const findButton = document.getElementById('find');

if (selectAllButton) selectAllButton.addEventListener('click', selectAll);
if (findButton) findButton.addEventListener('click', findText);