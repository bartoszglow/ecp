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
  isBattleActive(battleId) {
    return FlowRouter.getQueryParam('battle') === battleId;
  },
  onlyOneLevDisplayed() {
    return !!FlowRouter.getQueryParam('battle');
  }
});
