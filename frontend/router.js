const routes = {
    '/': './app/views/index.html',
    '/registrierung': './app/views/registrierung.html',
    '/boersenspiel': './app/views/boersenspiel.html',
};

let currentRoute = '/';

function navigateTo(url) {
    if (url === currentRoute) return;
    currentRoute = url;
    history.pushState(null, null, url);
    router();
}

async function router() {
    const path = window.location.pathname;
    const route = routes[path] || routes['/'];

    try {
        const response = await fetch(route);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${route}: ${response.status} ${response.statusText}`);
        }
        let html = await response.text();

        if (path === '/') {
            const { IndexViewModel } = await import('./app/viewModels/indexViewModel.js');
            const viewModel = new IndexViewModel();

            html = html.replace('<!--TITLE-->', viewModel.title);
            html = html.replace('<!--LEAD_TEXT-->', viewModel.leadText);
            html = html.replace('<!--CREDIT_TEXT-->', viewModel.creditText);
            html = html.replace('<!--GIROKONTO_TEXT-->', viewModel.girokontoText);
            html = html.replace('<!--AKTIEN_TEXT-->', viewModel.aktienText);
            html = html.replace('<!--BOERSSPIEL_TEXT-->', viewModel.boersenspielText);
        }

        document.getElementById('app').innerHTML = html;
        initRouterLinks();
        executeMiddleware(path);
        initializeView(path);
    } catch (error) {
        console.error(`Failed to load route ${path}:`, error);
        document.getElementById('app').innerHTML = '<h1>Error loading page</h1>';
    }
}

function initRouterLinks() {
    document.querySelectorAll('[data-link]').forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(e.target.getAttribute('href'));
        });
    });
}

function executeMiddleware(path) {
    // Example: Add middleware logic here (e.g., authentication checks)
    console.log(`Navigated to ${path}`);
}

function initializeView(path) {
    if (path === '/') {
        import('./app/viewModels/indexViewModel.js').then(({ IndexViewModel }) => {
            const viewModel = new IndexViewModel();
            // You might want to render the view dynamically here instead of having static HTML
        });
    } else if (path === '/registrierung') {
        import('./app/viewModels/registrationViewModel.js').then(({ RegistrationViewModel }) => {
            const viewModel = new RegistrationViewModel({
                showErrors: (errors) => {
                    Object.keys(errors).forEach((field) => {
                        const element = document.getElementById(field);
                        element.classList.add('is-invalid');
                        element.nextElementSibling.textContent = errors[field];
                    });
                },
                showSuccessMessage: () => {
                    document.getElementById('registrationForm').classList.add('d-none');
                    document.getElementById('successMessage').classList.remove('d-none');
                },
            });

            document.getElementById('registrationForm').addEventListener('input', (event) => {
                viewModel.handleInputChange(event.target.id, event.target.value);
            });

            document.getElementById('registrationForm').addEventListener('submit', (event) => {
                event.preventDefault();
                viewModel.handleSubmit();
            });
        });
    } else if (path === '/boersenspiel') {
        import('./app/viewModels/stockViewModel.js').then(({ StockViewModel }) => {
            const viewModel = new StockViewModel({
                updateUI: (model) => {
                    document.getElementById('briefkurs').textContent = model.briefkurs.toFixed(2);
                    document.getElementById('geldkurs').textContent = model.geldkurs.toFixed(2);
                    document.getElementById('balance').textContent = model.balance.toFixed(2);
                    document.getElementById('stocksOwned').textContent = model.stocksOwned;
                    document.getElementById('profitLoss').textContent = model.profitLoss.toFixed(2);
                },
                showError: (message) => {
                    alert(message);
                },
                initializeChart: (priceHistory) => {
                    const ctx = document.getElementById('chart').getContext('2d');
                    return new Chart(ctx, {
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
                },
                updateChart: (chart, priceHistory) => {
                    chart.data.labels = Array(priceHistory.length).fill('');
                    chart.data.datasets[0].data = priceHistory;
                    chart.update();
                }
            });

            const chart = viewModel.view.initializeChart(viewModel.model.priceHistory);

            document.getElementById('startGame').addEventListener('click', () => viewModel.startGame(chart));
            document.getElementById('pauseGame').addEventListener('click', () => viewModel.pauseGame(chart));
            document.getElementById('buyStock').addEventListener('click', () => {
                const amount = parseInt(document.getElementById('stockAmount').value);
                viewModel.buyStock(amount);
                updateCalculatedFee();
            });
            document.getElementById('sellStock').addEventListener('click', () => {
                const amount = parseInt(document.getElementById('stockAmount').value);
                viewModel.sellStock(amount);
                updateCalculatedFee();
            });

            const stockAmountInput = document.getElementById('stockAmount');
            const calculatedFeeEl = document.getElementById('calculatedFee');

            function calculateFee(amount) {
                return Math.min(Math.max(4.95 + amount * 0.0025, 9.99), 59.99);
            }

            function updateCalculatedFee() {
                const amount = parseInt(stockAmountInput.value);
                if (isNaN(amount) || amount <= 0) {
                    calculatedFeeEl.textContent = '0.00';
                    return;
                }
                const price = viewModel.model.briefkurs; // Use briefkurs for fee calculation
                const total = amount * price;
                const fee = calculateFee(total);
                calculatedFeeEl.textContent = fee.toFixed(2);
            }

            stockAmountInput.addEventListener('input', updateCalculatedFee);
        });
    }
}

window.addEventListener('popstate', router);
document.addEventListener('DOMContentLoaded', () => {
    router();
    initRouterLinks();
});
