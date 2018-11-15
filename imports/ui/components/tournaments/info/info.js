import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Battles } from '/imports/api/battles/battles.js';
import './info.html';

Template.tournamentsInfo.helpers({
  getBattle(battleId) {
    return Battles.findOne(battleId);
  },
  isBattleActive(battleId) {
    return FlowRouter.getQueryParam('battle') === battleId;
  },
  battleFinished(battle) {
    return battle.results && !battle.results.error;
  },
  battleInProgress(battle) {
    return battle.results && !!battle.results.error;
  }
});

Template.tournamentsInfo.events({
  'click .choose-battle.btn-success'(event) {
    const battleId = event.currentTarget.dataset.battleId;
    const queryBattleId = FlowRouter.getQueryParam('battle');
    FlowRouter.setQueryParams({ battle: queryBattleId === event.currentTarget.dataset.battleId ? null : battleId });
  }
});
