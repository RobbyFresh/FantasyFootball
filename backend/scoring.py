def calculate_fantasy_points(player_stats, scoring_format='ppr'):
    """
    Calculates fantasy points for a player based on their stats and a given scoring format.
    This version uses the pre-calculated points from the API.
    """
    if not player_stats:
        return 0

    standard_points = player_stats.get('FantasyPoints', 0) or 0
    ppr_points = player_stats.get('FantasyPointsPPR', standard_points) or standard_points

    if scoring_format == 'std':
        return standard_points
    
    if scoring_format == 'ppr':
        return ppr_points
        
    if scoring_format == 'half_ppr':
        return (standard_points + ppr_points) / 2
        
    return ppr_points # Default to PPR
