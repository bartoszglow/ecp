import { FlowRouter } from 'meteor/kadira:flow-router';

import { Tournaments } from '/imports/api/tournaments/tournaments.js';

import '/imports/ui/components/tournaments/info/info.js';
import '/imports/ui/components/ranking/ranking.js';
import '/imports/ui/components/players/players.js';

import './tournament.html';

Template.App_tournament.onCreated(function () {
  Meteor.subscribe('tournaments.all');
});

Template.App_tournament.helpers({
  tournament() {
    return Tournaments.findOne(FlowRouter.getParam('_id'));
  },
});
