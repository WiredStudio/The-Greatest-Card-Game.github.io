<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Greatest Card Game</title>
    <style>
        :root {
            --bg-color: #f5f5f5;
            --text-color: #333;
            --header-bg: #ffffff;
            --card-bg: #ffffff;
            --border-color: #ddd;
            --accent-color: #4CAF50;
            --shadow-color: rgba(0,0,0,0.1);
            --rule-category-color: #2c3e50;
            --link-color: #3498db;
            --search-bg: rgba(255,255,255,0.9);
        }

        .dark-mode {
            --bg-color: #121212;
            --text-color: #e0e0e0;
            --header-bg: #1e1e1e;
            --card-bg: #2d2d2d;
            --border-color: #444;
            --accent-color: #4CAF50;
            --shadow-color: rgba(0,0,0,0.3);
            --rule-category-color: #4CAF50;
            --link-color: #5d9cec;
            --search-bg: rgba(40,40,40,0.9);
        }

        body {
            font-family: Arial, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background-color: var(--bg-color);
            color: var(--text-color);
            line-height: 1.6;
            transition: background-color 0.3s, color 0.3s;
        }

        header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--accent-color);
            background-color: var(--header-bg);
            padding: 20px;
            border-radius: 8px;
            position: relative;
        }

        h1 {
            color: var(--rule-category-color);
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .container {
            display: flex;
            gap: 30px;
        }

        .search-section {
            flex: 1;
            min-width: 300px;
        }

        .rules-section {
            flex: 1;
            background: var(--card-bg);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px var(--shadow-color);
        }

        .search-container {
            position: relative;
            margin-bottom: 30px;
        }

        #searchInput {
            width: 90%;
            padding: 12px 20px;
            font-size: 16px;
            border: 2px solid var(--border-color);
            border-radius: 25px;
            outline: none;
            box-shadow: 0 2px 5px var(--shadow-color);
            background-color: var(--search-bg);
            color: var(--text-color);
            transition: all 0.3s;
        }

            #searchInput:focus {
                border-color: var(--accent-color);
            }

        #autocompleteResults {
            position: absolute;
            width: 100%;
            max-height: 300px;
            overflow-y: auto;
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 0 0 10px 10px;
            box-shadow: 0 4px 8px var(--shadow-color);
            z-index: 100;
            display: none;
        }

        .autocomplete-item {
            padding: 10px 20px;
            cursor: pointer;
            border-bottom: 1px solid var(--border-color);
            color: var(--text-color);
        }

            .autocomplete-item:hover {
                background-color: var(--bg-color);
            }

        .card-name {
            font-weight: bold;
        }

        .card-type {
            font-size: 0.8em;
            color: var(--text-color);
            opacity: 0.7;
            margin-left: 10px;
        }

        .no-results {
            padding: 10px 20px;
            color: var(--text-color);
            opacity: 0.7;
            font-style: italic;
        }

        h2 {
            color: var(--rule-category-color);
            margin-top: 0;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border-color);
        }

        .rules-list {
            list-style-type: none;
            padding: 0;
        }

            .rules-list li {
                padding: 8px 0;
                border-bottom: 1px solid var(--border-color);
            }

                .rules-list li:last-child {
                    border-bottom: none;
                }

        .rule-category {
            font-weight: bold;
            color: var(--rule-category-color);
            margin-top: 15px;
            display: block;
        }

        a {
            color: var(--link-color);
            text-decoration: none;
        }

            a:hover {
                text-decoration: underline;
            }

        .quick-info {
            background: var(--card-bg);
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px var(--shadow-color);
        }

        .dark-mode-toggle {
            position: absolute;
            top: 20px;
            right: 20px;
            background: none;
            border: none;
            font-size: 1.5em;
            cursor: pointer;
            color: var(--text-color);
            transition: transform 0.3s;
        }

            .dark-mode-toggle:hover {
                transform: scale(1.1);
            }

        @media (max-width: 768px) {
            .container {
                flex-direction: column;
            }

            header {
                padding-top: 50px;
            }

            .dark-mode-toggle {
                top: 15px;
                right: 15px;
            }
        }
    </style>
</head>
<body>
    <header>
        <button class="dark-mode-toggle" id="darkModeToggle">🌓</button>
        <h1>The Greatest Card Game</h1>
        <p>Search for cards and learn how to play</p>
    </header>

    <div class="container">
        <div class="search-section">
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Search for a card (e.g. Goomba, Earth...)" autocomplete="off">
                <div id="autocompleteResults"></div>
            </div>

            <div class="quick-info">
                <h3>Quick Game Info</h3>
                <ul>
                    <li><strong>Deck Size:</strong> 32 Cards</li>
                    <li><strong>Starting HP:</strong> 25 PHP</li>
                    <li><strong>Starting Hand:</strong> 5 Cards</li>
                    <li><strong>Cards Drawn/Turn:</strong> 2</li>
                </ul>
            </div>
        </div>

        <div class="rules-section">
            <h2>Game Rules</h2>

            <span class="rule-category">Game Setup</span>
            <ul class="rules-list">
                <li>Flip a coin to see who goes first</li>
                <li>Each player starts with 5 cards</li>
                <li>Playing deck is 32 cards with no duplicates</li>
            </ul>

            <span class="rule-category">Turn Structure</span>
            <ul class="rules-list">
                <li>Players draw 2 cards per turn</li>
                <li>Players gain 3 PT every turn (increases by 1 each turn, max 10 PT/turn)</li>
                <li>Players cannot attack on their first turn</li>
            </ul>

            <span class="rule-category">Gameplay</span>
            <ul class="rules-list">
                <li>Goal: Reduce opponent's PHP to 0</li>
                <li>Land is permanent</li>
                <li>If an object is both land and another card type, it can be played only as land</li>
                <li>Units cannot exceed one equipment (unless stated otherwise)</li>
                <li>You cannot damage the player if units are on board (unless stated otherwise)</li>
            </ul>

            <span class="rule-category">Special Rules</span>
            <ul class="rules-list">
                <li>If a number has a decimal, round up</li>
                <li>Making a noise is defined as a card requiring to say something</li>
                <li>No curse words (defined <a href="https://en.wiktionary.org/wiki/Category:English_swear_words" target="_blank">here</a>)</li>
                <li>No sexual comments (defined <a href="https://www.eeoc.gov/sexual-harassment" target="_blank">here</a>)</li>
            </ul>
        </div>
    </div>

    <script>
        // Dark Mode Toggle
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.body;

        // Check for saved user preference
        if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.textContent = '🌞';
        }

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

        // Card database
        const cardDatabase = [
        {
        id: "goomba",
        name: "Goomba",
        type: "Common Creature",
        description: "A small, brown mushroom-like creature. Weak but appears in large numbers.",
        stats: {
        attack: 1,
        defense: 1,
        cost: 1
        },
        image: "goomba.jpg"
        },
        {
        id: "baseline-earth",
        name: "Baseline Earth",
        type: "Terrain",
        description: "Fundamental earth element that provides stability and defense.",
        stats: {
        defense: 3,
        cost: 2
        },
        image: "earth.jpg"
        }
        ];

        // Search functionality
        document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('searchInput');
        const autocompleteResults = document.getElementById('autocompleteResults');

        function searchCards(query) {
        if (query.length < 1) {
        autocompleteResults.style.display = 'none';
        return [];
        }

        return cardDatabase.filter(card =>
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
        });
    </script>
</body>
</html>
