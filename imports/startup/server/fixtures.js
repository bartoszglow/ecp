// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { Battles } from '../../api/battles/battles.js';
import { Tournaments } from '../../api/tournaments/tournaments.js';

Meteor.startup(() => {
  // if (Battles.find().count() === 0) {
  //   const data = [
  //     {
  //       levelName: 'Fatale34',
  //       results: []
  //     },
  //     {
  //       levelName: 'jtands47',
  //       results: []
  //     }
  //   ];
  // 
  //   data.forEach(battle => Battles.insert(battle));
  // }
  //   console.log('battles: ', Battles.find().fetch());
  // if (Tournaments.find().count() === 0) {
  //   const data = [
  //     {
  //       title: 'MiszPi CUP!',
  //       description: 'Who\'s the worst player in piping?!',
  //       type: 'cup',
  //       status: 'in-progress',
  //       createdAt: new Date(),
  //       players: [
  //         {
  //           name: 'misz',
  //           points: 0
  //         },
  //         {
  //           name: 'jbl',
  //           points: 0
  //         },
  //         {
  //           name: 'Stooq',
  //           points: 0
  //         }
  //       ],
  //       battles: [
  //         'awSjeN94uciHbhid8',
  //         '6qRcJdKBthZiKQr5v'
  //       ]
  //     }
  //   ];
  // 
  //   data.forEach(tournament => Tournaments.insert(tournament));
  // }
});
