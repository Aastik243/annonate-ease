const palette = document.createElement('div');
    palette.id = 'highlight-palette';
    palette.className = 'highlight-palette';
    palette.innerHTML = `
      <button id="yellowButton" style="background-color: yellow;"></button>
      <button id="greenButton" style="background-color: green;"></button>
      <button id="blueButton" style="background-color: blue;"></button>
      <button id="redButton" style="background-color: red;"></button>
      <button id="pinkButton" style="background-color: pink;"></button>
    `;

    let isShiftPressed = false;


  // Load highlights and notes from storage
chrome.storage.local.get(['highlights', 'notes'], (result) => {
  const storedHighlights = result.highlights || [];
  const storedNotes = result.notes || [];
  
  // Apply stored highlights
  storedHighlights.forEach(highlight => {
    const range = document.createRange();
    range.setStart(highlight.startContainer, highlight.startOffset);
    range.setEnd(highlight.endContainer, highlight.endOffset);
    
    const span = document.createElement('span');
    span.style.backgroundColor = highlight.color;
    range.surroundContents(span);
  });
  
  // Apply stored notes
  storedNotes.forEach(note => {
    createNoteElement(note);
  });
});


    

    document.addEventListener('click', function(event) {
      if (event.target.matches('#yellowButton')) {
        highlightText('yellow');
      } else if (event.target.matches('#greenButton')) {
        highlightText('green');
      } else if (event.target.matches('#blueButton')) {
        highlightText('blue');
      } else if (event.target.matches('#redButton')) {
        highlightText('red');
      } else if (event.target.matches('#pinkButton')) {
        highlightText('pink');
      }
       
    });

    // document.addEventListener('click', (event) => {
    //   if (event.target.id === 'delete-button') {
    //     const note = event.target.closest('.note-page');
    //     if (note) {
    //       note.remove();
    //       removeNoteFromStorage(note);
    //       event.stopPropagation(); // Stop event propagation to prevent recreation of the note
    //     }
    //   }
    // });
  
    document.body.appendChild(palette);


    function handleDelete(event) {
      const note = event.target.closest('.note-page');
      if (note) {
        const noteId = parseInt(note.dataset.id);
    
        // Remove the note element from the DOM
        note.remove();
    
        removeNoteFromStorage(note);
    
        // Stop event propagation to prevent unintended behavior
        event.stopPropagation();
      }
    }

    

document.addEventListener('mouseup', function() {
    const selection = window.getSelection();
    
  
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      palette.style.top = `${rect.top + window.scrollY - 40}px`;
      palette.style.left = `${rect.left + window.scrollX}px`;
    
      palette.style.display = 'block';
    
    } else {
      palette.style.display = 'none';
    }
  });


  document.addEventListener('keydown', (event) => {
    if (event.key === 'Shift') {
      isShiftPressed = true;
    }
  });


  // Event listener for creating notes on Shift + click
document.addEventListener('click', (event) => {
  if (isShiftPressed) {
    const note = createNoteElement(event.clientY, event.clientX);
    saveNoteToStorage(note);

    isShiftPressed = false;

     note.querySelector('.delete-button').addEventListener('click', handleDelete)
    
  }
});

// Function to create a new note element
function createNoteElement(top, left) {
  const note = document.createElement('div');
  // note.id = 'note-' + Date.now();
  note.className = 'note-page';
  note.innerHTML = `
    <div class="header">
      <button class="delete-button">X</button>
    </div>
    <textarea></textarea>
  `;

  note.style.display = 'block';
  note.style.position = 'absolute';
  note.style.top = `${top}px`;
  note.style.left = `${left}px`;

  document.body.appendChild(note);
  return note;
}

// Function to save note id to Chrome Storage
function saveNoteToStorage(note) {
  chrome.storage.local.get('notes', (result) => {
    const notes = result.notes || [];
    const noteData = {
      id: Date.now(),
      top: note.style.top,
      left: note.style.left,
      text: note.querySelector('textarea').value,
      url: window.location.href 
    };
    notes.push(noteData);

    console.log(result.notes || []);
    chrome.storage.local.set({ 'notes': notes }, () => {
      console.log('Note saved:', noteData);
    });

    
});
}

function saveNotesToStorage() {
  const notes = [];
  document.querySelectorAll('.note-page').forEach(note => {
    notes.push({
      id: note.dataset.id,
      top: note.style.top,
      left: note.style.left,
      text: note.querySelector('textarea').value,
      url: window.location.href 
    });
  });
  chrome.storage.local.set({ notes }, () => {
    console.log('All notes saved:', notes);
  });
}

document.addEventListener('input', (event) => {
  if (event.target.closest('.note-page')) {
    saveNotesToStorage();
  }
});


// Function to restore notes from storage
function restoreNotes() {
  chrome.storage.local.get('notes', (result) => {
    const notes = result.notes || [];
    const currentUrl = window.location.href;
    console.log('Restoring notes:', notes);
    notes.filter(noteData => noteData.url === currentUrl).forEach(noteData => {
      const note = document.createElement('div');
      note.className = 'note-page';
      note.innerHTML = `
        <div class="header">
          <button class="delete-button">X</button>
        </div>
        <textarea>${noteData.text}</textarea>
      `;
      note.style.display = 'block';
      note.style.top = noteData.top;
      note.style.left = noteData.left;

      document.body.appendChild(note);
      

      note.querySelector('.delete-button').addEventListener('click', handleDelete);
    });
  });
}

// Function to remove note from storage
function removeNoteFromStorage(note) {
  chrome.storage.local.get('notes', (result) => {
    let notes = result.notes || [];
    const noteId = note.querySelector('textarea').value;
    notes = notes.filter(noteData => noteData.text !== noteId);
    chrome.storage.local.set({ 'notes': notes }, () => {
      console.log('Note removed:', noteId);
    });
  });
}

// Restore notes when the page loads
window.addEventListener("load", () => {
  restoreNotes();
});


  // document.addEventListener('click', (event) => {
  //   if (isShiftPressed) {

  //    const note = document.createElement('div');
  //   note.id = 'note-page';
  //   note.className = 'note-page';
  //   note.innerHTML = `
  //       <div class="header">
  //         <button id="delete-button">X</button>
  //       </div>
  //       <textarea></textarea>
  //   `;

  //    note.style.display = 'block';
  //    note.style.top = `${event.clientY}px`;
  //    note.style.left = `${event.clientX}px`;

  //    document.body.appendChild(note);

  //    isShiftPressed = false;
  //   }
  // });
  
  function highlightText(color) {
   
    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.backgroundColor = color;
      range.surroundContents(span);
    }
   
    palette.style.display = 'none';
  }
  
  

  // function handleDelete() {
  //   const note = event.target.closest('.note-page');
  //   if (note) {
  //     note.remove();
  //     removeNoteFromStorage(note);
  //     event.stopPropagation(); 
  //   }
  // }


  function call(){
    alert("Hello");
  }
