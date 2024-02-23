const API_KEY = "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";

async function getAISuggestion(note, noteItem) {
    const instruction = "Based on this note, provide a general and actionable suggestion that enhances its usefulness for typical daily tasks, without assuming or adding specific details not mentioned in the note:";
    const contentWithInstruction = `${instruction} ${note}`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: "You are a helpful assistant."
                }, {
                    role: "user",
                    content: contentWithInstruction
                }]
            })
        });
        const data = await response.json();
        if (response.ok && data.choices) {
            displaySuggestion(noteItem, data.choices[0].message.content);
        } else {
            displaySuggestion(noteItem, "Failed to get a suggestion, please try again.");
        }
    } catch (error) {
        console.error('Error fetching AI suggestion:', error);
        displaySuggestion(noteItem, "An error occurred while getting the AI suggestion.");
    }
}

async function organizeNotes(note, noteItem) {
    const instruction = "Organize the following text/notes to have better organization and fix all grammar and spelling mistakes:";
    const contentWithInstruction = `${instruction} ${note}`;

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-4",
                messages: [{
                    role: "system",
                    content: "You are an assistant that can organize notes and correct grammar."
                }, {
                    role: "user",
                    content: contentWithInstruction
                }]
            })
        });
        const data = await response.json();
        if (response.ok && data.choices) {
            displaySuggestion(noteItem, data.choices[0].message.content);
        } else {
            displaySuggestion(noteItem, "Failed to organize the text, please try again.");
        }
    } catch (error) {
        console.error('Error organizing the notes:', error);
        displaySuggestion(noteItem, "An error occurred while organizing the notes.");
    }
}

function addNote() {
    const noteInput = document.getElementById('noteInput');
    const noteText = noteInput.value.trim();
    if (noteText) {
        const notesList = document.getElementById('notesList');
        const noteItem = document.createElement('li');
        noteItem.className = 'note-item';

        const noteContent = document.createElement('span');
        noteContent.textContent = noteText;
        noteContent.className = 'note-content';
        noteItem.appendChild(noteContent);

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'note-buttons';

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.onclick = () => editNote(noteItem, noteContent);
        buttonContainer.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => deleteNote(noteItem);
        buttonContainer.appendChild(deleteButton);

        const suggestionButton = document.createElement('button');
        suggestionButton.textContent = 'Get AI Suggestion';
        suggestionButton.className = 'suggestion-button';
        suggestionButton.onclick = function(event) {
            event.stopPropagation();
            getAISuggestion(noteText, noteItem);
            suggestionButton.disabled = true;
        };
        buttonContainer.appendChild(suggestionButton);

        const organizeButton = document.createElement('button');
        organizeButton.textContent = 'Organize';
        organizeButton.className = 'organize-button';
        organizeButton.onclick = function(event) {
            event.stopPropagation();
            organizeNotes(noteText, noteItem);
            organizeButton.disabled = true;
        };
        buttonContainer.appendChild(organizeButton);

        noteItem.appendChild(buttonContainer);
        notesList.appendChild(noteItem);

        noteInput.value = '';
    }
}

function editNote(noteItem, noteContent) {
    const newNote = prompt('Edit your note:', noteContent.textContent);
    if (newNote !== null && newNote.trim() !== "") {
        noteContent.textContent = newNote;
    }
}

function deleteNote(noteItem) {
    if (confirm('Are you sure you want to delete this note?')) {
        noteItem.remove();
    }
}

function displaySuggestion(noteItem, suggestion) {
    let suggestionContainer = noteItem.querySelector('.ai-suggestion-container');
    if (!suggestionContainer) {
        suggestionContainer = document.createElement('div');
        suggestionContainer.className = 'ai-suggestion-container';
        noteItem.appendChild(suggestionContainer);
    } else {
        suggestionContainer.innerHTML = ''; // Clear previous suggestion if any
    }

    const suggestionText = document.createElement('p');
    suggestionText.className = 'ai-suggestion';
    suggestionText.textContent = suggestion;
    suggestionContainer.appendChild(suggestionText);

    const okButton = document.createElement('button');
    okButton.textContent = 'Ok';
    okButton.className = 'ok-button';
    okButton.onclick = function() {
        suggestionContainer.style.display = 'none'; // Hide the suggestion container
        noteItem.querySelector('.suggestion-button').disabled = false; // Enable the suggestion button again
    };
    suggestionContainer.appendChild(okButton);

    suggestionContainer.style.display = 'block'; // Make sure to display the container
}

function toggleNoteExpansion(noteItem) {
    if (noteItem.classList.contains('expanded')) {
        noteItem.classList.remove('expanded');
        noteItem.style.height = '50px'; // Collapse it
    } else {
        noteItem.classList.add('expanded');
        noteItem.style.height = `${noteItem.scrollHeight}px`; // Expand it
    }
}
document.getElementById('addNoteButton').onclick = addNote;