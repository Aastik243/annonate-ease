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
  restoreHighlights();

});

function saveHighlightToStorage(highlight) {
  chrome.storage.local.get('highlights', (result) => {
    const highlights = result.highlights || [];
    highlights.push({
      color: highlight.style.backgroundColor,
      text: highlight.innerHTML,
      parentPath: getElementPath(highlight.parentNode),// Save parent HTML
      offset: Array.from(highlight.parentNode.childNodes).indexOf(highlight)
    });
    chrome.storage.local.set({ highlights }, () => {
      console.log('Highlight saved:', highlights);
    });
  });
  
}

function restoreHighlights() {
  chrome.storage.local.get('highlights', (result) => {
    const highlights = result.highlights || [];
    highlights.forEach(highlight => {
      const parent = getElementByPath(highlight.parentPath);
      if (parent) {
        const span = document.createElement('span');
        span.style.backgroundColor = highlight.color;
        span.innerHTML = highlight.text;
        
        const referenceNode = parent.childNodes[highlight.offset];
        parent.insertBefore(span, referenceNode);
      }
    });
  });
}


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
      span.innerHTML = selection.toString();
      range.surroundContents(span);

      saveHighlightToStorage(span);
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

  // Helper function to get the element path
  function getElementPath(element) {
    const path = [];
    while (element && element !== document.body) {  // Ensure the loop stops at the body
      const parent = element.parentNode;
      const index = Array.from(parent.childNodes).indexOf(element);
      path.unshift(index);
      element = parent;
    }
    return path;
  }

// Helper function to get an element by its path
function getElementByPath(path) {
  if (!Array.isArray(path)) {
    console.error('Invalid path:', path);
    return null;
  }
  
  let element = document.body;
  for (const index of path) {
    if (element.childNodes[index]) {
      element = element.childNodes[index];
    } else {
      console.error('Invalid index in path:', index);
      return null;  // Return null if the path is invalid
    }
  }
  return element;
}




// Listen for messages from the popup script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'exportToPDF') {
    console.log("message received");
   // Generate PDF
    generatePDF()
      .then(() => {
        // Send success response
        sendResponse({ success: true });
      })
      .catch(error => {
        // Send error response
        sendResponse({ success: false, error: error.message });
      });
    
    // Indicate that sendResponse will be used asynchronously
    return true;
  }
});

// Function to generate PDF
function generatePDF() {
  return new Promise((resolve, reject) => {
    // PDF generation logic
    const element = document.body; // Select the whole body
    const opt = {
      margin: 1,
      filename: 'webpage_with_notes.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    // Use html2pdf to generate PDF from the current webpage
    html2pdf().set(opt).from(element).save()
      .then(() => {
        // Resolve the promise on successful PDF generation
        resolve();
      })
      .catch(error => {
        // Reject the promise if PDF generation fails
        reject(error);
      });
  });
}


  

  function call(){
    alert("Hello");
  }
