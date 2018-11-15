import './main.html';
import './main.scss';

Template.App_layout_main.events({
  'click .ecp__header'(event, template) {
    console.log("ALERT");
    FlowRouter.setQueryParams({ userinfo: null });
  },
  'click .ecp__body'(event, template) {
    console.log("ALERT");
    FlowRouter.setQueryParams({ userinfo: null });
  }
});
