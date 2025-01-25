# Weather Dashboard with Azure Blob Storage Integration

A Node.js-based Weather Dashboard that fetches real-time weather data for specified cities using the OpenWeatherMap API and integrates with Azure Blob Storage for data storage.

## Features

- **Fetch Weather Data:** Retrieves up-to-date weather information, including temperature, feels-like temperature, humidity, and weather conditions, for multiple cities using the OpenWeatherMap API.
  
- **Azure Blob Storage Integration:** Stores fetched weather data as JSON files in an Azure Blob Storage container for easy access and backup.

- **Secure Configuration:** Leverages a `.env` file to manage sensitive credentials, such as API keys and Azure Storage account information, keeping your data secure.

## Technologies Used

- [Node.js](https://nodejs.org): A JavaScript runtime for building scalable network applications.
- [Axios](https://axios-http.com/): A promise-based HTTP client for fetching data from APIs.
- [@azure/storage-blob](https://learn.microsoft.com/en-us/javascript/api/@azure/storage-blob): Azure SDK for interacting with Azure Blob Storage.
- [dotenv](https://github.com/motdotla/dotenv): For managing environment variables.

