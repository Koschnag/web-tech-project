export class StockModel {
    constructor() {
        this.briefkurs = 100.0;
        this.geldkurs = 99.0;
        this.balance = 50000.0;
        this.stocksOwned = 0;
        this.profitLoss = 0.0;
        this.priceHistory = [100.0];
        this.consecutiveChanges = 0;
        this.lastChangeDirection = null;
        this.isBullMarket = false;
        this.isBearMarket = false;
        this.gameSpeed = 1000;
        this.isPaused = false;
        this.gameDuration = 10 * 60 * 1000;
        this.gameInterval = null;
    }

    updatePrices(change) {
        this.briefkurs = parseFloat((this.briefkurs + change).toFixed(2));
        this.geldkurs = parseFloat((this.briefkurs - 1).toFixed(2));

        if (this.briefkurs < 1) this.briefkurs = 1;
        if (this.geldkurs < 0) this.geldkurs = 0;

        const direction = change > 0 ? 'up' : 'down';
        if (direction === this.lastChangeDirection) {
            this.consecutiveChanges++;
        } else {
            this.consecutiveChanges = 1;
            this.lastChangeDirection = direction;
        }

        this.updateProfitLoss();
    }

    calculateFee(amount) {
        return Math.min(Math.max(4.95 + amount * 0.0025, 9.99), 59.99);
    }

    handleTransaction(type, amount) {
        if (isNaN(amount) || amount <= 0) {
            throw new Error('Bitte geben Sie eine gültige Anzahl ein.');
        }

        const price = type === 'buy' ? this.briefkurs : this.geldkurs;
        const total = amount * price;
        const fee = this.calculateFee(total);
        const finalAmount = type === 'buy' ? total + fee : total - fee;

        if (type === 'buy' && finalAmount > this.balance) {
            throw new Error('Nicht genügend Guthaben.');
        }

        if (type === 'sell' && amount > this.stocksOwned) {
            throw new Error('Ungültige Anzahl.');
        }

        if (type === 'buy') {
            this.balance -= finalAmount;
            this.stocksOwned += amount;
        } else {
            this.balance += finalAmount;
            this.stocksOwned -= amount;
        }

        this.updateProfitLoss();
    }

    updateProfitLoss() {
        const currentValue = this.stocksOwned * this.geldkurs;
        this.profitLoss = currentValue + this.balance - 50000.0;
    }
}
