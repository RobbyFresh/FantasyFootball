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

### Deployment

To deploy this application, you can use services like Render for the backend and Vercel for the frontend.

#### Backend Deployment (Render)

1.  Push your code to a GitHub repository.
2.  Create a new "Web Service" on Render and connect it to your GitHub repository.
3.  Set the "Root Directory" to `backend`.
4.  Render should automatically detect the `requirements.txt` and use `pip install -r requirements.txt` as the build command.
5.  Set the "Start Command" to `python app.py`.
6.  Go to the "Environment" tab and add a new "Secret File".
7.  Set the filename to `.env`.
8.  In the content, add your API key: `API_KEY=your_sportsdata_api_key_here`
9.  After deploying, Render will provide you with a public URL for your backend (e.g., `https://your-app-name.onrender.com`). Copy this URL.

#### Frontend Deployment (Vercel)

1.  Push your code to the same GitHub repository.
2.  Create a new "Project" on Vercel and connect it to your GitHub repository.
3.  Set the "Root Directory" to `frontend`.
4.  Vercel should automatically detect that it's a React application and configure the build settings.
5.  Go to the project "Settings" and navigate to "Environment Variables".
6.  Add a new environment variable:
    *   **Name:** `REACT_APP_API_URL`
    *   **Value:** Paste the backend URL you copied from Render (e.g., `https://your-app-name.onrender.com`).
7.  Deploy your project.

Your application should now be live, with the frontend on Vercel successfully communicating with the backend on Render.
