// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Battles } from './battles.js';

Meteor.methods({
  'battles.insert'(data) {
    // check(url, String);
    // check(title, String);

    return Battles.insert({
      ...data,
      createdAt: new Date(),
    });
  },
});
