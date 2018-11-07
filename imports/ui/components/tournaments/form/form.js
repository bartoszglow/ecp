import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var'
import './form.html';
import './form.scss';

Template.tournamentsForm.onCreated(function () {
  this.data.battles = new ReactiveVar([]);
});

Template.tournamentsForm.helpers({
  battles() {
    return this.battles.get();
  },
});

Template.tournamentsForm.events({
  'submit .new-tournament'(event, template) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const { title, description, author, startingDate, calculationsType } = event.target;

    title.value;

    Meteor.call('tournaments.insert', {
      title: title.value,
      description: description.value,
      author: author.value,
      startingDate: startingDate.value,
      battles: template.data.battles.get(),
      calculationsType: calculationsType.value,
      createdAt: new Date(),
    }, (error, result) => {
      if(!error) {
        FlowRouter.go("/tournament/" + result);
      }
    });
  },
  'focusout .input-battles'(event, template) {
    const index = event.target.dataset.index;
    const value = event.target.value;
    let battles = template.data.battles.get();
    battles[index] = value;
    template.data.battles.set(battles);
  },
  'click .add-battle'(event, template) {
    const battles = template.data.battles.get();
    battles.push(`battle-${battles.length + 1}`);
    template.data.battles.set(battles);
  },
  'click .ecp__battle-input button'(event, template) {
    event.preventDefault();
    const battles = template.data.battles.get();
    const index = event.target.dataset.index;
    battles.splice(index, 1);
    template.data.battles.set(battles);
  }
});
