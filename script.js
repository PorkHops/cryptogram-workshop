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
        const wordGroup           = document.createElement('div');
              wordGroup.className = 'word-group';

        // Create letter groups for each character in the word
        word.split('').forEach(letter => {
            const letterGroup           = document.createElement('div');
                  letterGroup.className = 'letter-group';

            // Display encrypted letter
            const encryptedSpan             = document.createElement('span');
                  encryptedSpan.className   = 'encrypted-letter';
                  encryptedSpan.textContent = letter;
            letterGroup.appendChild(encryptedSpan);

            // Check if the character is punctuation
            if (/[^a-zA-Z]/.test(letter)) {
                // For punctuation, just display it without an input box
                const punctuationSpan             = document.createElement('span');
                      punctuationSpan.className   = 'solution-punctuation';
                      punctuationSpan.textContent = letter;
                letterGroup.appendChild(punctuationSpan);
            } else {
                // Create input for solution (only for letters)
                const solutionInput                = document.createElement('input');
                      solutionInput.type           = 'text';
                      solutionInput.className      = 'solution-input';
                      solutionInput.maxLength      = 1;
                      solutionInput.dataset.letter = letter;

                solutionInput.addEventListener('input', (e) => handleInput(e, letter));
                solutionInput.addEventListener('keydown', handleKeyDown);
                solutionInput.addEventListener('focus', () => highlightMatching(letter));
                solutionInput.addEventListener('blur', removeHighlights);

                letterGroup.appendChild(solutionInput);
            }
            wordGroup.appendChild(letterGroup);
        });

        puzzleSection.appendChild(wordGroup);
    });

    const firstInput = puzzleSection.querySelector('.solution-input');
    if (firstInput) {
        firstInput.focus();
    }
}

function isLetterUsedElsewhere(letter, currentInput) {
    if (!letter) return false;

    const allInputs = document.querySelectorAll('.solution-input');
    for (const input of allInputs) {
        if (input !== currentInput && input.value.toLowerCase() === letter) {
            return input;
        }
    }
    return false;
}

function handleInput(event, encryptedLetter) {
    const input         = event.target;
    const value         = input.value.toLowerCase();
    const uniqueLetters = document.getElementById('unique-letters').checked;

    // Only allow letters
    if (value && !/^[a-z]$/.test(value)) {
        input.value = '';
        return;
    }

    if (uniqueLetters && value) {
        // Check if this letter is used elsewhere
        const existingInput = isLetterUsedElsewhere(value, input);
        if (existingInput) {
            // Clear the letter from its previous location
            const oldEncryptedLetter = existingInput.dataset.letter;
            const matchingInputs     = document.querySelectorAll('.solution-input');
            matchingInputs.forEach(inp => {
                if (inp.dataset.letter === oldEncryptedLetter) {
                    inp.value = '';
                }
            });
        }
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
        const currentIndex   = allInputsArray.indexOf(input);
        const nextInput      = allInputsArray[currentIndex + 1];
        if (nextInput) {
            nextInput.focus();
        }
    }
}

function highlightMatching(letter) {
    // Remove any existing highlights
    removeHighlights();

    // Add highlight to all inputs with matching letter
    const allInputs = document.querySelectorAll('.solution-input');
    allInputs.forEach(inp => {
        if (inp.dataset.letter === letter) {
            inp.classList.add('highlight');
        }
    });
}

function removeHighlights() {
    const allInputs = document.querySelectorAll('.solution-input');
    allInputs.forEach(inp => inp.classList.remove('highlight'));
}

function handleKeyDown(event) {
    if (event.key === 'Backspace' && !event.target.value) {
        // Move to previous input on backspace if current input is empty
        const allInputs    = Array.from(document.querySelectorAll('.solution-input'));
        const currentIndex = allInputs.indexOf(event.target);
        const prevInput    = allInputs[currentIndex - 1];
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