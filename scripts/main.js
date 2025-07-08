// scripts/main.js

// Initialize dark mode
function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved user preference
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        if (darkModeToggle) darkModeToggle.textContent = '🌞';
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDarkMode = body.classList.contains('dark-mode');
            
            if (isDarkMode) {
                darkModeToggle.textContent = '🌞';
                localStorage.setItem('darkMode', 'enabled');
            } else {
                darkModeToggle.textContent = '🌓';
                localStorage.setItem('darkMode', 'disabled');
            }
        });
    }
}

// Initialize search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const autocompleteResults = document.getElementById('autocompleteResults');
    
    if (!searchInput || !autocompleteResults) return;
    
    function searchCards(query) {
        if (!window.cardDatabase) return [];
        if (query.length < 1) {
            autocompleteResults.style.display = 'none';
            return [];
        }
        
        return window.cardDatabase.filter(card => 
            card.name.toLowerCase().includes(query.toLowerCase())
        ).sort((a, b) => a.name.localeCompare(b.name));
    }
    
    function displayResults(results) {
        autocompleteResults.innerHTML = '';
        
        if (!results || results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No cards found';
            autocompleteResults.appendChild(noResults);
        } else {
            results.forEach(card => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.innerHTML = `
                    <span class="card-name">${card.name}</span>
                    <span class="card-type">${card.type}</span>
                `;
                item.addEventListener('click', () => {
                    // Use hash-based navigation for GitHub Pages compatibility
                    window.location.href = `card.html#card-${card.id}`;
                });
                autocompleteResults.appendChild(item);
            });
        }
        
        autocompleteResults.style.display = 'block';
    }
    
    searchInput.addEventListener('input', () => {
        const results = searchCards(searchInput.value);
        displayResults(results);
    });
    
    searchInput.addEventListener('focus', () => {
        if (searchInput.value.length > 0) {
            const results = searchCards(searchInput.value);
            displayResults(results);
        }
    });
    
    document.addEventListener('click', (e) => {
        if (e.target !== searchInput && !autocompleteResults.contains(e.target)) {
            autocompleteResults.style.display = 'none';
        }
    });
    
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const firstResult = document.querySelector('.autocomplete-item');
            if (firstResult) {
                firstResult.click();
            }
        }
    });
}

// Display card details (used in card.html)
function displayCardDetails(card) {
    const cardDetails = document.getElementById('cardDetails');
    if (!cardDetails) return;
    
    let statsHTML = '';
    if (card.stats) {
        statsHTML = `
            <div class="card-stats">
                ${Object.entries(card.stats).map(([key, value]) => `
                    <div class="stat">
                        <div class="stat-label">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
                        <div class="stat-value">${value}</div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    let rulesHTML = '';
    if (card.rules && card.rules.length > 0) {
        rulesHTML = `
            <div class="card-rules">
                <h3>Special Rules</h3>
                <ul>
                    ${card.rules.map(rule => `<li>${rule}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    cardDetails.innerHTML = `
        <div class="card-header">
            <img src="${card.image}" alt="${card.name}" class="card-image" onerror="this.src='https://via.placeholder.com/200x280?text=Card+Image'">
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

// Initialize the card page (for card.html)
function initCardPage() {
    // Get card ID from URL hash
    const cardId = window.location.hash.replace('#card-', '');
    
    // First try to use the already loaded database
    if (window.cardDatabase) {
        const card = window.cardDatabase.find(c => c.id === cardId);
        if (card) {
            displayCardDetails(card);
            return;
        }
    }
    
    // If not found, try to load database.json
    fetch('database.json')
        .then(response => response.json())
        .then(data => {
            const card = data.cards.find(c => c.id === cardId);
            if (card) {
                displayCardDetails(card);
            } else {
                showCardError();
            }
        })
        .catch(error => {
            console.error('Error loading card data:', error);
            showCardError();
        });
}

function showCardError() {
    const cardDetails = document.getElementById('cardDetails');
    if (cardDetails) {
        cardDetails.innerHTML = `
            <h2>Card not found</h2>
            <p>Return to <a href="index.html">home page</a></p>
        `;
    }
}

// Initialize the app based on which page we're on
function initApp() {
    setupDarkMode();
    
    if (document.getElementById('searchInput')) {
        // We're on index.html
        setupSearch();
    } else if (document.getElementById('cardDetails')) {
        // We're on card.html
        initCardPage();
    }
}

// Start the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);

// Fallback card database if fetch fails
window.cardDatabase = window.cardDatabase || [
    {
        id: "goomba",
        name: "Goomba",
        type: "Common Creature",
        description: "",
        stats: {
        },
        image: "",
        rules: [
            "Can attack the turn it's played",
            "When defeated, opponent gains 1 PT"
        ]
    },
    {
        id: "baseline-earth",
        name: "Baseline Earth",
        type: "Terrain",
        description: "",
        stats: {
        },
        image: "",
        rules: [
            "Permanent card",
            "Provides +1 defense to adjacent units"
        ]
    }
];
