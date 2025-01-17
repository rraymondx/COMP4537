class NoteManager {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    }

    addNote(content = "") {
        const note = { id: Date.now(), content };
        this.notes.push(note);
        this.saveNotes();
        return note;
    }

    deleteNote(id) {
        this.notes = this.notes.filter((note) => note.id !== id);
        this.saveNotes();
    }

    updateNote(id, content) {
        const note = this.notes.find((note) => note.id === id);
        if (note) {
            note.content = content;
            this.saveNotes();
        }
    }

    saveNotes() {
        localStorage.setItem("notes", JSON.stringify(this.notes));
        UIManager.updateLastSaved();
    }

    getNotes() {
        return this.notes;
    }
}

class UIManager {
    static initialize(noteManager) {
        this.noteManager = noteManager;
        this.renderNotes();
        this.setupEventListeners();
        this.updateLastSaved();
    }

    static renderNotes() {
        const notesContainer = document.getElementById("notes-container");
        notesContainer.innerHTML = "";
        this.noteManager.getNotes().forEach((note) => {
            const noteElement = this.createNoteElement(note);
            notesContainer.appendChild(noteElement);
        });
    }

    static createNoteElement(note) {
        const noteWrapper = document.createElement("div");
        noteWrapper.className = "note-wrapper";

        const textarea = document.createElement("textarea");
        textarea.value = note.content;
        textarea.addEventListener("input", () =>
            this.noteManager.updateNote(note.id, textarea.value)
        );

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Remove";
        deleteButton.className = "btn-remove";
        deleteButton.addEventListener("click", () => {
            this.noteManager.deleteNote(note.id);
            this.renderNotes();
        });

        noteWrapper.appendChild(textarea);
        noteWrapper.appendChild(deleteButton);
        return noteWrapper;
    }

    static setupEventListeners() {
        document.getElementById("add-note-btn").addEventListener("click", () => {
            const newNote = this.noteManager.addNote();
            const noteElement = this.createNoteElement(newNote);
            document.getElementById("notes-container").appendChild(noteElement);
        });

        document.getElementById("back-btn").addEventListener("click", () => {
            window.location.href = "../index.html";
        });
    }

    static updateLastSaved() {
        const timestamp = new Date().toLocaleTimeString();
        document.getElementById("last-saved").textContent =
            MESSAGES.LAST_SAVED + timestamp;
    }
}

// Initialize the writer page
document.addEventListener("DOMContentLoaded", () => {
    const noteManager = new NoteManager();
    UIManager.initialize(noteManager);
});
