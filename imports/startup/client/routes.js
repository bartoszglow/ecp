import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '../../ui/layouts/main/main.js';
import '../../ui/pages/home/home.js';
import '../../ui/pages/tournament/tournament.js';
import '../../ui/pages/tournament-create/tournament-create.js';
import '../../ui/pages/tournaments-list/tournaments-list.js';
import '../../ui/pages/not-found/not-found.js';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_layout_main', { main: 'App_home' });
  },
});

FlowRouter.route('/tournament/:_id', {
  name: 'App.tournament',
  action() {
    BlazeLayout.render('App_layout_main', { main: 'App_tournament' });
  },
});

FlowRouter.route('/tournament-create', {
  name: 'App.tournamentCreate',
  action() {
    BlazeLayout.render('App_layout_main', { main: 'App_tournament_create' });
  },
});

FlowRouter.route('/tournaments', {
  name: 'App.tournamentsList',
  action() {
    BlazeLayout.render('App_layout_main', { main: 'App_tournaments_list' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_layout_main', { main: 'App_notFound' });
  },
};
