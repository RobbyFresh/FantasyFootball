import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import PlayerModal from './PlayerModal';
import MyTeam from './MyTeam';
import Pagination from './Pagination';

function App() {
  const [players, setPlayers] = useState([]);
  const [myTeam, setMyTeam] = useState([]);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'adp', direction: 'ascending' });
  const [scoringFormat, setScoringFormat] = useState('ppr');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerDetails, setPlayerDetails] = useState(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  const positionOrder = { 'QB': 1, 'RB': 2, 'WR': 3, 'TE': 4, 'K': 5, 'DEF': 6 };
  const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

  useEffect(() => {
    const fetchPlayers = async () => {
      setIsLoading(true);
      setError(null);
      const params = new URLSearchParams({
        searchTerm,
        positionFilter,
        teamFilter,
        sortKey: sortConfig.key,
        sortDirection: sortConfig.direction,
        scoringFormat,
        page: currentPage,
      });

      try {
        const response = await fetch(`${API_URL}/api/players?${params.toString()}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        if (data.status === 'success') {
          setPlayers(data.data.players);
          setTotalPages(data.data.totalPages);
        } else {
          setError(data.message || 'Failed to fetch players.');
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPlayers();
  }, [searchTerm, positionFilter, teamFilter, sortConfig, scoringFormat, currentPage]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
      key = 'adp';
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  };

  const getSortArrow = (columnKey) => {
    if (sortConfig.key === columnKey) {
      if (sortConfig.direction === 'ascending') return ' ▲';
      if (sortConfig.direction === 'descending') return ' ▼';
    }
    return '';
  };

  const handlePlayerClick = async (player) => {
    setSelectedPlayer(player);
    setIsLoadingDetails(true);
    try {
      const response = await fetch(`${API_URL}/api/player/${player.PlayerID}`);
      const data = await response.json();
      if (data.status === 'success') {
        setPlayerDetails(data.data);
      } else {
        console.error("Failed to fetch player details");
        setPlayerDetails({ news: [], stats: {}, projections: {} });
      }
    } catch (error) {
      console.error("Error fetching player details:", error);
      setPlayerDetails({ news: [], stats: {}, projections: {} });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedPlayer(null);
    setPlayerDetails(null);
  };

  const handleDraftPlayer = (player) => {
    setMyTeam(prevTeam => [...prevTeam, player]);
    setPlayers(prevPlayers => prevPlayers.filter(p => p.PlayerID !== player.PlayerID));
    handleCloseModal();
  };
  
  const handleImageError = (e) => {
    e.target.onerror = null; 
    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGNsYXNzPSJsdWNpZGUgbHVjaWRlLXVzZXItY2lyY2xlIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxjaXJjbGUgY3g9IjEyIiBjeT0iMTAiIHI9IjMiLz48cGF0aCBkPSJNNyAxOC42NjJhOS45IDkuOSAwIDAgMSAxMC4wMSAwbDAgMCIvPjwvc3ZnPg==';
  }

  return (
    <div className="App">
      <div className="main-content">
        <header className="App-header">
          <h1>Fantasy Football Draft Assistant</h1>
        </header>

        <div className="filters">
          <input
            type="text"
            placeholder="Search Player..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select value={positionFilter} onChange={(e) => setPositionFilter(e.target.value)}>
            <option value="">All Positions</option>
            {Object.keys(positionOrder).sort((a, b) => positionOrder[a] - positionOrder[b]).map(pos => (
              <option key={pos} value={pos}>{pos}</option>
            ))}
            <option value="FLEX">Flex (RB/WR/TE)</option>
            <option value="SUPERFLEX">Superflex (QB/RB/WR/TE)</option>
          </select>
          <select value={teamFilter} onChange={(e) => setTeamFilter(e.target.value)}>
            <option value="">All Teams</option>
            {[...new Set(players.map(p => p.Team))].sort().map(team => (
              team && <option key={team} value={team}>{team}</option>
            ))}
          </select>
          <select value={scoringFormat} onChange={(e) => setScoringFormat(e.target.value)}>
            <option value="ppr">PPR</option>
            <option value="half_ppr">0.5 PPR</option>
            <option value="standard">Standard</option>
          </select>
        </div>
        
        {isLoading ? (
          <p>Loading players...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : (
          <>
            <div className="player-table-container">
              <table className="player-table">
                <thead>
                  <tr>
                    <th onClick={() => requestSort('Name')}>Name{getSortArrow('Name')}</th>
                    <th onClick={() => requestSort('Position')}>Position{getSortArrow('Position')}</th>
                    <th onClick={() => requestSort('Team')}>Team{getSortArrow('Team')}</th>
                    <th onClick={() => requestSort('stats')}>2024 Pts{getSortArrow('stats')}</th>
                    <th onClick={() => requestSort('projections')}>2025 Proj.{getSortArrow('projections')}</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map(player => (
                    <tr key={player.PlayerID} onClick={() => handlePlayerClick(player)}>
                      <td>
                          <div style={{ display: 'flex', alignItems: 'center' }}>
                              <img 
                                  src={player.PhotoUrl} 
                                  alt={player.Name} 
                                  className="player-headshot"
                                  onError={handleImageError}
                              />
                              {player.Name}
                          </div>
                      </td>
                      <td>{player.Position}</td>
                      <td>{player.Team}</td>
                      <td>{player.Stats?.FantasyPoints?.toFixed(2) ?? 'N/A'}</td>
                      <td>{player.Projections?.FantasyPoints?.toFixed(2) ?? 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>

      <MyTeam team={myTeam} />

      {selectedPlayer && (
        <PlayerModal
          player={selectedPlayer}
          details={playerDetails}
          isLoading={isLoadingDetails}
          onClose={handleCloseModal}
          onDraft={handleDraftPlayer}
          scoringFormat={scoringFormat}
          onImageError={handleImageError}
        />
      )}
    </div>
  );
}

export default App;
