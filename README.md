#Weather Dashboard with Azure Blob Storage Integration
This project is a Weather Dashboard that fetches weather data for specified cities using the OpenWeatherMap API and stores the data in Azure Blob Storage. The project is built using Node.js and leverages the axios library for HTTP requests, the @azure/storage-blob package for interacting with Azure Blob Storage, and dotenv for managing environment variables.

Features
Fetch Weather Data: Retrieves current weather data (temperature, feels-like temperature, humidity, and weather conditions) for multiple cities using the OpenWeatherMap API.

Azure Blob Storage Integration: Saves the fetched weather data as JSON files in an Azure Blob Storage container.

Environment Variables: Uses .env file to securely store sensitive information like API keys and Azure Storage account credentials.
