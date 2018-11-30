import '/imports/ui/components/countdown/countdown.js';

import './welcome.html';
import './welcome.scss';

Template.welcome.helpers({
  PEMdate() {
    return 1544637600 * 1000
  }
});
