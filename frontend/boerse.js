const briefkursEl = document.getElementById('briefkurs');
const geldkursEl = document.getElementById('geldkurs');
const balanceEl = document.getElementById('balance');
const stocksOwnedEl = document.getElementById('stocksOwned');
const profitLossEl = document.getElementById('profitLoss');
const marketStatusEl = document.getElementById('marketStatus');

let briefkurs = 100.0;
let geldkurs = 99.0;
let balance = 50000.0;
let stocksOwned = 0;
let profitLoss = 0.0;
let priceHistory = [100.0];
let gameInterval;
let consecutiveChanges = 0;
let lastChangeDirection = null;
let isBullMarket = false;
let isBearMarket = false;
let gameSpeed = 1000; // Default speed: 1 second
let isPaused = false;
let gameDuration = 10 * 60 * 1000; // 10 minutes in milliseconds
let gameTimeout;

// Initialize Chart.js
const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(priceHistory.length).fill(''),
        datasets: [{
            label: 'Briefkurs',
            data: priceHistory,
            borderColor: 'blue',
            borderWidth: 2,
            fill: false,
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: { display: false },
            y: { beginAtZero: false }
        }
    }
});

function updatePrices() {
    if (isPaused) return; // Ensure the game respects the pause state

    let change = (Math.random() * 0.05).toFixed(2);
    const isBullish = Math.random() < (isBullMarket ? 0.75 : isBearMarket ? 0.25 : 0.5);
    change = parseFloat(change) * (isBullish ? 1 : -1);

    briefkurs = parseFloat((briefkurs + change).toFixed(2));
    geldkurs = parseFloat((briefkurs - 1).toFixed(2));

    // Ensure prices don't fall below a reasonable threshold
    if (briefkurs < 1) briefkurs = 1;
    if (geldkurs < 0) geldkurs = 0;

    // Track consecutive changes
    const direction = change > 0 ? 'up' : 'down';
    if (direction === lastChangeDirection) {
        consecutiveChanges++;
    } else {
        consecutiveChanges = 1;
        lastChangeDirection = direction;
    }

    // Check for bull/bear market
    if (consecutiveChanges >= 3) {
        updateMarketStatus(direction);
    } else {
        isBullMarket = false;
        isBearMarket = false;
        marketStatusEl.classList.add('d-none');
    }

    // Update UI
    briefkursEl.textContent = briefkurs.toFixed(2);
    geldkursEl.textContent = geldkurs.toFixed(2);

    // Update chart
    priceHistory.push(briefkurs);
    if (priceHistory.length > 50) priceHistory.shift();
    chart.data.labels = Array(priceHistory.length).fill('');
    chart.data.datasets[0].data = priceHistory;
    chart.update();
}

function calculateFee(amount) {
    return Math.min(Math.max(4.95 + amount * 0.0025, 9.99), 59.99);
}

function updateMarketStatus(direction) {
    if (direction === 'up') {
        isBullMarket = true;
        isBearMarket = false;
        marketStatusEl.textContent = 'Bullenmarkt!';
        marketStatusEl.classList.remove('d-none', 'alert-danger');
        marketStatusEl.classList.add('alert-success');
    } else {
        isBearMarket = true;
        isBullMarket = false;
        marketStatusEl.textContent = 'Bärenmarkt!';
        marketStatusEl.classList.remove('d-none', 'alert-success');
        marketStatusEl.classList.add('alert-danger');
    }
}

function handleStockTransaction(type, amount) {
    if (isNaN(amount) || amount <= 0) {
        return alert('Bitte geben Sie eine gültige Anzahl ein.');
    }

    const price = type === 'buy' ? briefkurs : geldkurs;
    const total = amount * price;
    const fee = calculateFee(total);
    const finalAmount = type === 'buy' ? total + fee : total - fee;

    if (type === 'buy' && finalAmount > balance) {
        return alert('Nicht genügend Guthaben.');
    }

    if (type === 'sell' && amount > stocksOwned) {
        return alert('Ungültige Anzahl.');
    }

    if (type === 'buy') {
        balance -= finalAmount;
        stocksOwned += amount;
    } else {
        balance += finalAmount;
        stocksOwned -= amount;
    }

    updateProfitLoss();
    updateUI();
}

function buyStock() {
    const amount = parseInt(document.getElementById('stockAmount').value);
    handleStockTransaction('buy', amount);
}

function sellStock() {
    const amount = parseInt(document.getElementById('stockAmount').value);
    handleStockTransaction('sell', amount);
}

function updateProfitLoss() {
    const currentValue = stocksOwned * geldkurs;
    profitLoss = currentValue + balance - 50000.0;
}

function updateUI() {
    balanceEl.textContent = balance.toFixed(2);
    stocksOwnedEl.textContent = stocksOwned;
    profitLossEl.textContent = profitLoss.toFixed(2);
}

function adjustGameSpeed(newSpeed) {
    gameSpeed = newSpeed;
    clearInterval(gameInterval);
    gameInterval = setInterval(updatePrices, gameSpeed);
}

function togglePause() {
    isPaused = !isPaused;
    document.getElementById('pauseGame').textContent = isPaused ? 'Fortsetzen' : 'Pause';
}

function startGame() {
    gameInterval = setInterval(updatePrices, gameSpeed);
    gameTimeout = setTimeout(() => {
        endGame();
        alert('Das Spiel ist nach 10 Minuten automatisch beendet.');
    }, gameDuration);
    document.getElementById('startGame').disabled = true;
    document.getElementById('pauseGame').disabled = false;
}

function endGame() {
    clearInterval(gameInterval);
    clearTimeout(gameTimeout);
    alert(`Spiel beendet! Endgültiger Gewinn/Verlust: ${profitLoss.toFixed(2)} Euro`);
    document.getElementById('pauseGame').disabled = true;
}

document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('buyStock').addEventListener('click', buyStock);
document.getElementById('sellStock').addEventListener('click', sellStock);
document.getElementById('endGame').addEventListener('click', endGame);
document.getElementById('pauseGame').addEventListener('click', togglePause);
document.getElementById('speedControl').addEventListener('change', (e) => adjustGameSpeed(parseInt(e.target.value)));
