export function calculate_fantasy_points(player_data, scoring_format = 'ppr') {
    if (!player_data) {
        return 0;
    }

    const standard_points = player_data.FantasyPoints || 0;
    const ppr_points = player_data.FantasyPointsPPR || standard_points;

    if (scoring_format === 'std') {
        return standard_points;
    }
    if (scoring_format === 'ppr') {
        return ppr_points;
    }
    if (scoring_format === 'half_ppr') {
        return (standard_points + ppr_points) / 2;
    }
    return ppr_points;
}
