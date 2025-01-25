import axios from "axios";
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
} from "@azure/storage-blob";
import * as dotenv from "dotenv";
import * as moment from 'moment';

dotenv.config();

interface WeatherData {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    description: string;
  }[];
}

class WeatherDashboard {
  private apiKey: string;
  private storageAccountName: string;
  private storageAccountKey: string;
  private containerName: string;
  private blobServiceClient: BlobServiceClient;

  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY || "";
    this.storageAccountName = process.env.AZURE_STORAGE_ACCOUNT_NAME || "";
    this.storageAccountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY || "";
    this.containerName =
      process.env.AZURE_STORAGE_CONTAINER_NAME || "weather-data";

    // Debugging: Log environment variables
    console.log('Storage Account Name:', this.storageAccountName);
    console.log('Storage Account Key:', this.storageAccountKey);
    console.log('Container Name:', this.containerName);

    const sharedKeyCredential = new StorageSharedKeyCredential(
      this.storageAccountName, 
      this.storageAccountKey   
    );
    
    this.blobServiceClient = new BlobServiceClient(
      `https://${this.storageAccountName}.blob.core.windows.net`,
      sharedKeyCredential
    );
  }

  async createContainerIfNotExists(): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );
    try {
      await containerClient.createIfNotExists();
      console.log(`Container ${this.containerName} was created`);
    } catch (error) {
      console.error(`Error creating container:`, error);
    }
  }

  async fetchWeather(city: string): Promise<WeatherData | null> {
    const baseUrl = "http://api.openweathermap.org/data/2.5/weather";
    const params = {
      q: city,
      appid: this.apiKey,
      units: "imperial",
    };

    try {
      const response = await axios.get(baseUrl, { params });
      return response.data;
    } catch (error) {
      console.error(`Error fetching weather data for ${city}:`, error);
      return null;
    }
  }

  async saveToAzureBlob(WeatherData: WeatherData, city: string): Promise<boolean> {
    if (!WeatherData) return false;

    const timeStamp = moment().format("YYYYMMDD-HHmmss");
    const blobName = `${city}-${timeStamp}.json`;
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName
    );
    const blockBLobClient = containerClient.getBlockBlobClient(blobName);

    try {
      await blockBLobClient.upload(
        JSON.stringify(WeatherData),
        JSON.stringify(WeatherData).length,
        {
          blobHTTPHeaders: { blobContentType: "application/json" },
        }
      );
      console.log(`Successfully saved data for ${city} to Azure Blob Storage`);
      return true;
    } catch (error) {
      console.error(`Error saving to Azure Blob Storage:`, error);
      return false;
    }
  }
}

async function main() {
  const dashboard = new WeatherDashboard();

  await dashboard.createContainerIfNotExists();

  const cities = ["Philadelphia", "Seattle", "New York"];

  for (const city of cities) {
    console.log(`\nFetching weather for ${city}...`);
    const weatherData = await dashboard.fetchWeather(city);

    if (weatherData) {
      const { temp, feels_like, humidity } = weatherData.main;
      const description = weatherData.weather[0].description;

      console.log(`Temperature: ${temp}°F`);
      console.log(`Feels like: ${feels_like}°F`);
      console.log(`Humidity: ${humidity}%`);
      console.log(`Conditions: ${description}`);
      const success = await dashboard.saveToAzureBlob(weatherData, city);
      if (success) {
        console.log(`Weather data for ${city} saved to Azure Blob Storage!`);
      }
    } else {
      console.log(`Failed to fetch weather data for ${city}`);
    }
  }
}

main().catch((error) => console.error(`Error in main:`, error));