const createRanking = function({battles, calculationsType}) {
  let players = [];

  battles.forEach(battle => {
    if(battle.results && !battle.results.error) {
      const results = Object.entries(battle.results);

      results && results.forEach(([key, result]) => {
        const index = players.findIndex(player => player && player.name === result.kuski);
        const pointsToGrant = calculatePoints({
          algorithm: calculationsType || 'battle',
          position: result.number,
          numberOfPlayers: results.length
        });

        if(index > -1) {
          players[index].points = players[index].points + pointsToGrant;
          players[index].played = players[index].played + 1;
        } else {
          players.push({
            name: result.kuski,
            points: pointsToGrant,
            time: result.time,
            played: 1
          });
        }
      });
    }
  });

  return players.sort((a, b) => b.points - a.points);
}

const calculatePoints = function({algorithm, position, numberOfPlayers}) {
  if(algorithm === 'cup') {
    return cupPositionToPointsMapping(position);
  }
  if(algorithm === 'battle') {
    return battlePositionToPointsMapping(position, numberOfPlayers);
  }
}

const battlePositionToPointsMapping = function(position, numberOfPlayers) {
  switch (position) {
    case 1: return numberOfPlayers + 2 - position;
    default: return numberOfPlayers + 1 - position;
  }
}

const cupPositionToPointsMapping = function(position) {
  switch (position) {
    case 1: return 100;
    case 2: return 85;
    case 3: return 75;
    case 4: return 70;
    case 5: return 65;
    case 6: return 60;
    case 7: return 56;
    case 8: return 52;
    case 9: return 49;
    case 10: return 46;
    case 11: return 44;
    case 12: return 42;
    case 13: return 38;
    default: return (50 - position) > 0 ? 50 - position : 1;
  }
}

export default createRanking;
