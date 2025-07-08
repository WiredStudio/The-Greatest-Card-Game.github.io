// Shared functions between pages
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

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const autocompleteResults = document.getElementById('autocompleteResults');
    
    if (!searchInput || !autocompleteResults) return;
    
    function searchCards(query) {
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
        
        if (results.length === 0) {
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
                    window.location.href = `card.html?id=${card.id}`;
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
