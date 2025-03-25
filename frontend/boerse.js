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
    let change = (Math.random() * 0.05).toFixed(2);
    change = parseFloat(change) * (Math.random() < 0.5 ? -1 : 1);

    // Adjust probabilities for bull/bear market
    if (isBullMarket) change = Math.abs(change);
    if (isBearMarket) change = -Math.abs(change);

    briefkurs = parseFloat((briefkurs + change).toFixed(2));
    geldkurs = parseFloat((briefkurs - 1).toFixed(2));

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

function startGame() {
    gameInterval = setInterval(updatePrices, 1000);
    document.getElementById('startGame').disabled = true;
}

function endGame() {
    clearInterval(gameInterval);
    alert(`Spiel beendet! Endgültiger Gewinn/Verlust: ${profitLoss.toFixed(2)} Euro`);
}

document.getElementById('startGame').addEventListener('click', startGame);
document.getElementById('buyStock').addEventListener('click', buyStock);
document.getElementById('sellStock').addEventListener('click', sellStock);
document.getElementById('endGame').addEventListener('click', endGame);
