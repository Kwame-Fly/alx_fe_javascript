// Sample array of quote objects
const quotes = [
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "Motivation" },
    { text: "The purpose of our lives is to be happy.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Get busy living or get busy dying.", category: "Motivation" },
];

// Function to display a random quote
function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `
        <p>"${quotes[randomIndex].text}"</p>
        <p><em>— ${quotes[randomIndex].category}</em></p>
    `;
}

// Function to add a new quote to the array and update the display
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText && quoteCategory) {
        quotes.push({ text: quoteText, category: quoteCategory });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
    } else {
        alert('Please fill in both fields.');
    }
}

// Event listener for the button to show a new quote
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for the button to add a new quote
document.getElementById('addQuote').addEventListener('click', addQuote);

// Initialize by displaying a random quote
showRandomQuote();
