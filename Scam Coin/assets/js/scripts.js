// Основные переменные 
let balance = 0;
let incomePerSecond = 0;
let totalClicks = 0;
let memesBought = 0;

// Energy system variables
let currentEnergy = 1000;
let maxEnergy = 1000;
let energyPerClick = 1;  // Energy cost per click
let energyRegenRate = 1;  // Energy recovered per second

// DOM элементы
const balanceElement = document.querySelector('.balance-value');
const incomeElement = document.querySelector('.income-value');
const clicker = document.getElementById('clicker');
const totalClicksElement = document.querySelector('.total-clicks');
const totalCoinsElement = document.querySelector('.total-coins');
const totalMemesElement = document.querySelector('.total-memes');
const menuItems = document.querySelectorAll('.menu-item');
const pages = document.querySelectorAll('.page');
const memeButtons = document.querySelectorAll('.meme-buy');
const energyValueElement = document.querySelector('.cont-energy .value h3');
const energyProgressBar = document.getElementById('progressBar');

// Функция клика
function clickerEventListener(e) {
    // Check if we have enough energy to click
    if (currentEnergy >= energyPerClick) {
        // Reduce energy
        currentEnergy -= energyPerClick;
        
        // Increase balance
        balance++;
        totalClicks++;
        updateDisplay();
        
        // Create click effect
        const clickEffect = document.createElement('div');
        clickEffect.className = 'click-effect';
        clickEffect.textContent = '+1';
        clickEffect.style.left = (e.clientX - 10) + 'px';
        clickEffect.style.top = (e.clientY - 20) + 'px';
        document.body.appendChild(clickEffect);
        
        // Remove effect after animation
        setTimeout(() => {
            clickEffect.remove();
        }, 1000);
        
        // Button animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 100);
        
        // Update energy display
        updateEnergyDisplay();
    } else {
        // Not enough energy - show visual feedback
        clicker.classList.add('no-energy');
        setTimeout(() => {
            clicker.classList.remove('no-energy');
        }, 300);
    }
}

// Add the click listener
clicker.addEventListener('click', clickerEventListener);

// Навигация по меню
menuItems.forEach(item => {
    item.addEventListener('click', function(e) {
        e.preventDefault();
        const targetPage = this.getAttribute('data-page');
        
        // Деактивируем все элементы меню
        menuItems.forEach(i => i.classList.remove('active'));
        
        // Скрываем все страницы
        pages.forEach(p => p.classList.remove('active'));
        
        // Активируем нужный элемент меню
        this.classList.add('active');
        
        // Показываем нужную страницу или скрываем все для показа главной
        if (targetPage !== 'home') {
            document.getElementById(targetPage).classList.add('active');
        }
    });
});

// Покупка мемов
memeButtons.forEach(button => {
    button.addEventListener('click', function() {
        const price = parseInt(this.getAttribute('data-price'));
        const income = parseFloat(this.getAttribute('data-income'));
        
        if (balance >= price) {
            balance -= price;
            incomePerSecond += income;
            memesBought++;
            updateDisplay();
            
            // Анимация покупки
            this.style.backgroundColor = '#00ff00';
            setTimeout(() => {
                this.style.backgroundColor = '#00aa00';
            }, 200);
        } else {
            // Анимация недостаточно средств
            this.style.backgroundColor = '#aa0000';
            setTimeout(() => {
                this.style.backgroundColor = '#00aa00';
            }, 200);
        }
    });
});

// Function to update energy display
function updateEnergyDisplay() {
    energyValueElement.textContent = Math.floor(currentEnergy);
    
    // Update progress bar width (percentage of max energy)
    const energyPercentage = (currentEnergy / maxEnergy) * 100;
    energyProgressBar.style.width = energyPercentage + '%';
    
    // Visual feedback for low energy
    if (energyPercentage < 20) {
        energyProgressBar.classList.add('low-energy');
    } else {
        energyProgressBar.classList.remove('low-energy');
    }
}

// Обновление дисплея
function updateDisplay() {
    balanceElement.textContent = Math.floor(balance);
    incomeElement.textContent = incomePerSecond.toFixed(1);
    totalClicksElement.textContent = totalClicks;
    totalCoinsElement.textContent = Math.floor(balance);
    totalMemesElement.textContent = memesBought;
    updateEnergyDisplay();
}

// Обновление баланса каждую секунду
setInterval(() => {
    balance += incomePerSecond;
    updateDisplay();
}, 1000);

// Energy regeneration (runs every second)
setInterval(() => {
    // Only regenerate if not at max
    if (currentEnergy < maxEnergy) {
        currentEnergy = Math.min(maxEnergy, currentEnergy + energyRegenRate);
        updateEnergyDisplay();
    }
}, 1000);

// Add some CSS for visual feedback
const style = document.createElement('style');
style.textContent = `
.no-energy {
    animation: shake 0.3s;
    opacity: 0.7;
}

.low-energy {
    background-color: #ff3333 !important;
}

@keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
}`;
document.head.appendChild(style);

// Начальное обновление дисплея
updateDisplay();