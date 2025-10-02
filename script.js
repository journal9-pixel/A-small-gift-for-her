document.addEventListener('DOMContentLoaded', () => {
    // --- Envelope Interaction ---
    const envelopeContainer = document.getElementById('envelope-container');
    const envelope = document.getElementById('envelope');
    
    envelopeContainer.addEventListener('click', () => {
        // Only open if it's not already open
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            envelopeContainer.classList.add('opened');
        }
    });

    // --- Dynamic Falling Game Logic ---
    const startGameButton = document.getElementById('startGameButton');
    const gamePlayArea = document.getElementById('gamePlayArea');
    const fallingArea = document.getElementById('fallingArea');
    const heartCountSpan = document.getElementById('heartCount');
    const gameCompletePopup = document.getElementById('gameCompletePopup');

    let heartCount = 0;
    const goal = 20;
    let gameInterval;
    let isGameActive = false;

    // Item Definitions: [symbol, value]
    const ITEMS = [
        { symbol: '❤️', value: 1, type: 'heart', duration: 3000 },
        { symbol: '🦇', value: 3, type: 'bonus-3', duration: 4000 },
        { symbol: '🦇', value: 4, type: 'bonus-4', duration: 4000 },
        { symbol: '🦇', value: 5, type: 'bonus-5', duration: 5000 },
    ];

    function updateScore(value) {
        heartCount += value;
        
        // Ensure the count stops visually at 20
        if (heartCount > goal) {
            heartCount = goal;
        }

        heartCountSpan.textContent = heartCount;

        if (heartCount >= goal && isGameActive) {
            endGame();
        }
    }

    function endGame() {
        clearInterval(gameInterval);
        isGameActive = false;
        heartCountSpan.textContent = goal; // Final display 20/20
        
        // Remove any remaining falling items
        document.querySelectorAll('.falling-item').forEach(item => item.remove());
        
        // Show the final message
        gameCompletePopup.classList.remove('hidden');
    }

    function createFallingItem() {
        // Randomly select an item: Hearts (index 0) are more common (70% chance)
        const isHeart = Math.random() < 0.7;
        let itemData;

        if (isHeart) {
            itemData = ITEMS[0]; 
        } else {
            // Randomly choose a bonus Batman (indices 1, 2, or 3)
            const bonusIndex = Math.floor(Math.random() * (ITEMS.length - 1)) + 1;
            itemData = ITEMS[bonusIndex];
        }

        const item = document.createElement('div');
        item.textContent = itemData.symbol;
        item.classList.add('falling-item');
        item.dataset.value = itemData.value;
        
        // Set random horizontal position
        const leftPos = Math.random() * 85 + 5; // 5% to 90% of the falling area width
        item.style.left = `${leftPos}%`;
        
        // Set animation duration
        const duration = itemData.duration / 1000 + (Math.random() * 0.5); // Adds a small random speed variance
        item.style.animationDuration = `${duration}s`;

        // Event listener for collecting the item
        item.addEventListener('click', function() {
            if (isGameActive && heartCount < goal) {
                updateScore(itemData.value);
                this.remove(); // Remove item on collection
            }
        });

        // Remove item when animation ends (it hits the bottom without being collected)
        item.addEventListener('animationend', function() {
            this.remove();
        });

        fallingArea.appendChild(item);
    }

    function startGame() {
        isGameActive = true;
        gamePlayArea.classList.remove('hidden');
        startGameButton.classList.add('hidden');
        
        // Start generating items every 1 to 1.5 seconds
        gameInterval = setInterval(createFallingItem, 1000 + Math.random() * 500);
    }

    // Event listener to start the game
    startGameButton.addEventListener('click', startGame);
});
