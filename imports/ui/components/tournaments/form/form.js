import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var'
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Session } from 'meteor/session';

import { Battles } from '/imports/api/battles/battles.js';

import './form.html';
import './form.scss';

Template.tournamentsForm.onCreated(function() {
  Meteor.subscribe('battles.all');

  this.data.players = new ReactiveVar(this.data.players || []);

  if(this.data && this.data._id) {
    this.data.battles = new ReactiveVar(
      this.data.battles.map((battleId) => {
        return { 
          id: battleId,
          name: Battles.findOne(battleId).levelName
        }
      })
    );
  } else {
    this.data.battles = new ReactiveVar([]);
  }
});

Template.tournamentsForm.helpers({
  battles() {
    return this.battles && this.battles.get();
  },
  players() {
    return this.players && this.players.get();
  },
  isOwnTournament() {
    return this.author === Meteor.userId() || Meteor.userId() === 'fRxYRNjepYarpnYCW';
  },
  isCalculationType(type) {
    return this.calculationsType === type;
  }
});

Template.tournamentsForm.events({
  'submit .tournament-form'(event, template) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const { title, description, startingDate, calculationsType, numberOfLevsToSkip } = event.target;

    if(Session.get('editTournament') === this._id) {
      Meteor.call('tournaments.update', {
        title: title.value,
        description: description.value,
        author: Meteor.userId(),
        startingDate: startingDate.value,
        battles: template.data.battles.get(),
        players: template.data.players.get(),
        calculationsType: calculationsType.value,
        numberOfLevsToSkip: numberOfLevsToSkip.value,
        status: this.status,
        id: this._id
      }, (error, result) => {
        if(!error) {
          Session.set('editTournament', null);
        }
      });
    } else {
      Meteor.call('tournaments.insert', {
        title: title.value,
        description: description.value,
        author: Meteor.userId(),
        startingDate: startingDate.value,
        battles: template.data.battles.get(),
        players: template.data.players.get(),
        calculationsType: calculationsType.value,
        numberOfLevsToSkip: numberOfLevsToSkip.value,
        createdAt: new Date(),
      }, (error, result) => {
        if(!error) {
          FlowRouter.go("/tournament/" + result);
          Session.set('editTournament', null);
        }
      });
    }
  },
  'focusout .input-battles'(event, template) {
    const battles = template.data.battles.get()

    battles[event.target.dataset.index] = { id: '', name: event.target.value };

    template.data.battles.set(battles);
  },
  'focusout .input-players'(event, template) {
    const players = template.data.players.get()

    players[event.target.dataset.index] = event.target.value;

    template.data.players.set(players);
  },
  'click .add-battle'(event, template) {
    event.preventDefault();
    const battles = template.data.battles.get();
    battles.push({ id: '', name: `battle-${battles.length + 1}` });
    template.data.battles.set(battles);
  },
  'click .add-player'(event, template) {
    event.preventDefault();
    const players = template.data.players.get();
    players.push(`player-${players.length + 1}`);
    template.data.players.set(players);
  },
  'click .ecp__battle-input .delete-battle'(event, template) {
    event.preventDefault();
    const battles = template.data.battles.get();
    const index = event.target.dataset.index;

    // If battle is in DB (has index) then remove name from it. Else it's just local - remove it.
    if(battles[index].id) {
      battles[index].name = null;
    } else {
      battles.splice(index, 1);
    }

    template.data.battles.set(battles);
  },
  'click .ecp__battle-input .delete-player'(event, template) {
    event.preventDefault();
    const players = template.data.players.get();
    const index = event.target.dataset.index;

    players.splice(index, 1);

    template.data.players.set(players);
  },
  'click .tournament-form-cancel'(event, template) {
    event.preventDefault();
    FlowRouter.go("/tournament/" + this._id);
    Session.set('editTournament', null);
  }
});
