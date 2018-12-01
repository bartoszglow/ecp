import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Battles } from '/imports/api/battles/battles.js';
import createRanking from '/imports/utils/ranking.js';

import { Tournaments } from './tournaments.js';

Meteor.methods({
  'tournaments.insert'({ title, description, battles, players, author, startingDate, calculationsType, numberOfLevsToSkip }) {

    if(title && description && battles) {
      const battlesAdded = battles.map(({ name }) => Battles.insert({ levelName: name }));

      const tournament = Tournaments.insert({
        title,
        description,
        author,
        startingDate,
        calculationsType,
        numberOfLevsToSkip,
        battles: battlesAdded,
        players,
        status: 'queued',
        createdAt: new Date(),
      });

      return tournament;
    }
  },
});

Meteor.methods({
  'tournaments.update'({ id, battlesIds, title, description, battles, players, author, startingDate, calculationsType, numberOfLevsToSkip, status }) {
    if(title && description && battles) {
      // If there is battle without id - then battle has to be created
      const battlesAdded = battles.filter(({ id }) => !id).map(({ name }) => Battles.insert({ levelName: name }));

      // If there is battle without name - then battle has to be removed from DB and tournament
      const battlesDeleted = battles.filter(({ name }) => !name).map(({ id }) => id);
      battlesDeleted.map(id => Battles.remove(id));

      // Old battles which were not deleted
      const battlesOld = battles.filter(({ id }) => !!id).map(({ id }) => id);

      // Get all old battles, new battles and filter out deleted battles
      const tournamentBattles = [...battlesOld, ...battlesAdded].filter(battleId => battlesDeleted.indexOf(battleId) === -1);

      // console.log(`\n\nBATLES\n\ntournamentBattles: ${tournamentBattles}\n\nbattlesAdded: ${battlesAdded}\n\nbattlesDeleted: ${battlesDeleted}\n\n\n`)

      // Fetch battle info for all tournament battles
      const tournamentBattlesFetched = tournamentBattles.map((battleId) => Battles.findOne(battleId));

      // Check what is tournament status after update
      const tournamentStatus = tournamentBattles.reduce((status, battleId) => {
        const battle = tournamentBattlesFetched.find(({ _id }) => _id === battleId);
        if(battle.results) {
          if(battle.results.error || status === 'in progress') {
            return 'in progress';
          } else {
            return 'finished';
          }
        } else {
          // If there were some finished battles but there is as well some unfinished battle -> change to 'in progress'
          if(status === 'finished') {
            return 'in progress';
          }
        }
        return status;
      }, 'queued')

      const tournament = Tournaments.update(id, {
        title,
        description,
        author,
        startingDate,
        calculationsType,
        numberOfLevsToSkip,
        status: tournamentStatus,
        battles: tournamentBattles,
        players,
        ranking: createRanking({
          battles: tournamentBattlesFetched,
          calculationsType,
          numberOfLevsToSkip,
          numberOfBattlesInTournament: tournamentBattles.length
        }),
        rankingSelected: createRanking({
          battles: tournamentBattlesFetched,
          calculationsType,
          numberOfLevsToSkip,
          numberOfBattlesInTournament: tournamentBattles.length,
          players: players
        })
      });

      return tournament;
    }
  },
});
