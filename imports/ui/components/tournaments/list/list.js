import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Tournaments } from '/imports/api/tournaments/tournaments.js';
import './list.html';
import './list.scss';

Template.tournamentsList.onCreated(function () {
  Meteor.subscribe('tournaments.all');
});

Template.tournamentsList.helpers({
  tournaments() {
    return Tournaments.find({});
  },
  getNumberOfPlayers(tournament) {
    return tournament.ranking && tournament.ranking.length;
  },
  getNumberOfBattles(tournament) {
    return tournament.battles.length;
  },
  getLeader(tournament) {
    return tournament.ranking && tournament.ranking[0] && tournament.ranking[0].name;
  }
});

Template.tournamentsList.events({
  'submit .info-link-add'(event) {
    event.preventDefault();

    const target = event.target;
    const title = target.title;
    const url = target.url;

    Meteor.call('tournaments.insert', title.value, url.value, (error) => {
      if (error) {
        alert(error.error);
      } else {
        title.value = '';
        url.value = '';
      }
    });
  },
  'click .ecp__tournament-row'(event) {
    const index = event.currentTarget.dataset.tournamentId;
    FlowRouter.go(`/tournament/${index}`);
  },
  'click .ecp__tournament-create'() {
    FlowRouter.go(`/tournament-create`);
  }
});
