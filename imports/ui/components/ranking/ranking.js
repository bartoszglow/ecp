import { Meteor } from 'meteor/meteor';
import { Battles } from '/imports/api/battles/battles.js';
import createRanking from '/imports/utils/ranking.js';
import './ranking.html';

Template.tournamentsRanking.onCreated(function () {
  Meteor.subscribe('battles.all');
});

Template.tournamentsRanking.helpers({
  players() {
    const battleId = FlowRouter.getQueryParam('battle');

    return !battleId ? this.ranking : createRanking({
      battles: [Battles.findOne(battleId)],
      calculationsType: this.calculationsType
    });
  },
  isFirstIndex(index) {
    return index === 0;
  },
  isBattleActive(battleId) {
    return FlowRouter.getQueryParam('battle') === battleId;
  },
  getActiveBattle() {
    console.log(Battles.findOne(FlowRouter.getQueryParam('battle')));
    return Battles.findOne(FlowRouter.getQueryParam('battle'));
  },
  isInfoAboutBattle(battle) {
    return battle.inqueue || battle.aborted || battle.finished || battle.results;
  },
  getBattleStatus(battle) {
    if(battle.inqueue) return 'queued';
    if(battle.aborted) return 'aborted';
    if(battle.finished) return 'finished';
    if(battle.results) return 'in progress';
  }
});
