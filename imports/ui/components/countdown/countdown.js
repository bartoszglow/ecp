import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var'
import moment from 'moment';

import './countdown.html';
import './countdown.scss';

Template.countdown.onCreated(function () {
  const eventTime = moment(moment(this.data.date).unix() * 1000);

  this.data.releaseDate = new ReactiveVar(`(${eventTime.format("Do MMM YYYY, HH:mm")} CET)`);

  this.data.timer = new ReactiveVar(countTimer(eventTime));

  this.timerInterval = Meteor.setInterval(() => {
    this.data.timer.set(countTimer(eventTime));
  }, 1000);
});

Template.countdown.helpers({
  countdown() {
    if(!this.timer) {
      const eventTime = moment(moment(this.date).unix() * 1000);
      this.releaseDate = new ReactiveVar(`(${eventTime.format("Do MMM YYYY, HH:mm")} CET)`);
      this.timer = new ReactiveVar(countTimer(eventTime));
    }
    return this.timer.get('timer');
  },
  releaseDate() {
    if(!this.releaseDate) {
      const eventTime = moment(moment(this.date).unix() * 1000);
      this.releaseDate = new ReactiveVar(`(${eventTime.format("Do MMM YYYY, HH:mm")} CET)`);
    }
    return this.releaseDate.get();
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