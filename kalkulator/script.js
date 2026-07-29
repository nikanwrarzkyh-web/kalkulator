let display = document.getElementById('display');
let currentInput = '0';
let operator = null;
let previousInput = null;
let resetNext = false;

function updateDisplay() {
  display.textContent = currentInput;
}

function appendNumber(num) {
  if (resetNext) {
    currentInput = '';
    resetNext = false;
  }
  if (currentInput === '0' && num !== '.') {
    currentInput = num;
  } else {
    currentInput += num;
  }
  updateDisplay();
}

function appendOperator(op) {
  if (operator && !resetNext) {
    calculate(true);
  }
  previousInput = currentInput;
  operator = op;
  resetNext = true;
}

function calculate(chain) {
  if (!operator || !previousInput) return;
  let a = parseFloat(previousInput);
  let b = parseFloat(currentInput);
  let result = 0;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b === 0 ? 'Error' : a / b; break;
    case '%': result = a % b; break;
  }
  currentInput = result.toString();
  if (!chain) {
    operator = null;
    previousInput = null;
    resetNext = true;
  }
  updateDisplay();
}

function clearDisplay() {
  currentInput = '0';
  operator = null;
  previousInput = null;
  resetNext = false;
  updateDisplay();
}

function backspace() {
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = '0';
  }
  updateDisplay();
}

function appendDot() {
  if (resetNext) {
    currentInput = '0';
    resetNext = false;
  }
  if (!currentInput.includes('.')) {
    currentInput += '.';
  }
  updateDisplay();
}

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  if (e.key === '.') appendDot();
  if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') appendOperator(e.key);
  if (e.key === 'Enter' || e.key === '=') calculate(false);
  if (e.key === 'Backspace') backspace();
  if (e.key === 'Escape') clearDisplay();
  if (e.key === '%') appendOperator('%');
});
