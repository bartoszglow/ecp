// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Battles } from './battles.js';
import fetchBattleResults from '/imports/api/battles/server/fetch-battle-results.js';
import { Tournaments } from '/imports/api/tournaments/tournaments.js';

Meteor.methods({
  'battles.insert'(data) {
    return Battles.insert({
      ...data,
      createdAt: new Date(),
    });
  },
  'battle.update'({ battleId, battle, results }) {
    const battleAdded = Battles.update(battleId, { $set: Object.assign({}, battle, { results }) });
    const tournaments = Tournaments.find().fetch().filter(tournament => tournament.battles.find(tournamentBattle => tournamentBattle === battleId))

    tournaments.forEach(tournament => {
      Meteor.call('tournament.calculateRanking', {
        tournament: tournament
      });
    });
  },
  'battle.fetchResults'({ battleId }) {
    const battle = Battles.findOne(battleId);
    
    fetchBattleResults(battle.index).then((results) => {
      if(results) {
        Meteor.call('battle.update', { battleId, battle, results })
      }
    });
  },
  'battle.updatePlayerPosition'({ battleId, positionFrom, positionTo }) {
    const results = Battles.findOne(battleId).results;

    const resultFrom = results[positionFrom];
    const resultTo = results[positionTo];

    resultFrom.number = positionTo;
    resultTo.number = positionFrom;

    results[positionFrom] = resultTo;
    results[positionTo] = resultFrom;

    Battles.update(battleId, { $set: { results } });

    const tournaments = Tournaments.find().fetch().filter(tournament => tournament.battles.find(tournamentBattle => tournamentBattle === battleId))

    tournaments.forEach(tournament => {
      Meteor.call('tournament.calculateRanking', {
        tournament: tournament
      });
    });
  }
});
