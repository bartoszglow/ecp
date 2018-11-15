// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Battles } from '/imports/api/battles/battles.js';
import { Tournaments } from './tournaments.js';

Meteor.methods({
  'tournaments.insert'({ title, description, battles, author, startingDate, calculationsType, numberOfLevsToSkip }) {
    // check(url, String);
    // check(title, String);

    if(title && description && battles) {
      const battlesAdded = battles.map(battle => Battles.insert({ levelName: battle }));

      const tournament = Tournaments.insert({
        title,
        description,
        author,
        startingDate,
        calculationsType,
        numberOfLevsToSkip,
        battles: battlesAdded,
        status: 'queued',
        createdAt: new Date(),
      });

      battlesAdded.forEach(battle => Battles.update(battle, { $set: { tournamentId: tournament }}));

      return tournament;
    }
  },
});
