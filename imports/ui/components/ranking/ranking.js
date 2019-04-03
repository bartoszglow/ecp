import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var'
import { Battles } from '/imports/api/battles/battles.js';
import createRanking from '/imports/utils/ranking.js';
import './ranking.html';
import './ranking.scss';

Template.tournamentsRanking.onCreated(function () {
  Meteor.subscribe('battles.all');
  this.players = new ReactiveVar();
});

Template.tournamentsRanking.helpers({
  players() {
    const battleId = FlowRouter.getQueryParam('battle');
    const isAllPlayersRanking = Session.get('isAllPlayersRanking');

    const ranking = createRanking({
      battles: [Battles.findOne(battleId)],
      calculationsType: this.calculationsType,
      isAllPlayersRanking
    });

    Template.instance().players.set(ranking);

    return !battleId ? (isAllPlayersRanking ? this.ranking : this.rankingSelected) : ranking;
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
  },
  previousHasSameScore(position) {
    const players = Template.instance().players.get();

    return players && players[position - 2] && players[position - 1] && players[position - 2].results[0].time === players[position - 1].results[0].time;
  },
  nextHasSameScore(position) {
    const players = Template.instance().players.get();

    return players && players[position] && players[position - 1] && players[position].results[0].time === players[position - 1].results[0].time;
  }
});

Template.tournamentsRanking.events({
  'click .reload-ranking'(event) {
    event.preventDefault();
    const battleId = FlowRouter.getQueryParam('battle');

    Meteor.call('battle.fetchResults', { battleId });
  },
  'click .move-player-up'(event) {
    Meteor.call('battle.updatePlayerPosition', { battleId: FlowRouter.getQueryParam('battle'), positionFrom: this.position, positionTo: this.position - 1 });
  },
  'click .move-player-down'(event) {
    Meteor.call('battle.updatePlayerPosition', { battleId: FlowRouter.getQueryParam('battle'), positionFrom: this.position, positionTo: this.position + 1 });
  }
});
