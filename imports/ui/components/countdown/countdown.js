import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import moment from 'moment';

import './countdown.html';
import './countdown.scss';

Template.countdown.onCreated(function () {
  var eventTime = moment(this.data && this.data.startingDate || 1540663200);

  Session.set('releaseDate', `(${eventTime.format("Do MMM YYYY, HH:mm")} CET)`);

  Session.set('timer', countTimer(eventTime));

  this.timerInterval = Meteor.setInterval(() => {
    Session.set('timer', countTimer(eventTime));
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

const countTimer = function(eventTime) {
  const eventTimeUnix = eventTime.unix();
  const currentTimeUnix = moment().unix();
  const diffTime = eventTimeUnix - currentTimeUnix;
  const duration = moment.duration(diffTime * 1000, 'milliseconds');
  const interval = 1000;

  const durationDiff = moment.duration(duration - interval, 'milliseconds');

  return durationDiff.days() * 24 + durationDiff.hours() + "h : " + durationDiff.minutes() + "m : " + durationDiff.seconds() + "s";
}