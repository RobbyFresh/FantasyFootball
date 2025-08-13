import React from 'react';
import './MyTeam.css';

function MyTeam({ team }) {
  const roster = {
    'QB': [],
    'RB': [],
    'WR': [],
    'TE': [],
    'K': [],
    'DEF': [],
    'BENCH': [],
  };

  team.forEach(player => {
    if (roster[player.Position]) {
        // Simple logic to fill starting positions first
        if (roster[player.Position].length < (player.Position === 'QB' || player.Position === 'TE' || player.Position === 'K' || player.Position === 'DEF' ? 1 : 2)) {
            roster[player.Position].push(player);
        } else {
            roster.BENCH.push(player);
        }
    } else {
        roster.BENCH.push(player);
    }
  });

  return (
    <div className="my-team-panel">
      <h2>My Team</h2>
      {Object.keys(roster).map(pos => (
        <div key={pos} className="position-group">
          <strong>{pos}</strong>
          {roster[pos].length > 0 ? (
            roster[pos].map(p => (
              <div key={p.PlayerID} className="team-player">
                <span className="player-name">{p.Name}</span>
                <span className="player-team">({p.Team})</span>
              </div>
            ))
          ) : (
            <div className="empty-slot">Empty</div>
          )}
        </div>
      ))}
    </div>
  );
}

export default MyTeam;
