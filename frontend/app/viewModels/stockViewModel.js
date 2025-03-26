import { StockModel } from '../models/stockModel.js';

export class StockViewModel {
    constructor(view) {
        this.model = new StockModel();
        this.view = view;
        this.gameInterval = null;
        this.isPaused = false;
    }

    startGame(chart) {
        this.gameInterval = setInterval(() => {
            const change = (Math.random() * 0.05 * (Math.random() < 0.5 ? 1 : -1)).toFixed(2);
            this.model.updatePrices(parseFloat(change));
            this.view.updateUI(this.model, chart);
            this.view.updateChart(chart, this.model.priceHistory);
        }, 1000);
    }

    pauseGame(chart) {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            clearInterval(this.gameInterval);
        } else {
            this.startGame(chart);
        }
    }

    buyStock(amount) {
        try {
            this.model.handleTransaction('buy', amount);
            this.view.updateUI(this.model);
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    sellStock(amount) {
        try {
            this.model.handleTransaction('sell', amount);
            this.view.updateUI(this.model);
        } catch (error) {
            this.view.showError(error.message);
        }
    }
}
