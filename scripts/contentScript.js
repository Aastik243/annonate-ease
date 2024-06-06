// document.addEventListener('DOMContentLoaded', function() {
//     // Create and append the highlight palette to the body
//     const palette = document.createElement('div');
//     palette.id = 'highlight-palette';
//     palette.className = 'highlight-palette';
//     palette.innerHTML = `
//       <button onclick="highlightText('yellow')" style="background-color: yellow;"></button>
//       <button onclick="highlightText('green')" style="background-color: green;"></button>
//       <button onclick="highlightText('blue')" style="background-color: blue;"></button>
//       <button onclick="highlightText('red')" style="background-color: red;"></button>
//       <button onclick="highlightText('pink')" style="background-color: pink;"></button>
//     `;
//     document.body.appendChild(palette);
//   });
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
  
  function highlightText(color) {
    // console.log("I am clicked");
    const selection = window.getSelection();
    if (selection.rangeCount) {
      const range = selection.getRangeAt(0);
      const span = document.createElement('span');
      span.style.backgroundColor = color;
      range.surroundContents(span);
    }
   // const elementToRemove = document.getElementById('highlight-palette');

    // if(elementToRemove){
    // elementToRemove.remove();
    // }
    palette.style.display = 'none';
  }
  
  function call(){
    alert("Hello");
  }
