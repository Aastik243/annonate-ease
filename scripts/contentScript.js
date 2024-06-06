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
  

document.addEventListener('mouseup', function() {
    const selection = window.getSelection();
  //  const palette = document.getElementById('highlight-palette');
  
    if (selection.toString().length > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const palette = document.createElement('div');
    palette.id = 'highlight-palette';
    palette.className = 'highlight-palette';
    palette.innerHTML = `
      <button onclick="highlightText('yellow')" style="background-color: yellow;"></button>
      <button onclick="highlightText('green')" style="background-color: green;"></button>
      <button onclick="highlightText('blue')" style="background-color: blue;"></button>
      <button onclick="highlightText('red')" style="background-color: red;"></button>
      <button onclick="highlightText('pink')" style="background-color: pink;"></button>
    `;
    document.body.appendChild(palette);
  
      palette.style.top = `${rect.top + window.scrollY - 40}px`;
      palette.style.left = `${rect.left + window.scrollX}px`;
      palette.style.display = 'block';
    } else {
      palette.style.display = 'none';
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
    document.getElementById('highlight-palette').style.display = 'none';
  }
  