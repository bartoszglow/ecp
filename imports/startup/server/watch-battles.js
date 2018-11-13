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
      const tournamentsToCalculatePoints = [];

      if(tournamentBattles) {
        tournamentBattles.forEach(tournamentBattle => {
          if(!tournamentBattle.results || !!tournamentBattle.results.error) {
            battles.forEach(battle => {
              if(tournamentBattle.levelName && battle.levelname && tournamentBattle.levelName.toLowerCase() === battle.levelname.toLowerCase()) {
                fetchBattleResults(battle.index).then((results) => {
                  if(results) {
                    Battles.update(tournamentBattle._id, { $set: Object.assign({}, battle, { results }) });

                    const tournament = Tournaments.findOne(tournamentBattle.tournamentId);

                    if(tournament) {
                      const battlesToCheck = Battles.find({ tournamentId: tournament._id }).fetch();

                      const ifTournamentHasUnfinishedBattle = battlesToCheck.filter(battle => !battle.results || battle.results.error).length > 0;

                      Tournaments.update(tournament._id, { $set: {
                        ranking: createRanking({
                          battles: Battles.find({"_id": { "$in": tournament.battles }}).fetch(),
                          calculationsType: tournament.calculationsType
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
