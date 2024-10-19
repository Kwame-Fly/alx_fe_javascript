let quotes = [];

// Mock API URL for simulation
const apiUrl = 'https://jsonplaceholder.typicode.com/posts'; // Replace with your own server or mock API if needed

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

// Fetch quotes from the simulated server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Simulate quote structure
        const serverQuotes = data.map(item => ({
            text: item.title,
            category: "General" // Assign a default category for simulation
        }));
        return serverQuotes;
    } catch (error) {
        console.error("Error fetching data from server:", error);
        return [];
    }
}

// Sync local quotes with server quotes
async function syncQuotes() {
    const serverQuotes = await fetchQuotesFromServer();
    if (serverQuotes.length > 0) {
        const mergedQuotes = mergeQuotes(quotes, serverQuotes);
        quotes = mergedQuotes;
        saveQuotes();
        alert('Quotes synced with server!'); // Added alert for sync success
        filterQuotes(); // Update displayed quotes
    }
}

// Merge local quotes with server quotes
function mergeQuotes(localQuotes, serverQuotes) {
    const quoteMap = new Map();

    // Add local quotes to map
    localQuotes.forEach(quote => quoteMap.set(quote.text, quote));

    // Add server quotes to map, replacing any existing ones
    serverQuotes.forEach(quote => quoteMap.set(quote.text, quote));

    return Array.from(quoteMap.values());
}

// Populate categories in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = new Set(quotes.map(quote => quote.category));
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
    
    // Load last selected category from local storage
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory');
    if (lastSelectedCategory) {
        categoryFilter.value = lastSelectedCategory;
    }
}

// Function to display quotes based on selected category
function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(quote => quote.category === selectedCategory);
    
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = filteredQuotes.length > 0 
        ? filteredQuotes.map(q => `<p>"${q.text}"</p><p><em>— ${q.category}</em></p>`).join('')
        : '<p>No quotes available in this category.</p>';

    // Save last selected category to local storage
    localStorage.setItem('lastSelectedCategory', selectedCategory);
}

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
        <p>"${quotes[randomIndex].text}"</p>
        <p><em>— ${quotes[randomIndex].category}</em></p>
    `;
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quotes[randomIndex]));
}

// Function to add a new quote
async function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        const newQuote = { text: quoteText, category: quoteCategory };
        
        // Save quote locally
        quotes.push(newQuote);
        saveQuotes();
        populateCategories();
        
        // Send new quote to server
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newQuote)
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            console.error("Error posting quote to server:", error);
        }

        // Reset input fields
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
        filterQuotes();
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
        populateCategories(); // Update categories
        alert('Quotes imported successfully!');
        filterQuotes(); // Update displayed quotes
    };
    fileReader.readAsText(event.target.files[0]);
}

// Initialize the application
loadQuotes();
populateCategories(); // Populate categories on load
filterQuotes(); // Display quotes based on the selected category
createAddQuoteForm();

// Periodically sync quotes with the server every 60 seconds
setInterval(syncQuotes, 60000);

