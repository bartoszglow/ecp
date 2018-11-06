// All links-related publications

import { Meteor } from 'meteor/meteor';
import { Battles } from '../battles.js';

Meteor.publish('battles.all', function () {
  return Battles.find();
});
