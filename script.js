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

    // --- Simplified Game Logic ---
    const startGameButton = document.getElementById('startGameButton');
    const gamePlayArea = document.getElementById('gamePlayArea');
    const heartCountSpan = document.getElementById('heartCount');
    const collectButtons = document.querySelectorAll('.collect-btn');
    const gameCompletePopup = document.getElementById('gameCompletePopup');

    let heartCount = 0;
    const goal = 20;

    // Show the game buttons when the "Click to play" button is pressed
    startGameButton.addEventListener('click', () => {
        gamePlayArea.classList.remove('hidden');
        startGameButton.classList.add('hidden');
    });

    // Handle collecting items (hearts and bonuses)
    collectButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (heartCount < goal) {
                const value = parseInt(button.getAttribute('data-value'));
                
                // Add the value to the count
                heartCount += value;
                
                // Ensure count doesn't exceed the goal unnecessarily for display
                if (heartCount > goal) {
                    heartCount = goal;
                }

                // Update the display
                heartCountSpan.textContent = heartCount;

                // Check for win condition
                if (heartCount >= goal) {
                    // Force the counter to show 20/20 at the moment of winning
                    heartCountSpan.textContent = goal;
                    
                    // Show the final message
                    gameCompletePopup.classList.remove('hidden');

                    // Optional: disable buttons after winning
                    collectButtons.forEach(btn => btn.disabled = true);
                }
            }
        });
    });

});
