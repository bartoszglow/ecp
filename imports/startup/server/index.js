// Import server startup through a single index entry point

import './fixtures.js';
import './register-api.js';
import './watch-battles.js';

Meteor.publish('userData', function () {
  return Meteor.users.find({}, {
    fields: { profile: 1 }
  });
});
