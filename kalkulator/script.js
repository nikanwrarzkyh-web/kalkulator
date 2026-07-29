let display = document.getElementById('display');
let btnClear = document.getElementById('btnClear');
let currentInput = '0';
let operator = null;
let previousInput = null;
let resetNext = false;
let justEvaluated = false;

function updateDisplay() {
  display.textContent = currentInput;
  btnClear.textContent = currentInput === '0' || resetNext ? 'AC' : 'C';
}

function appendNumber(num) {
  if (justEvaluated) {
    currentInput = '0';
    operator = null;
    previousInput = null;
    justEvaluated = false;
  }
  if (resetNext) {
    currentInput = '0';
    resetNext = false;
  }
  if (currentInput === '0' && num !== '0') {
    currentInput = num;
  } else if (currentInput !== '0') {
    currentInput += num;
  }
  updateDisplay();
}

function appendOperator(op) {
  justEvaluated = false;
  if (operator && !resetNext) {
    calculate(true);
  }
  previousInput = currentInput;
  operator = op;
  resetNext = true;
  updateDisplay();
}

function calculate(chain) {
  if (!operator || !previousInput) return;
  let a = parseFloat(previousInput.replace(',', '.'));
  let b = parseFloat(currentInput.replace(',', '.'));
  if (isNaN(a) || isNaN(b)) return;
  let result = 0;
  switch (operator) {
    case '+': result = a + b; break;
    case '-': result = a - b; break;
    case '*': result = a * b; break;
    case '/': result = b === 0 ? 'Error' : a / b; break;
    case '%': result = a % b; break;
  }
  if (result === 'Error') {
    currentInput = 'Error';
  } else {
    let str = result.toFixed(10).replace(/\.?0+$/, '');
    currentInput = str.replace('.', ',');
  }
  if (!chain) {
    operator = null;
    previousInput = null;
    resetNext = true;
    justEvaluated = true;
  }
  updateDisplay();
}

function clearDisplay() {
  if (btnClear.textContent === 'C') {
    currentInput = '0';
    resetNext = false;
    updateDisplay();
  } else {
    currentInput = '0';
    operator = null;
    previousInput = null;
    resetNext = false;
    justEvaluated = false;
    updateDisplay();
  }
}

function negate() {
  if (currentInput === '0') return;
  if (currentInput.startsWith('-')) {
    currentInput = currentInput.slice(1);
  } else {
    currentInput = '-' + currentInput;
  }
  updateDisplay();
}

function backspace() {
  if (resetNext || justEvaluated) return;
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = '0';
  }
  updateDisplay();
}

function appendDot() {
  if (resetNext || justEvaluated) {
    currentInput = '0';
    resetNext = false;
    justEvaluated = false;
  }
  if (!currentInput.includes(',')) {
    currentInput += ',';
  }
  updateDisplay();
}

document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') appendNumber(e.key);
  if (e.key === '.') appendDot();
  if (e.key === ',') appendDot();
  if (e.key === '+') appendOperator('+');
  if (e.key === '-') appendOperator('-');
  if (e.key === '*') appendOperator('*');
  if (e.key === '/') appendOperator('/');
  if (e.key === '%') appendOperator('%');
  if (e.key === 'Enter' || e.key === '=') calculate(false);
  if (e.key === 'Backspace') backspace();
  if (e.key === 'Escape') { clearDisplay(); }
});
