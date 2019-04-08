import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { ReactiveVar } from 'meteor/reactive-var'
import moment from 'moment';
import 'moment-timezone';

import './countdown.html';
import './countdown.scss';

Template.countdown.onCreated(function () {
  const eventTime = moment.tz(moment(moment(this.data.date).unix() * 1000), this.data.timezone);

  this.data.releaseDate = new ReactiveVar(countReleaseDate(eventTime, this.data.timezone));

  this.data.timer = new ReactiveVar(countTimer(eventTime, this.data.timezone));

  this.timerInterval = Meteor.setInterval(() => {
    this.data.timer.set(countTimer(eventTime, this.data.timezone));
  }, 1000);
});

Template.countdown.helpers({
  countdown() {
    if(!this.timer) {
      const eventTime = moment(moment(this.date).unix() * 1000);
      this.releaseDate = new ReactiveVar(countReleaseDate(eventTime, this.timezone));
      this.timer = new ReactiveVar(countTimer(eventTime, this.timezone));
    }
    return this.timer.get('timer');
  },
  releaseDate() {
    if(!this.releaseDate) {
      const eventTime = moment(moment(this.date).unix() * 1000);
      this.releaseDate = new ReactiveVar(countReleaseDate(eventTime, this.timezone));
    }
    return this.releaseDate.get();
  }
});

Template.countdown.onDestroyed(function () {
  Meteor.clearInterval(this.timerInterval);
});

const countTimer = function(eventTime, timezone) {
  const eventTimeUnix = eventTime.unix();
  const currentTimeUnix = moment().unix();
  const diffTime = eventTimeUnix - currentTimeUnix;

  const timezoneLocal = moment.utc();
  const eventToUTCdiff = moment.tz.zone(timezone || 'Europe/Helsinki').utcOffset(timezoneLocal);
  const localToUTCdiff = moment.tz.zone(moment.tz.guess()).utcOffset(timezoneLocal);
  const timezoneDiff = eventToUTCdiff - localToUTCdiff;

  const duration = moment.duration(diffTime * 1000 + timezoneDiff * 60 * 1000, 'milliseconds');
  const interval = 1000;

  const durationDiff = moment.duration(duration - interval, 'milliseconds');

  return durationDiff.days() * 24 + durationDiff.hours() + "h : " + durationDiff.minutes() + "m : " + durationDiff.seconds() + "s";
}

const countReleaseDate = function(eventTime, timezone) {
  const timezoneLocal = moment.utc();
  const eventToUTCdiff = moment.tz.zone(timezone || 'Europe/Helsinki').utcOffset(timezoneLocal);
  const localToUTCdiff = moment.tz.zone(moment.tz.guess()).utcOffset(timezoneLocal);
  const timezoneDiff = eventToUTCdiff - localToUTCdiff;

  const eventTimeUnix = eventTime.unix();

  return `${moment(eventTimeUnix * 1000 + timezoneDiff * 60 * 1000).format('MMMM Do YYYY, HH:mm')} (${moment.tz.guess()})`;
}