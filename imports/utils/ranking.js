const createRanking = function({battles, calculationsType, numberOfLevsToSkip = 0}) {
  let players = [];

  // Construct players array with array of battle results for each
  battles.forEach(battle => {
    if(battle && battle.results && !battle.results.error) {
      const results = Object.entries(battle.results);

      results && results.forEach(([key, result]) => {
        const index = players.findIndex(player => player && player.name === result.kuski);
        const pointsToGrant = calculatePoints({
          algorithm: calculationsType || 'battle',
          position: result.number,
          numberOfPlayers: results.length
        });

        if(index > -1) {
          players[index].results.push({
            battle: battle.index,
            points: pointsToGrant,
            time: result.time,
          });
        } else {
          players.push({
            name: result.kuski,
            results: [{
              battle: battle.index,
              points: pointsToGrant,
              time: result.time,
            }]
          });
        }
      });
    }
  });

  players.forEach(player => {
    // Sort results by points
    const resultsSorted = player.results.slice(0).sort((a, b) => b.points - a.points);
    const numberOfBattlesPlayed = resultsSorted.length;
    const numberOfBattlesMissed = battles.length - numberOfBattlesPlayed;
    const numberOfLevsToNotCalculate = Math.max(0, numberOfLevsToSkip - numberOfBattlesMissed);

    // Remove worst results based on numberOfLevsToSkip
    const resultsToCalculatePoints = resultsSorted.slice(0, resultsSorted.length - numberOfLevsToNotCalculate);

    // Calculate points
    player.points = resultsToCalculatePoints.reduce((points, battle) => {
      return points + battle.points;
    }, 0);

    // Calculate points for all battles
    player.pointsAll = resultsSorted.reduce((points, battle) => {
      return points + battle.points;
    }, 0);

    player.played = resultsSorted.length;
    player.numberOfLevsCalculated = resultsToCalculatePoints.length;
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
