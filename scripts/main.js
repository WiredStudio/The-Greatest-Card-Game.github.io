// ======================
// CARD DATABASE HANDLING
// ======================

// Fallback card data
const fallbackCards = [
    {
        id: "goomba",
        name: "Goomba",
        type: "Common Creature",
        description: "A small, brown mushroom-like creature. Weak but appears in large numbers. (Fallback Data)",
        stats: {
        },
        image: "Images/goomba.png",
    },
    {
        id: "baseline-earth",
        name: "Baseline Earth",
        type: "Terrain",
        description: "Fundamental earth element that provides stability and defense. (Fallback Data)",
        stats: {
        },
        image: "Images/earth.png",
    }
];

// Load database.json or use fallback
async function loadCardDatabase() {
    try {
        const response = await fetch('./database.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        // Handle different JSON structures
        return Array.isArray(data) ? data : data.cards || fallbackCards;
    } catch (error) {
        console.warn("Using fallback card data:", error);
        return fallbackCards;
    }
}

// =================
// DARK MODE HANDLING
// =================

function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Initialize from localStorage
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '🌞';
    } else {
        darkModeToggle.textContent = '<img src="./Images/Drill.gif">';
    }
    
    // Toggle functionality
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        
        // Update UI and save preference
        darkModeToggle.textContent = isDarkMode ? '🌞' : '🌓';
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    });
}

// =================
// SEARCH FUNCTIONALITY
// =================

function setupSearch(cardDatabase) {
    const searchInput = document.getElementById('searchInput');
    const autocompleteResults = document.getElementById('autocompleteResults');
    
    function searchCards(query) {
        if (!query) return [];
        const queryLower = query.toLowerCase();
        
        return cardDatabase.filter(card => 
            card.name.toLowerCase().includes(queryLower) ||
            (card.description && card.description.toLowerCase().includes(queryLower)) ||
            (card.type && card.type.toLowerCase().includes(queryLower))
        ).sort((a, b) => a.name.localeCompare(b.name));
    }
    
    function displayResults(results) {
        autocompleteResults.innerHTML = '';
        
        if (results.length === 0) {
            autocompleteResults.innerHTML = '<div class="no-results">No cards found</div>';
            autocompleteResults.style.display = 'block';
        } else {
            results.forEach(card => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.innerHTML = `
                    <span class="card-name">${card.name}</span>
                    <span class="card-type">${card.type}</span>
                `;
                item.addEventListener('click', () => {
                    showCardDetails(card);
                    window.location.hash = `card-${card.id}`;
                });
                autocompleteResults.appendChild(item);
            });
            autocompleteResults.style.display = 'block';
        }
    }
    
    // Event listeners
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim();
        if (!query) {
            autocompleteResults.style.display = 'none';
            return;
        }
        displayResults(searchCards(query));
    });
    
    document.addEventListener('click', (e) => {
        if (!autocompleteResults.contains(e.target) && e.target !== searchInput) {
            autocompleteResults.style.display = 'none';
        }
    });
    
    // Allow keyboard navigation
    searchInput.addEventListener('keydown', (e) => {
        const items = autocompleteResults.querySelectorAll('.autocomplete-item');
        if (!items.length) return;
        
        let currentIndex = -1;
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = 0;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = items.length - 1;
        } else if (e.key === 'Enter' && items.length > 0) {
            e.preventDefault();
            items[0].click();
            return;
        }
        
        if (currentIndex > -1) {
            items[currentIndex].focus();
        }
    });
}

// =====================
// CARD DETAILS DISPLAY
// =====================

function showCardDetails(card) {
    // Hide search/show card view
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('rulesSection').style.display = 'none';
    document.getElementById('cardDetailContainer').style.display = 'block';
    
    // Generate stats HTML if they exist
    let statsHTML = '';
    if (card.stats && Object.keys(card.stats).length > 0) {
        statsHTML = `
            <div class="card-stats">
                ${Object.entries(card.stats).map(([key, value]) => `
                    <div class="stat">
                        <div class="stat-label">${key.toUpperCase()}</div>
                        <div class="stat-value">${value}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Create image URL with fallback
    let imageUrl = card.image || '';
    if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('data:')) {
        // Handle relative paths
        imageUrl = imageUrl.startsWith('/') ? imageUrl : `./${imageUrl}`;
    }
    
    // Display the card
    const placeholder = 'https://via.placeholder.com/200x280?text=Card+Image';
    document.getElementById('cardDetails').innerHTML = `
        <div class="card-header">
            <img src="${imageUrl}" alt="${card.name}" class="card-image" 
                 onerror="this.src='${placeholder}'">
            <div>
                <h1 class="card-title">${card.name}</h1>
                <span class="card-type">${card.type}</span>
                ${statsHTML}
            </div>
        </div>
        <div class="card-description">
            <p>${card.description || 'No description available'}</p>
        </div>
    `;
}

// ================
// BACK BUTTON LOGIC
// ================

function setupBackButton() {
    document.getElementById('backButton').addEventListener('click', () => {
        // Show search/hide card view
        document.getElementById('searchSection').style.display = 'block';
        document.getElementById('rulesSection').style.display = 'block';
        document.getElementById('cardDetailContainer').style.display = 'none';
        
        // Reset URL and search
        window.location.hash = '';
        document.getElementById('searchInput').value = '';
        document.getElementById('autocompleteResults').style.display = 'none';
    });
}

// ================
// INITIALIZATION
// ================

async function initializeApp() {
    // Load cards first
    const cards = await loadCardDatabase();
    console.log(`Loaded ${cards.length} cards from database`);
    
    // Then setup all functionality
    setupDarkMode();
    setupSearch(cards);
    setupBackButton();
    
    // Check for card in URL
    if (window.location.hash.startsWith('#card-')) {
        const cardId = window.location.hash.replace('#card-', '');
        const card = cards.find(c => c.id === cardId);
        if (card) {
            showCardDetails(card);
        } else {
            console.warn(`Card not found: ${cardId}`);
        }
    }
    
    // Handle direct card links when hash changes
    window.addEventListener('hashchange', () => {
        if (window.location.hash.startsWith('#card-')) {
            const cardId = window.location.hash.replace('#card-', '');
            const card = cards.find(c => c.id === cardId);
            if (card) showCardDetails(card);
        } else {
            // Show main view when hash is empty
            document.getElementById('searchSection').style.display = 'block';
            document.getElementById('rulesSection').style.display = 'block';
            document.getElementById('cardDetailContainer').style.display = 'none';
        }
    });
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
