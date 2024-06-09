
    console.log("can you see me?");
    document.getElementById('exportButton').addEventListener('click', () => {
        console.log('Export button clicked'); // Log button click
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          console.log('Sending message to content script'); // Log before sending message
          chrome.tabs.sendMessage(tabs[0].id, { action: 'exportToPDF' }, (response) => {
            if (response && response.success) {
              console.log('PDF generation successful');
            } else {
              console.error('PDF generation failed', response ? response.error : 'No response');
            }
          });
        });
      });
 
  
  