// DOM Elements
const display = document.getElementById('display');
const calculator = document.getElementById('calculator');

// Calculator State
let currentInput = '0'; // Stores the current number being entered or the result of a previous operation
let operator = null; // Stores the active operator (+, -, *, /)
let firstOperand = null; // Stores the first number in an operation
let waitingForSecondOperand = false; // Flag to indicate if the next input should start a new number
let displayExpression = '0'; // This variable will hold the full expression to be shown on the display

// Initial display setup
display.textContent = displayExpression;

// Event Listeners for button clicks
calculator.addEventListener('click', (event) => {
    const { target } = event;
    if (!target.matches('button')) {
        return;
    }

    // Determine button type and call appropriate function
    if (target.classList.contains('number')) {
        appendNumber(target.textContent);
    } else if (target.classList.contains('operator')) {
        handleOperator(target.textContent);
    } else if (target.classList.contains('decimal')) {
        inputDecimal(target.textContent);
    } else if (target.classList.contains('clear')) {
        clearCalculator();
    } else if (target.classList.contains('equals')) {
        calculate();
    }
    // Always update the display after any button press
    updateDisplay();
});

// --- Calculator Logic Functions ---

/**
 * Updates the display with the current `displayExpression` value.
 */
function updateDisplay() {
    display.textContent = displayExpression;
}

/**
 * Appends a number to the `currentInput` and `displayExpression`.
 * Handles the `waitingForSecondOperand` state to start a new number.
 * @param {string} number - The number string to append.
 */
function appendNumber(number) {
    if (waitingForSecondOperand) {
        currentInput = number; // Start a new number for calculation
        displayExpression += number; // Corrected: Append the new number to the existing expression
        waitingForSecondOperand = false;
    } else {
        currentInput = currentInput === '0' ? number : currentInput + number;
        displayExpression = displayExpression === '0' ? number : displayExpression + number;
    }
}

/**
 * Handles decimal point input.
 * Ensures only one decimal point per number in both `currentInput` and `displayExpression`.
 * @param {string} dot - The decimal point character.
 */
function inputDecimal(dot) {
    if (waitingForSecondOperand) {
        currentInput = '0.';
        displayExpression += '0.'; // Append '0.' to the current expression
        waitingForSecondOperand = false;
        return;
    }

    // Check if the current number part (after the last operator, if any) already contains a decimal
    const parts = displayExpression.split(/[\+\-\*\/]/);
    const lastPart = parts[parts.length - 1];

    if (!lastPart.includes(dot)) {
        currentInput += dot;
        displayExpression += dot;
    }
}

/**
 * Handles operator input (+, -, *, /).
 * Manages the calculation of previous operations if an operator is pressed consecutively,
 * and updates `displayExpression` to show the operator.
 * @param {string} nextOperator - The operator string.
 */
function handleOperator(nextOperator) {
    const inputValue = parseFloat(currentInput);

    if (operator && waitingForSecondOperand) {
        // If an operator was already pressed and we're waiting for the second operand,
        // it means the user pressed a new operator immediately after the previous one.
        // Replace the last operator in the display expression.
        displayExpression = displayExpression.slice(0, -1) + nextOperator;
        operator = nextOperator; // Update the operator for calculation
        return;
    }

    if (firstOperand === null) {
        // If this is the first number in a new operation, store it
        firstOperand = inputValue;
    } else if (operator) {
        // If an operator was previously set, calculate the result
        const result = performCalculation[operator](firstOperand, inputValue);
        currentInput = String(parseFloat(result.toFixed(7))); // Limit decimal places for calculation
        firstOperand = result; // Store the result as the new first operand
    }

    // Add the operator to the display expression.
    // Ensure we don't append an operator if the display is 'Error' or if it's already ending with an operator
    if (displayExpression !== 'Error') {
        const lastChar = displayExpression.slice(-1);
        if (['+', '-', '*', '/'].includes(lastChar)) {
            displayExpression = displayExpression.slice(0, -1) + nextOperator; // Replace last operator
        } else {
            displayExpression += nextOperator;
        }
    }


    waitingForSecondOperand = true; // Set flag to expect a new number
    operator = nextOperator; // Store the new operator for calculation
}

/**
 * Object containing functions for each arithmetic operation.
 */
const performCalculation = {
    '/': (firstOperand, secondOperand) => secondOperand === 0 ? 'Error' : firstOperand / secondOperand,
    '*': (firstOperand, secondOperand) => firstOperand * secondOperand,
    '+': (firstOperand, secondOperand) => firstOperand + secondOperand,
    '-': (firstOperand, secondOperand) => firstOperand - secondOperand,
};

/**
 * Performs the final calculation when the equals button is pressed.
 */
function calculate() {
    if (operator === null || waitingForSecondOperand) {
        // If no operator or waiting for second operand, nothing to calculate yet
        return;
    }

    const inputValue = parseFloat(currentInput);

    if (operator && firstOperand !== null) {
        const result = performCalculation[operator](firstOperand, inputValue);

        if (result === 'Error') {
            displayExpression = 'Error';
        } else {
            // Limit decimal places and convert to string for display
            displayExpression = String(parseFloat(result.toFixed(7)));
        }
        currentInput = displayExpression; // Set currentInput to the result for further calculations
    }

    firstOperand = null; // Reset for next calculation
    operator = null; // Reset operator
    waitingForSecondOperand = true; // Set flag to expect a new number or start a new calculation
}

/**
 * Resets the calculator to its initial state.
 */
function clearCalculator() {
    currentInput = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    displayExpression = '0'; // Reset display expression
}