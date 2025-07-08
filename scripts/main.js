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
        if (!response.ok) throw new Error("Failed to fetch database");
        const data = await response.json();
        return data.cards || data; // Handle both {cards:[]} and direct array formats
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
        return cardDatabase.filter(card => 
            card.name.toLowerCase().includes(query.toLowerCase())
        ).sort((a, b) => a.name.localeCompare(b.name));
    }
    
    function displayResults(results) {
        autocompleteResults.innerHTML = '';
        
        if (results.length === 0) {
            autocompleteResults.innerHTML = '<div class="no-results">No cards found</div>';
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
        }
        autocompleteResults.style.display = 'block';
    }
    
    // Event listeners
    searchInput.addEventListener('input', () => {
        displayResults(searchCards(searchInput.value.trim()));
    });
    
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) {
            autocompleteResults.style.display = 'none';
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
    const statsHTML = card.stats ? `
        <div class="card-stats">
            ${Object.entries(card.stats).map(([key, value]) => `
                <div class="stat">
                    <div class="stat-label">${key}</div>
                    <div class="stat-value">${value}</div>
                </div>
            `).join('')}
        </div>
    ` : '';
    
    // Generate rules HTML if they exist
    const rulesHTML = card.rules?.length ? `
        <div class="card-rules">
            <h3>Special Rules</h3>
            <ul>
                ${card.rules.map(rule => `<li>${rule}</li>`).join('')}
            </ul>
        </div>
    ` : '';
    
    // Display the card
    document.getElementById('cardDetails').innerHTML = `
        <div class="card-header">
            <img src="${card.image}" alt="${card.name}" class="card-image" 
                 onerror="this.src='https://via.placeholder.com/200x280?text=Card+Image'">
            <div>
                <h1 class="card-title">${card.name}</h1>
                <span class="card-type">${card.type}</span>
                ${statsHTML}
            </div>
        </div>
        <div class="card-description">
            <p>${card.description}</p>
        </div>
        ${rulesHTML}
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
    
    // Then setup all functionality
    setupDarkMode();
    setupSearch(cards);
    setupBackButton();
    
    // Check for card in URL
    if (window.location.hash.startsWith('#card-')) {
        const cardId = window.location.hash.replace('#card-', '');
        const card = cards.find(c => c.id === cardId);
        if (card) showCardDetails(card);
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
