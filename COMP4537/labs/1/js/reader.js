class ReaderUIManager {
    constructor() {
        this.notesDisplay = document.getElementById("notes-display");
        this.lastRetrievedTime = document.getElementById("last-retrieved-time");
    }

    renderNotes(notes) {
        if (!this.notesDisplay) {
            console.error("Notes display element not found!");
            return;
        }

        // Clear current notes
        this.notesDisplay.innerHTML = "";

        // Add notes dynamically
        notes.forEach((note, index) => {
            const noteElement = document.createElement("div");
            noteElement.className = "note";
            noteElement.textContent = `Note ${index + 1}: ${note.content}`;
            this.notesDisplay.appendChild(noteElement);
        });
    }

    updateLastRetrievedTime() {
        if (this.lastRetrievedTime) {
            const now = new Date().toLocaleTimeString();
            this.lastRetrievedTime.innerHTML = `Last Retrieved: ${now}`;
        } else {
            console.error("Last retrieved time element not found!");
        }
    }

    initialize() {
        // Mock fetch notes from localStorage
        const fetchNotes = () => {
            const notes = JSON.parse(localStorage.getItem("notes")) || [];
            this.renderNotes(notes);
            this.updateLastRetrievedTime();
        };

        // Fetch notes initially and every 2 seconds
        fetchNotes();
        setInterval(fetchNotes, 2000);

        // Back button event listener
        const backButton = document.getElementById("back-btn");
        if (backButton) {
            backButton.addEventListener("click", () => {
                location.href = "../index.html";
            });
        } else {
            console.error("Back button element not found!");
        }
    }
}

// Initialize the UI Manager
document.addEventListener("DOMContentLoaded", () => {
    const uiManager = new ReaderUIManager();
    uiManager.initialize();
});
