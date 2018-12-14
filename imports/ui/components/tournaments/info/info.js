import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';

import { Battles } from '/imports/api/battles/battles.js';
import './info.html';
import './info.scss';

Template.tournamentsInfo.onCreated(function() {
  Meteor.subscribe('battles.all');
  Session.set('isAllPlayersRanking', true);
});

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
  },
  battleNotInQueue(battle) {
    return !!battle.results;
  },
  getAuthorById(authorId) {
    const user = Meteor.users.findOne(authorId);
    return authorId && user && user.profile.name;
  },
  isOwnTournament() {
    return this.author === Meteor.userId() || Meteor.userId() === 'fRxYRNjepYarpnYCW';
  },
  isAllPlayersRanking() {
    return Session.get('isAllPlayersRanking');
  }
});

Template.tournamentsInfo.events({
  'click .choose-battle.btn-success, .choose-battle.btn-warning'(event) {
    const battleId = event.currentTarget.dataset.battleId;
    const queryBattleId = FlowRouter.getQueryParam('battle');
    FlowRouter.setQueryParams({ battle: queryBattleId === event.currentTarget.dataset.battleId ? null : battleId });
  },
  'click .tournaments-info-edit'(event) {
    Session.set('editTournament', this._id);
  },
  'click .choose-player-base'(event) {
    Session.set('isAllPlayersRanking', event.target.value === 'true');
  }
});
