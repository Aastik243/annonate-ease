
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

    document.addEventListener('click', (event) => {
      if (event.target.id === 'delete-button') {
        const note = event.target.closest('.note-page');
        if (note) {
          note.remove();
          event.stopPropagation(); // Stop event propagation to prevent recreation of the note
        }
      }
    });
  
    document.body.appendChild(palette);

    

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

  document.addEventListener('click', (event) => {
    if (isShiftPressed) {

     const note = document.createElement('div');
    note.id = 'note-page';
    note.className = 'note-page';
    note.innerHTML = `
        <div class="header">
          <button id="delete-button">X</button>
        </div>
        <textarea></textarea>
    `;

     note.style.display = 'block';
     note.style.top = `${event.clientY}px`;
     note.style.left = `${event.clientX}px`;

     document.body.appendChild(note);

     isShiftPressed = false;
    }
  });
  
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
  
  

  function handleDelete() {
    const note = event.target.closest('.note-page');
    if (note) {
      note.remove();
      event.stopPropagation(); 
    }
  }


  function call(){
    alert("Hello");
  }
