// Initialize the application
function initApp() {
    setupDarkMode();
    setupSearch();
    setupBackButton();
    
    // Check URL hash for card view
    if (window.location.hash.startsWith('#card-')) {
        showCardDetails(window.location.hash.replace('#card-', ''));
    }
}

// Dark mode functionality
function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
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

// Search functionality
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
                    showCardDetails(card.id);
                    window.location.hash = `card-${card.id}`;
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
}

// Card detail view functionality
function showCardDetails(cardId) {
    const card = window.cardDatabase.find(c => c.id === cardId);
    if (!card) return;
    
    document.getElementById('searchSection').style.display = 'none';
    document.getElementById('rulesSection').style.display = 'none';
    document.getElementById('cardDetailContainer').style.display = 'block';
    
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
    
    document.getElementById('cardDetails').innerHTML = `
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

// Back button functionality
function setupBackButton() {
    const backButton = document.getElementById('backButton');
    if (!backButton) return;
    
    backButton.addEventListener('click', () => {
        document.getElementById('searchSection').style.display = 'block';
        document.getElementById('rulesSection').style.display = 'block';
        document.getElementById('cardDetailContainer').style.display = 'none';
        window.location.hash = '';
    });
}

// Fallback card database
window.cardDatabase = window.cardDatabase || [
    {
        id: "goomba",
        name: "Goomba",
        type: "Common Creature",
        description: "",
        stats: {
        },
        image: "Images/goomba.png",
    },
    {
        id: "baseline-earth",
        name: "Baseline Earth",
        type: "Terrain",
        description: "",
        stats: {
        },
        image: "Images/earth.png"
        ]
    }
];

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
