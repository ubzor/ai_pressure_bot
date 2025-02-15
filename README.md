# AI Pressure Bot

## Description
The AI Pressure Bot is an application designed to help users maintain a diary of their blood pressure. It provides features to record, track, and analyze blood pressure readings over time.

## Installation notes
1. **Install Dependencies**  
   Ensure that Node.js and npm are installed, then run:
   ```
   npm install
   ```

2. **Set environment variables**
    Ensure that environment variables are correctly set for your environment (e.g., create and configure a .env file).
    ```
    cp .env.example .env
    ```

3. **Generate prisma database and client**
    Run this commands:
    ```
    npm run prisma:migrate
    npm run postinstall
    ```

## Development Environment

2. **Run the Development Server**  
   Start the development environment with:
   ```
   npm run dev
   ```
   Access the application at [http://localhost:3000](http://localhost:3000).

## Production Deployment
1. **Build the Project**  
   Generate a production-ready build:
   ```
   npm run build
   ```

2. **Start the Production Server**  
   Run the production server with:
   ```
   npm run start
   ```

3. **Using a Process Manager**  
   Optionally, manage the production process using a tool like PM2:
   ```
   pm2 start npm --name "ai_pressure_bot" -- start
   ```
