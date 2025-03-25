# Web Tech Project

This project is a web-based application for a fictional bank, "Privatbank Mustermann," featuring a stock market simulation game and user registration.

## Prerequisites

Ensure you have the following installed on your system:
- [Docker](https://www.docker.com/)

## Getting Started

Follow these steps to start the application:

### 1. Clone the Repository
Clone this repository to your local machine:
```bash
git clone https://github.com/Koschnag/web-tech-project
cd web-tech-project
```

### 2. Build the Docker Image
Navigate to the `frontend` directory and build the Docker image:
```bash
cd frontend
docker build -t web-tech-frontend .
```

### 3. Run the Docker Container
Run the Docker container, exposing it on port 80:
```bash
docker run -p 80:80 web-tech-frontend
```

### 4. Access the Application
Open your browser and navigate to:
```
http://localhost
```

## Project Structure

- **frontend/**: Contains the frontend code, including HTML, CSS, JavaScript, and Docker configuration.
  - `index.html`: Main landing page.
  - `registrierung.html`: User registration page.
  - `boersenspiel.html`: Stock market simulation game.
  - `styles.css`: Shared CSS styles.
  - `boerse.js`: JavaScript logic for the stock market game.
  - `registrierung.js`: JavaScript logic for user registration.
  - `nginx/`: Nginx configuration files.
  - `Dockerfile`: Docker configuration for the frontend.

## Testing

To ensure the application works as expected, perform the following tests:
1. **Registration Form**:
   - Test all validation rules (e.g., email matching, age restriction, ZIP code format).
   - Verify that valid inputs display the success message.
2. **Stock Market Game**:
   - Test buying and selling stocks with various amounts.
   - Verify that fees are calculated correctly.
   - Check the chart updates and market status messages.

## Known Issues

- The application does not currently support localization for non-German languages.
- The stock market game does not save progress after a page refresh.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Troubleshooting

If you encounter any issues:
- Ensure Docker is running.
- Check for errors in the browser console or terminal.
- Verify that port 80 is not in use by another application.

For further assistance, feel free to open an issue in the repository.
