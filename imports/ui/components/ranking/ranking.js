import { Meteor } from 'meteor/meteor';
import { Battles } from '/imports/api/battles/battles.js';
import createRanking from '/imports/utils/ranking.js';
import './ranking.html';
import './ranking.scss';

Template.tournamentsRanking.onCreated(function () {
  Meteor.subscribe('battles.all');
});

Template.tournamentsRanking.helpers({
  players() {
    const battleId = FlowRouter.getQueryParam('battle');
    const isAllPlayersRanking = Session.get('isAllPlayersRanking');

    return !battleId ? (isAllPlayersRanking ? this.ranking : this.rankingSelected) : createRanking({
      battles: [Battles.findOne(battleId)],
      calculationsType: this.calculationsType,
      isAllPlayersRanking
    });
  },
  isFirstIndex(index) {
    return index === 0;
  },
  isBattleActive(battleId) {
    return FlowRouter.getQueryParam('battle') === battleId;
  },
  getActiveBattle() {
    return Battles.findOne(FlowRouter.getQueryParam('battle'));
  },
  getResultTime(player) {
    return player.results[0].time;
  },
  isInfoAboutBattle(battle) {
    return battle.inqueue || battle.aborted || battle.finished || battle.results;
  },
  isOwnTournament() {
    return this.author === Meteor.userId() || Meteor.userId() === 'fRxYRNjepYarpnYCW';
  },
  getBattleStatus(battle) {
    if(battle.inqueue) return 'queued';
    if(battle.aborted) return 'aborted';
    if(battle.finished) return 'finished';
    if(battle.results) return 'in progress';
  }
});

Template.tournamentsRanking.events({
  'click .reload-ranking'(event) {
    event.preventDefault();
    const battleId = FlowRouter.getQueryParam('battle');

    Meteor.call('battle.fetchResults', { battleId });
  }
});
