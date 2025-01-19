class ReaderUIManager {
    constructor() {
        // Initialize DOM elements for displaying notes and the last retrieved time
        this.notesDisplay = document.getElementById("notes-display");
        this.lastRetrievedTime = document.getElementById("last-retrieved-time");
    }

    /**
     * Renders a list of notes onto the UI.
     * @param {Array} notes - An array of note objects to display.
     */
    renderNotes(notes) {
        if (!this.notesDisplay) {
            // Log an error if the notes display element is not found
            console.error("Notes display element not found!");
            return;
        }

        // Clear any existing notes in the display element
        this.notesDisplay.innerHTML = "";

        // Dynamically create and append note elements to the display
        notes.forEach((note, index) => {
            const noteElement = document.createElement("div");
            noteElement.className = "note"; // Assign a class for styling
            noteElement.textContent = `Note ${index + 1}: ${note.content}`; // Add note content
            this.notesDisplay.appendChild(noteElement); // Append to the display
        });
    }

    /**
     * Updates the "last retrieved time" element with the current time.
     */
    updateLastRetrievedTime() {
        if (this.lastRetrievedTime) {
            // Get the current time in a localized format
            const now = new Date().toLocaleTimeString();
            // Update the inner HTML of the element
            this.lastRetrievedTime.innerHTML = `Last Retrieved: ${now}`;
        } else {
            // Log an error if the element is not found
            console.error("Last retrieved time element not found!");
        }
    }

    /**
     * Initializes the UI manager by setting up periodic note fetching
     * and attaching event listeners to UI elements.
     */
    initialize() {
        // Function to fetch notes from localStorage and render them
        const fetchNotes = () => {
            // Retrieve notes from localStorage (or use an empty array if none exist)
            const notes = JSON.parse(localStorage.getItem("notes")) || [];
            this.renderNotes(notes);
            this.updateLastRetrievedTime();
        };

        // Fetch notes initially and every 2 seconds
        fetchNotes();
        setInterval(fetchNotes, 2000);

        // Add a click event listener to the back button
        const backButton = document.getElementById("back-btn");
        if (backButton) {
            backButton.addEventListener("click", () => {
                location.href = "../index.html";
            });
        } else {
            // Log an error if the back button element is not found
            console.error("Back button element not found!");
        }
    }
}

// Wait for the DOM to load, then initialize the ReaderUIManager
document.addEventListener("DOMContentLoaded", () => {
    const uiManager = new ReaderUIManager();
    uiManager.initialize();
});
