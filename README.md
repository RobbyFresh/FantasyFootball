# Fantasy Football Draft Assistant

This application provides real-time fantasy football player data and updates to help you make informed decisions during your draft.

## Features

- Access to a comprehensive database of all fantasy football players
- Real-time player data, stats, and updates
- Searchable and filterable player list

## Data Source

This application uses the [SportsData.io](https://sportsdata.io/nfl-api) to fetch player data. You will need to sign up for a free trial to get an API key to run the application.

## Setup

### Backend

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Create a `.env` file in the `backend` directory and add your SportsData.io API key to it:
   ```
   API_KEY=your_api_key
   ```
4. Run the application:
   ```bash
   python app.py
   ```

### Frontend

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install the required dependencies:
    ```bash
    npm install
    ```
3. Run the application:
    ```bash
    npm start
    ```
4. The application will open in your browser at `http://localhost:3000`.
