import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

// Import needed templates
import '/imports/ui/layouts/main/main.js';
import '/imports/ui/pages/home/home.js';
import '/imports/ui/pages/tournament/tournament.js';
import '/imports/ui/pages/tournament-create/tournament-create.js';
import '/imports/ui/pages/tournaments-list/tournaments-list.js';
import '/imports/ui/pages/not-found/not-found.js';
import '/imports/ui/components/header/header';

// Set up all routes in the app
FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_layout_main', { main: 'App_home', header: 'header' });
  },
});

FlowRouter.route('/tournament/:_id', {
  name: 'App.tournament',
  action() {
    BlazeLayout.render('App_layout_main', { main: 'App_tournament', header: 'header' });
  },
});

FlowRouter.route('/tournament-create', {
  name: 'App.tournamentCreate',
  action() {
    BlazeLayout.render('App_layout_main', { main: 'App_tournament_create', header: 'header' });
  },
});

FlowRouter.route('/tournaments', {
  name: 'App.tournamentsList',
  action() {
    BlazeLayout.render('App_layout_main', { main: 'App_tournaments_list', header: 'header' });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_layout_main', { main: 'App_notFound', header: 'header' });
  },
};
