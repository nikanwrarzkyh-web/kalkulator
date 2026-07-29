let display = document.getElementById('display');
let btnClear = document.getElementById('btnClear');
let modeToggle = document.getElementById('modeToggle');
let currentInput = '0';
let operator = null;
let previousInput = null;
let resetNext = false;
let justEvaluated = false;
let isShift = false;

function updateDisplay() {
  display.textContent = currentInput;
  btnClear.textContent = currentInput === '0' || resetNext || justEvaluated ? 'AC' : 'C';
}

function getValue() {
  return parseFloat(currentInput.replace(',', '.'));
}

function setValue(v) {
  if (isNaN(v) || !isFinite(v)) {
    currentInput = 'Error';
  } else {
    let str = v.toFixed(10).replace(/\.?0+$/, '');
    currentInput = str.replace('.', ',');
  }
  updateDisplay();
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
  } else if (currentInput !== '0' && currentInput !== 'Error') {
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
    setValue(result);
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
    return;
  }
  currentInput = '0';
  operator = null;
  previousInput = null;
  resetNext = false;
  justEvaluated = false;
  updateDisplay();
}

function negate() {
  if (currentInput === '0' || currentInput === 'Error') return;
  if (currentInput.startsWith('-')) {
    currentInput = currentInput.slice(1);
  } else {
    currentInput = '-' + currentInput;
  }
  updateDisplay();
}

function backspace() {
  if (resetNext || justEvaluated || currentInput === 'Error') return;
  if (currentInput.length > 1) {
    currentInput = currentInput.slice(0, -1);
  } else {
    currentInput = '0';
  }
  updateDisplay();
}

function appendDot() {
  if (resetNext || justEvaluated || currentInput === 'Error') {
    currentInput = '0';
    resetNext = false;
    justEvaluated = false;
  }
  if (!currentInput.includes(',')) {
    currentInput += ',';
  }
  updateDisplay();
}

function toggleMode() {
  isShift = !isShift;
  modeToggle.classList.toggle('active');
  let btns = document.querySelectorAll('.sci');
  let funcs = isShift
    ? ['sinh', 'cosh', 'tanh', 'log', 'ln', '√', 'x²', '(']
    : ['sin', 'cos', 'tan', 'log', 'ln', '√', 'x²', '('];
  btns.forEach((btn, i) => {
    btn.textContent = funcs[i];
  });
}

function scientificFunc(fn) {
  if (currentInput === 'Error') return;
  let val = getValue();
  if (isNaN(val)) return;
  let result;
  let actualFn = isShift ? getShiftFunc(fn) : fn;
  switch (actualFn) {
    case 'sin': result = Math.sin(toRad(val)); break;
    case 'cos': result = Math.cos(toRad(val)); break;
    case 'tan': result = Math.tan(toRad(val)); break;
    case 'sinh': result = Math.sinh(val); break;
    case 'cosh': result = Math.cosh(val); break;
    case 'tanh': result = Math.tanh(val); break;
    case 'log': result = Math.log10(val); break;
    case 'ln': result = Math.log(val); break;
    case 'sqrt': result = Math.sqrt(val); break;
    case 'square': result = val * val; break;
    default: return;
  }
  if (actualFn === '(') return;
  setValue(result);
  justEvaluated = true;
  resetNext = true;
}

function getShiftFunc(fn) {
  switch (fn) {
    case 'sin': return 'sinh';
    case 'cos': return 'cosh';
    case 'tan': return 'tanh';
    default: return fn;
  }
}

function toRad(deg) {
  return deg * Math.PI / 180;
}

function openParen() {
  if (currentInput === 'Error') return;
  if (currentInput === '0') return;
  currentInput += '(';
  resetNext = false;
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
  if (e.key === 'Escape') { btnClear.textContent = 'AC'; clearDisplay(); }
});
