import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import moment from 'moment';

import './countdown.html';
import './countdown.scss';

Template.countdown.onCreated(function () {
  var eventTime = 1540663200;

  Session.set('releaseDate', `(${moment(eventTime * 1000).format("Do MMM YYYY, HH:mm")})`);

  Session.set('timer', countTimer());

  this.timerInterval = Meteor.setInterval(() => {
    Session.set('timer', countTimer());
  }, 1000)
});

Template.countdown.helpers({
  countdown() {
    return Session.get('timer');
  },
  releaseDate() {
    return Session.get('releaseDate');
  }
});

Template.countdown.onDestroyed(function () {
  Meteor.clearInterval(this.timerInterval);
});

const countTimer = function() {
  const eventTime = 1540663200;
  const currentTime = moment().unix();
  const diffTime = eventTime - currentTime;
  const duration = moment.duration(diffTime * 1000, 'milliseconds');
  const interval = 1000;

  const durationDiff = moment.duration(duration - interval, 'milliseconds');

  return durationDiff.days() * 24 + durationDiff.hours() + "h : " + durationDiff.minutes() + "m : " + durationDiff.seconds() + "s";
}