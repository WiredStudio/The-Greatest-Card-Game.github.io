// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize dark mode first
    setupDarkMode();
    
    // Then setup search functionality
    setupSearch();
    
    // Then setup back button
    setupBackButton();
    
    // Check URL hash for card view
    if (window.location.hash.startsWith('#card-')) {
        const cardId = window.location.hash.replace('#card-', '');
        showCardDetails(cardId);
    }
});

// Dark Mode Functionality
function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    
    // Check for saved preference
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '🌞';
    }
    
    // Toggle functionality
    darkModeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        const isDarkMode = body.classList.contains('dark-mode');
        
        // Update icon and save preference
        darkModeToggle.textContent = isDarkMode ? '🌞' : '🌓';
        localStorage.setItem('darkMode', isDarkMode ? 'enabled' : 'disabled');
    });
}

// Search Functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const autocompleteResults = document.getElementById('autocompleteResults');
    
    if (!searchInput || !autocompleteResults) return;
    
    // Card database - will be replaced if database.json loads
    window.cardDatabase = window.cardDatabase || [
        {
            id: "goomba",
            name: "Goomba",
            type: "Common Creature",
            description: "A small mushroom creature",
            image: "Images/goomba.png",
            stats: {
                attack: 1,
                defense: 1,
                cost: 1
            },
            rules: [
                "Can attack the turn it's played",
                "When defeated, opponent gains 1 PT"
            ]
        },
        {
            id: "baseline-earth",
            name: "Baseline Earth", 
            type: "Terrain",
            description: "Fundamental earth element",
            image: "Images/earth.png",
            stats: {
                defense: 3,
                cost: 2
            },
            rules: [
                "Permanent card",
                "Provides +1 defense to adjacent units"
            ]
        }
    ];
    
    // Handle search input
    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase();
        if (query.length === 0) {
            autocompleteResults.style.display = 'none';
            return;
        }
        
        const results = window.cardDatabase.filter(card => 
            card.name.toLowerCase().includes(query)
        );
        
        displayResults(results);
    });
    
    // Display search results
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
                item.addEventListener('click', function() {
                    showCardDetails(card.id);
                    window.location.hash = `card-${card.id}`;
                });
                autocompleteResults.appendChild(item);
            });
        }
        autocompleteResults.style.display = 'block';
    }
    
    // Hide results when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !autocompleteResults.contains(e.target)) {
            autocompleteResults.style.display = 'none';
        }
    });
}

// Show card details
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
    
    backButton.addEventListener('click', function() {
        document.getElementById('searchSection').style.display = 'block';
        document.getElementById('rulesSection').style.display = 'block';
        document.getElementById('cardDetailContainer').style.display = 'none';
        window.location.hash = '';
        document.getElementById('searchInput').value = '';
        document.getElementById('autocompleteResults').style.display = 'none';
    });
}

// Try to load database.json
fetch('database.json')
    .then(response => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json();
    })
    .then(data => {
        window.cardDatabase = data.cards || data;
    })
    .catch(error => {
        console.log("Using fallback card data:", error);
    });
