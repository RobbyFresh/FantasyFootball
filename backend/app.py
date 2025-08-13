import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from data_source import get_all_players, get_all_player_projections, get_all_player_stats, get_player_news
from scoring import calculate_fantasy_points
import math

app = Flask(__name__)
CORS(app)

# In-memory cache for player data to avoid repeated API calls
player_cache = None

def get_player_data():
    """Fetches and caches player data."""
    global player_cache
    if player_cache is None:
        print("Fetching and caching player data...")
        players = get_all_players()
        stats = get_all_player_stats("2024")
        projections = get_all_player_projections("2025")
        
        stats_map = {s['PlayerID']: s for s in stats}
        projections_map = {p['PlayerID']: p for p in projections}
        
        player_cache = [
            {
                **player, 
                'Stats': stats_map.get(player['PlayerID'], {}),
                'Projections': projections_map.get(player['PlayerID'], {})
            }
            for player in players
        ]
    return player_cache

@app.route('/api/players')
def players():
    all_players = get_player_data()
    
    # Get query parameters
    search_term = request.args.get('searchTerm', '')
    position_filter = request.args.get('positionFilter', '')
    team_filter = request.args.get('teamFilter', '')
    scoring_format = request.args.get('scoringFormat', 'ppr')
    sort_key = request.args.get('sortKey', 'adp')
    sort_direction = request.args.get('sortDirection', 'ascending')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 100))

    # Recalculate points
    recalculated_players = [
        {
            **p,
            'Stats': {
                **p['Stats'],
                'FantasyPoints': calculate_fantasy_points(p['Stats'], scoring_format) * 2.44
            },
            'Projections': {
                **p['Projections'],
                'FantasyPoints': calculate_fantasy_points(p['Projections'], scoring_format)
            }
        } for p in all_players
    ]

    # Filtering
    processed_players = recalculated_players
    if search_term:
        processed_players = [p for p in processed_players if search_term.lower() in p['Name'].lower()]
    if position_filter:
        if position_filter == 'FLEX':
            processed_players = [p for p in processed_players if p['Position'] in ['RB', 'WR', 'TE']]
        elif position_filter == 'SUPERFLEX':
            processed_players = [p for p in processed_players if p['Position'] in ['QB', 'RB', 'WR', 'TE']]
        else:
            processed_players = [p for p in processed_players if p['Position'] == position_filter]
    if team_filter:
        processed_players = [p for p in processed_players if p['Team'] == team_filter]
    
    excluded_positions = ['P', 'G', 'C', 'OL']
    processed_players = [p for p in processed_players if p['Position'] not in excluded_positions]
    
    # Sorting
    reverse_sort = sort_direction == 'descending'
    
    def sort_logic(p):
        if sort_key == 'adp': return p.get('AverageDraftPosition') or 999
        if sort_key == 'stats': return p['Stats'].get('FantasyPoints') or 0
        if sort_key == 'projections': return p['Projections'].get('FantasyPoints') or 0
        return p.get(sort_key) or ''
        
    processed_players.sort(key=sort_logic, reverse=reverse_sort)

    # Pagination
    total_pages = math.ceil(len(processed_players) / limit)
    start_index = (page - 1) * limit
    end_index = start_index + limit
    paginated_players = processed_players[start_index:end_index]

    return jsonify({
        "status": "success",
        "data": {
            "players": paginated_players,
            "totalPages": total_pages
        }
    })

@app.route('/api/player/<int:player_id>')
def player_details(player_id):
    try:
        news = get_player_news(player_id)
        # We fetch stats and projections again here for the specific player
        stats = get_all_player_stats("2024") 
        projections = get_all_player_projections("2025")
        
        player_stats = next((s for s in stats if s['PlayerID'] == player_id), None)
        player_projections = next((p for p in projections if p['PlayerID'] == player_id), None)

        player_data = {
            "news": news,
            "stats": player_stats,
            "projections": player_projections,
        }
        return jsonify({"status": "success", "data": player_data})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

if __name__ == '__main__':
    get_player_data()
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
