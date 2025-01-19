// Manages notes' storage, retrieval, and updates
class NoteManager {
    constructor() {
        // Load notes from localStorage or initialize with an empty array
        this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    }

    /**
     * Adds a new note with the specified content.
     * @param {string} content - The content of the note. Defaults to an empty string.
     * @returns {object} - The newly created note object.
     */
    addNote(content = "") {
        const note = { id: Date.now(), content }; // Create a note with a unique ID and content
        this.notes.push(note); // Add the note to the notes array
        this.saveNotes(); // Persist changes to localStorage
        return note;
    }

    /**
     * Deletes a note with the specified ID.
     * @param {number} id - The ID of the note to delete.
     */
    deleteNote(id) {
        // Filter out the note with the matching ID
        this.notes = this.notes.filter((note) => note.id !== id);
        this.saveNotes();
    }

    /**
     * Updates the content of a note with the specified ID.
     * @param {number} id - The ID of the note to update.
     * @param {string} content - The new content for the note.
     */
    updateNote(id, content) {
        const note = this.notes.find((note) => note.id === id); // Find the note by ID
        if (note) {
            note.content = content; // Update the note's content
            this.saveNotes(); // Persist changes to localStorage
        }
    }

    /**
     * Saves the notes array to localStorage and updates the last saved timestamp.
     */
    saveNotes() {
        localStorage.setItem("notes", JSON.stringify(this.notes)); // Persist notes to localStorage
        UIManager.updateLastSaved(); // Update the last saved timestamp in the UI
    }

    /**
     * Retrieves all notes.
     * @returns {Array} - An array of all notes.
     */
    getNotes() {
        return this.notes;
    }
}

// Manages the user interface for displaying and interacting with notes
class UIManager {
    /**
     * Initializes the UIManager, rendering notes and setting up event listeners.
     * @param {NoteManager} noteManager - The NoteManager instance to use.
     */
    static initialize(noteManager) {
        this.noteManager = noteManager;
        this.renderNotes();
        this.setupEventListeners();
        this.updateLastSaved();
    }

    /**
     * Renders all notes in the UI.
     */
    static renderNotes() {
        const notesContainer = document.getElementById("notes-container");
        notesContainer.innerHTML = "";
        this.noteManager.getNotes().forEach((note) => {
            const noteElement = this.createNoteElement(note);
            notesContainer.appendChild(noteElement);
        });
    }

    /**
     * Creates a single note element for the UI.
     * @param {object} note - The note object to create an element for.
     * @returns {HTMLElement} - The created note element.
     */
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

    /**
     * Sets up event listeners for UI elements.
     */
    static setupEventListeners() {
        // Add a new note when the "Add Note" button is clicked
        document.getElementById("add-note-btn").addEventListener("click", () => {
            const newNote = this.noteManager.addNote();
            const noteElement = this.createNoteElement(newNote);
            document.getElementById("notes-container").appendChild(noteElement);
        });

        // Navigate back to the main page when the "Back" button is clicked
        document.getElementById("back-btn").addEventListener("click", () => {
            window.location.href = "../index.html";
        });
    }

    /**
     * Updates the "Last Saved" timestamp in the UI.
     */
    static updateLastSaved() {
        const timestamp = new Date().toLocaleTimeString();
        document.getElementById("last-saved").textContent =
            MESSAGES.LAST_SAVED + timestamp;
    }
}

// Initialize the writer page when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const noteManager = new NoteManager(); // Create a new NoteManager instance
    UIManager.initialize(noteManager); // Initialize the UIManager with the NoteManager
});
