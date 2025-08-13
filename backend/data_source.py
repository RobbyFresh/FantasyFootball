import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("API_KEY")
BASE_URL = "https://api.sportsdata.io/v3/nfl/scores/json/Players"

def get_all_players():
    """
    Fetches all players from the SportsData.io API.
    """
    if not API_KEY:
        raise ValueError("API key not found in .env file. Please add it.")

    try:
        response = requests.get(f"{BASE_URL}?key={API_KEY}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred: {e}")
        return None

def get_player_news(player_id):
    """
    Fetches recent news for a specific player.
    """
    if not API_KEY:
        raise ValueError("API key not found in .env file. Please add it.")

    try:
        response = requests.get(f"https://api.sportsdata.io/v3/nfl/scores/json/NewsByPlayerID/{player_id}?key={API_KEY}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while fetching news: {e}")
        return None

def get_player_stats(player_id, season="2024"):
    """
    Fetches a player's stats for a specific season.
    """
    if not API_KEY:
        raise ValueError("API key not found in .env file. Please add it.")

    try:
        response = requests.get(f"https://api.sportsdata.io/v3/nfl/stats/json/PlayerSeasonStats/{season}/{player_id}?key={API_KEY}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while fetching stats: {e}")
        return None

def get_player_projections(player_id, season="2025"):
    """
    Fetches a player's projected stats for the upcoming season.
    """
    if not API_KEY:
        raise ValueError("API key not found in .env file. Please add it.")

    try:
        response = requests.get(f"https://api.sportsdata.io/v3/nfl/projections/json/PlayerSeasonProjectionStats/{season}/{player_id}?key={API_KEY}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while fetching projections: {e}")
        return None

def get_all_player_stats(season="2024"):
    """
    Fetches all player stats for a specific season.
    """
    if not API_KEY:
        raise ValueError("API key not found in .env file. Please add it.")

    try:
        response = requests.get(f"https://api.sportsdata.io/v3/nfl/stats/json/PlayerSeasonStats/{season}?key={API_KEY}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while fetching all player stats: {e}")
        return None

def get_all_player_projections(season="2025"):
    """
    Fetches all player projections for a specific season.
    """
    if not API_KEY:
        raise ValueError("API key not found in .env file. Please add it.")

    try:
        response = requests.get(f"https://api.sportsdata.io/v3/nfl/projections/json/PlayerSeasonProjectionStats/{season}?key={API_KEY}")
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"An error occurred while fetching all player projections: {e}")
        return None


if __name__ == '__main__':
    players = get_all_players()
    if players:
        print(f"Successfully fetched {len(players)} players.")
        print("Here's the first player:")
        print(players[0])
        player_id = players[0]['PlayerID']
        news = get_player_news(player_id)
        if news:
            print(f"Successfully fetched {len(news)} news articles.")
            print("Here's the most recent news article:")
            print(news[0])
        stats = get_player_stats(player_id, "2024")
        if stats:
            print(f"Successfully fetched stats for the {stats.get('Season')} season.")
            print(stats)
        projections = get_player_projections(player_id, "2025")
        if projections:
            print(f"Successfully fetched projections for the {projections.get('Season')} season.")
            print(projections)
        
        all_stats = get_all_player_stats()
        if all_stats:
            print(f"Successfully fetched stats for {len(all_stats)} players.")

        all_projections = get_all_player_projections()
        if all_projections:
            print(f"Successfully fetched projections for {len(all_projections)} players.")
