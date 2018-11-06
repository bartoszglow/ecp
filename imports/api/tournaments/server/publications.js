// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Tournaments } from '../tournaments.js';

Meteor.publish('tournaments.all', function () {
  return Tournaments.find();
});
