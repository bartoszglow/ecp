import fetchBattles from '/imports/api/battles/server/fetch-battles.js';
import fetchBattleResults from '/imports/api/battles/server/fetch-battle-results.js';
import { Tournaments } from '/imports/api/tournaments/tournaments.js';
import { Battles } from '/imports/api/battles/battles.js';
import createRanking from '/imports/utils/ranking.js';

Meteor.startup(() => {
  setInterval(() => {
    fetchBattles().then((battles) => {
      const allTournaments = Tournaments.find().fetch();
      const activeTournaments = allTournaments && allTournaments.filter(tournament => tournament.status !== 'finished');
      const tournamentBattlesIds = activeTournaments && activeTournaments.map((torunament => torunament.battles));
      const tournamentBattles = tournamentBattlesIds && [].concat.apply([], tournamentBattlesIds).map(battleId => Battles.findOne(battleId));

      if(tournamentBattles) {
        tournamentBattles.forEach(tournamentBattle => {
          if(!tournamentBattle.results || !!tournamentBattle.results.error) {
            battles.forEach(battle => {
              if(compareBattles(tournamentBattle, battle)) {
                fetchBattleResults(battle.index).then((results) => {
                  if(results) {
                    Battles.update(tournamentBattle._id, { $set: Object.assign({}, battle, { results }) });

                    const tournament = activeTournaments.find(tournament => {
                      return tournament.battles.find(battle => battle === tournamentBattle._id)
                    });

                    if(tournament) {
                      const battlesToCheck = tournament.battles.map(battle => Battles.findOne(battle));

                      const ifTournamentHasUnfinishedBattle = battlesToCheck.filter(battle => !battle.results || battle.results.error).length > 0;

                      Tournaments.update(tournament._id, { $set: {
                        ranking: createRanking({
                          battles: tournament.battles.map(battleId => Battles.findOne(battleId)),
                          calculationsType: tournament.calculationsType,
                          numberOfLevsToSkip: tournament.numberOfLevsToSkip,
                          numberOfBattlesInTournament: tournament.battles.length
                        }),
                        rankingSelected: createRanking({
                          battles: tournament.battles.map(battleId => Battles.findOne(battleId)),
                          calculationsType: tournament.calculationsType,
                          numberOfLevsToSkip: tournament.numberOfLevsToSkip,
                          numberOfBattlesInTournament: tournament.battles.length,
                          players: tournament.players
                        }),
                        status: ifTournamentHasUnfinishedBattle ? 'in progress': 'finished'
                      }});
                    }
                  }
                });
              }
            });
          }
        });
      };
    });
  }, 5000);
});

const compareBattles = (battle1, battle2) => {
  return (battle1.levelName && battle2.level && battle1.levelName == battle2.level) ||
         (battle2.levelname && battle2.levelname.toLowerCase && (battle1.levelName.toLowerCase() === battle2.levelname.toLowerCase()));
}
