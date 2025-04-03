function createCryptogram() {
    const input = document.getElementById('cryptogram-input').value.trim();
    if (!input) {
        alert('Please enter some text for the cryptogram');
        return;
    }

    const puzzleSection = document.getElementById('puzzle-section');
    puzzleSection.innerHTML = '';

    // Split input into words and create word groups
    const words = input.split(' ');
    words.forEach(word => {
        const wordGroup = document.createElement('div');
        wordGroup.className = 'word-group';

        // Create letter groups for each character in the word
        word.split('').forEach(letter => {
            const letterGroup = document.createElement('div');
            letterGroup.className = 'letter-group';

            // Display encrypted letter
            const encryptedSpan = document.createElement('span');
            encryptedSpan.className = 'encrypted-letter';
            encryptedSpan.textContent = letter;
            letterGroup.appendChild(encryptedSpan);

            // Create input for solution
            const solutionInput = document.createElement('input');
            solutionInput.type = 'text';
            solutionInput.className = 'solution-input';
            solutionInput.maxLength = 1;
            solutionInput.dataset.letter = letter;

            // Add event listeners
            solutionInput.addEventListener('input', (e) => handleInput(e, letter));
            solutionInput.addEventListener('keydown', handleKeyDown);

            letterGroup.appendChild(solutionInput);
            wordGroup.appendChild(letterGroup);
        });

        puzzleSection.appendChild(wordGroup);
    });

    // Focus on first input
    const firstInput = puzzleSection.querySelector('.solution-input');
    if (firstInput) {
        firstInput.focus();
    }
}

function handleInput(event, encryptedLetter) {
    const input = event.target;
    const value = input.value.toLowerCase();

    // Only allow letters
    if (value && !/^[a-z]$/.test(value)) {
        input.value = '';
        return;
    }

    // Update all matching letters
    const allInputs = document.querySelectorAll('.solution-input');
    allInputs.forEach(inp => {
        if (inp.dataset.letter === encryptedLetter) {
            inp.value = value;
        }
    });

    // Move to next input if a letter was entered
    if (value) {
        const allInputsArray = Array.from(allInputs);
        const currentIndex = allInputsArray.indexOf(input);
        const nextInput = allInputsArray[currentIndex + 1];
        if (nextInput) {
            nextInput.focus();
        }
    }
}

function handleKeyDown(event) {
    if (event.key === 'Backspace' && !event.target.value) {
        // Move to previous input on backspace if current input is empty
        const allInputs = Array.from(document.querySelectorAll('.solution-input'));
        const currentIndex = allInputs.indexOf(event.target);
        const prevInput = allInputs[currentIndex - 1];
        if (prevInput) {
            prevInput.focus();
            prevInput.value = '';
            // Also clear any other inputs with the same encrypted letter
            const encryptedLetter = prevInput.dataset.letter;
            allInputs.forEach(inp => {
                if (inp.dataset.letter === encryptedLetter) {
                    inp.value = '';
                }
            });
        }
    }
}