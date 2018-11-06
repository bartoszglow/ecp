import { Template } from 'meteor/templating';
import moment from 'moment';

Template.registerHelper("inc", function(value, options) {
  return parseInt(value) + 1;
});

Template.registerHelper("formatDate", function(value, options) {
  return moment(value).format("DD MMM YY, HH:mm");
});

