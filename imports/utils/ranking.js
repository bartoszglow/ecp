const createRanking = function(battleInfo) {
  const {
    battles,
    calculationsType,
    numberOfLevsToSkip = 0,
    numberOfBattlesInTournament = 1
  } = battleInfo;

  const players = (battleInfo.players && battleInfo.players.map(player => { return { name: player, results: [] } })) || [];

  const isAllPlayersRanking = players.length === 0;

  // Construct players array with array of battle results for each
  battles.forEach(battle => {
    if(battle && battle.results && !battle.results.error) {
      let results = Object.entries(battle.results);

      // If not all players ranking then filter results to create ranking from selected kuskis only
      if(!isAllPlayersRanking) {
        results = results.filter(([key, result]) =>
          players.findIndex(player => player && player.name.toLowerCase() === result.kuski.toLowerCase()) > -1
        );
      }

      results && results.forEach(([key, result], index) => {
        const playerIndex = players.findIndex(player => player && player.name.toLowerCase() === result.kuski.toLowerCase());
        const position = index + 1;
        const pointsToGrant = calculatePoints({
          algorithm: calculationsType || 'battle',
          numberOfPlayers: results.length,
          position
        });

        if(playerIndex > -1) {
          players[playerIndex].results.push({
            battle: battle.playerIndex,
            points: pointsToGrant,
            time: result.time,
            position
          });
        } else {
          players.push({
            name: result.kuski,
            results: [{
              battle: battle.playerIndex,
              points: pointsToGrant,
              time: result.time,
              position
            }]
          });
        }
      });
    }
  });

  players.forEach(player => {
    // Sort results by points
    const resultsSorted = player.results && player.results.slice(0).sort((a, b) => b.points - a.points);
    const numberOfBattlesPlayed = resultsSorted.length;
    const numberOfLevsToNotCalculate = Math.max(0, (parseInt(numberOfBattlesPlayed, 10) + parseInt(numberOfLevsToSkip, 10)) - parseInt(numberOfBattlesInTournament, 10));

    // Remove worst results based on numberOfLevsToSkip
    const resultsToCalculatePoints = resultsSorted.slice(0, resultsSorted.length - numberOfLevsToNotCalculate);

    // Calculate points
    player.points = resultsToCalculatePoints.reduce((points, battle) => {
      return points + battle.points;
    }, 0);

    // Calculate points for all battles
    player.pointsAll = player.results.reduce((points, battle) => {
      return points + battle.points;
    }, 0);

    // Calculate points
    player.numberOfWins = player.results.reduce((numberOfWins, battle) => {
      return battle.position === 1 ? numberOfWins + 1 : numberOfWins;
    }, 0);

    player.played = resultsSorted.length;
    player.numberOfLevsCalculated = resultsToCalculatePoints.length;
  });

  const sortedPlayers = players.sort((a, b) => {
    if(b.points === a.points) {
      if(b.numberOfWins === a.numberOfWins) {
        return b.pointsAll - a.pointsAll;
      } else {
        return b.numberOfWins - a.numberOfWins;
      }
    } else {
      return b.points - a.points;
    }
  });

  sortedPlayers.forEach((player, index, arr) => {
    const previousPlayer = arr[index -1];

    if(previousPlayer && previousPlayer.points === player.points) {
      player.position = previousPlayer.position;
    } else {
      player.position = index + 1;
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
