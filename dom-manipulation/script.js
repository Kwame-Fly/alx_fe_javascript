// Initialize quotes array
let quotes = [];

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById('quoteDisplay').innerHTML = "<p>No quotes available. Please add some!</p>";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
        <p>"${quotes[randomIndex].text}"</p>
        <p><em>— ${quotes[randomIndex].category}</em></p>
    `;
    // Save last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quotes[randomIndex]));
}

// Function to add a new quote to the array and update the display
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        saveQuotes();
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
    } else {
        alert('Please fill in both fields.');
    }
}

// Function to export quotes to a JSON file
function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
        showRandomQuote();  // Optionally show a random quote after import
    };
    fileReader.readAsText(event.target.files[0]);
}

// Function to create and display the add quote form
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuote">Add Quote</button>
        <button id="exportQuotes">Export Quotes</button>
        <input type="file" id="importFile" accept=".json" onchange="importFromJsonFile(event)" />
    `;
    
    document.body.appendChild(formContainer);

    // Add event listeners
    document.getElementById('addQuote').addEventListener('click', addQuote);
    document.getElementById('exportQuotes').addEventListener('click', exportQuotes);
}

// Initialize by loading quotes, displaying a random quote, and creating the add quote form
loadQuotes();
showRandomQuote();
createAddQuoteForm();
