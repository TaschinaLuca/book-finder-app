// Selectare elemente DOM
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const resultsArea = document.getElementById('resultsArea');

// URL-ul de bază pentru API
const BASE_URL = 'https://openlibrary.org';

// Funcție pentru căutarea cărților
async function searchBooks(query) {
    try {
        // Afișare indicator de încărcare
        resultsArea.innerHTML = '<div class="loading">Searching books...</div>';

        // Construire URL cu parametri de căutare
        const searchUrl = `${BASE_URL}/search.json?q=${encodeURIComponent(query)}`;
        const response = await fetch(searchUrl);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        if (data.docs && data.docs.length > 0) {
            displayResults(data.docs);
        } else {
            resultsArea.innerHTML = '<div class="no-results">No books found. Please try a different search.</div>';
        }
    } catch (error) {
        console.error('Error:', error);
        resultsArea.innerHTML = `
            <div class="error">
                <p>Sorry, something went wrong. Please try again later.</p>
                <p class="error-details">Error: ${error.message}</p>
            </div>`;
    }
}

// Funcție pentru afișarea rezultatelor
function displayResults(books) {
    // Curățare rezultate anterioare
    resultsArea.innerHTML = '';

    // Procesare și afișare fiecare carte
    books.forEach(book => {
        // Construire URL pentru copertă
        const coverUrl = book.cover_i 
            ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
            : 'https://via.placeholder.com/200x300?text=No+Cover+Available';

        // Creare element card pentru carte
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        
        // Adăugare conținut HTML pentru card
        bookCard.innerHTML = `
            <img class="book-cover" 
                src="${coverUrl}" 
                alt="${book.title}" 
                onerror="this.src='https://via.placeholder.com/200x300?text=No+Cover+Available'">
            <div class="book-info">
                <h2 class="book-title">${escapeHtml(book.title)}</h2>
                <p class="book-author">${
                    book.author_name 
                        ? escapeHtml(book.author_name.join(', '))
                        : 'Unknown Author'
                }</p>
                ${
                    book.first_publish_year 
                        ? `<p class="book-year">First published: ${book.first_publish_year}</p>`
                        : ''
                }
            </div>
        `;

        // Adăugare card în zona de rezultate
        resultsArea.appendChild(bookCard);
    });
}

// Funcție pentru escapare HTML (prevenire XSS)
function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Event listener pentru butonul de căutare
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        searchBooks(query);
    }
});

// Event listener pentru tastă Enter în input
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = searchInput.value.trim();
        if (query) {
            searchBooks(query);
        }
    }
});

// Adăugare stil pentru stările de loading și eroare
const style = document.createElement('style');
style.textContent = `
    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }

    .error {
        text-align: center;
        padding: 2rem;
        color: #d32f2f;
    }

    .error-details {
        font-size: 0.9rem;
        margin-top: 0.5rem;
        color: var(--text-secondary);
    }

    .no-results {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
    }
`;
document.head.appendChild(style);