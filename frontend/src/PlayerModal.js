import React from 'react';
import './PlayerModal.css';

function PlayerModal({ player, details, isLoading, onClose, onDraft, onImageError }) {
  if (!player) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>X</button>
        <div className="modal-header">
          <img 
            src={player.PhotoUrl} 
            alt={player.Name} 
            className="modal-headshot"
            onError={onImageError}
          />
          <h2>{player.Name} ({player.Position} - {player.Team})</h2>
        </div>
        <div className="player-details">
          {isLoading ? (
            <p>Loading details...</p>
          ) : details ? (
            <>
              <div className="detail-section">
                <h3>Recent News</h3>
                {details.news && details.news.length > 0 ? (
                  <ul>
                    {details.news.slice(0, 3).map(n => (
                      <li key={n.NewsID}>
                        <strong>{n.Title}</strong> - <span>{new Date(n.Updated).toLocaleDateString()}</span>
                        <p>{n.Content}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No recent news available.</p>
                )}
              </div>
              
              <div className="detail-section stats-grid">
                <div>
                    <h3>2024 Season Stats</h3>
                    {details.stats ? (
                      <p>Fantasy Points: {details.stats.FantasyPoints?.toFixed(2) ?? 'N/A'}</p>
                    ) : (
                      <p>No stats available for the 2024 season.</p>
                    )}
                </div>
                <div>
                    <h3>2025 Season Projections</h3>
                    {details.projections ? (
                      <p>Projected Points: {details.projections.FantasyPoints?.toFixed(2) ?? 'N/A'}</p>
                    ) : (
                      <p>No projections available for the 2025 season.</p>
                    )}
                </div>
              </div>
            </>
          ) : (
            <p>Could not load player details.</p>
          )}
        </div>
        <button className="draft-button" onClick={() => onDraft(player)}>Draft Player</button>
      </div>
    </div>
  );
}

export default PlayerModal;
