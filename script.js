document.addEventListener('DOMContentLoaded', () => {
    // --- Envelope Interaction ---
    const envelopeContainer = document.getElementById('envelope-container');
    const envelope = document.getElementById('envelope');
    
    envelopeContainer.addEventListener('click', () => {
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            envelopeContainer.classList.add('opened');
        }
    });

    // --- Dynamic Falling Game Logic (Basket Movement & Collection) ---
    const startGameButton = document.getElementById('startGameButton');
    const gamePlayArea = document.getElementById('gamePlayArea');
    const fallingArea = document.getElementById('fallingArea');
    const basket = document.getElementById('basket');
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

    const BASKET_CATCH_AREA = 40; // Pixels distance from basket center to catch item

    // --- Core Game Functions ---
    function updateScore(value) {
        heartCount += value;
        
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
        heartCountSpan.textContent = goal;
        
        document.querySelectorAll('.falling-item').forEach(item => item.remove());
        
        // Remove event listeners for basket movement
        fallingArea.removeEventListener('mousemove', moveBasket);
        fallingArea.removeEventListener('touchmove', moveBasketTouch);
        
        gameCompletePopup.classList.remove('hidden');
    }

    function createFallingItem() {
        const isHeart = Math.random() < 0.7;
        let itemData;

        if (isHeart) {
            itemData = ITEMS[0]; 
        } else {
            const bonusIndex = Math.floor(Math.random() * (ITEMS.length - 1)) + 1;
            itemData = ITEMS[bonusIndex];
        }

        const item = document.createElement('div');
        item.textContent = itemData.symbol;
        item.classList.add('falling-item');
        item.dataset.value = itemData.value;
        
        const leftPos = Math.random() * (fallingArea.clientWidth - 30) + 15; // Set left position in pixels
        item.style.left = `${leftPos}px`;
        
        const duration = itemData.duration / 1000 + (Math.random() * 0.5); 
        item.style.animationDuration = `${duration}s`;

        // Check for catch condition every animation frame
        let checkInterval = setInterval(() => {
            if (!isGameActive || heartCount >= goal) {
                clearInterval(checkInterval);
                return;
            }

            const itemRect = item.getBoundingClientRect();
            const basketRect = basket.getBoundingClientRect();

            // Calculate item's center point
            const itemCenter = itemRect.left + itemRect.width / 2;
            
            // Check if item has reached the basket height
            const isAtBasketLevel = itemRect.bottom >= basketRect.top;

            // Check if item is horizontally aligned with the basket
            const isHorizontallyAligned = itemCenter >= basketRect.left && itemCenter <= basketRect.right;

            if (isAtBasketLevel && isHorizontallyAligned) {
                updateScore(itemData.value);
                item.remove();
                clearInterval(checkInterval);
            }

            // Remove item and clear interval if it falls past the bottom
            if (itemRect.top > fallingArea.clientHeight) {
                item.remove();
                clearInterval(checkInterval);
            }

        }, 50); // Check 20 times per second

        fallingArea.appendChild(item);
    }
    
    // --- Basket Movement Handlers ---
    function moveBasket(e) {
        if (!isGameActive) return;

        // Calculate mouse X position relative to the fallingArea
        const fallingAreaRect = fallingArea.getBoundingClientRect();
        let mouseX = e.clientX - fallingAreaRect.left;

        // Calculate the maximum basket movement range
        const basketWidth = basket.clientWidth;
        const maxLeft = fallingAreaRect.width - basketWidth / 2;
        const minLeft = basketWidth / 2;

        // Constrain the basket position to stay within the area
        let newX = Math.min(Math.max(mouseX, minLeft), maxLeft);
        
        // Set the basket's position relative to its center point
        basket.style.left = `${newX}px`;
    }
    
    function moveBasketTouch(e) {
        if (e.touches && e.touches.length > 0) {
            // Prevent scrolling on mobile when moving basket
            e.preventDefault(); 
            moveBasket({ clientX: e.touches[0].clientX });
        }
    }


    function startGame() {
        if (isGameActive) return;
        
        isGameActive = true;
        gamePlayArea.classList.remove('hidden');
        startGameButton.classList.add('hidden');
        
        // Add event listeners for basket movement
        fallingArea.addEventListener('mousemove', moveBasket);
        fallingArea.addEventListener('touchmove', moveBasketTouch);
        
        // Start generating items
        gameInterval = setInterval(createFallingItem, 1000 + Math.random() * 500);
    }

    // Event listener to start the game
    startGameButton.addEventListener('click', startGame);
});
