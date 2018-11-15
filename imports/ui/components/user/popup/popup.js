import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';

import './popup.html';
import './popup.scss';

Template.userPopup.helpers({
  isUserLoggedIn() {
    return !!Meteor.user();
  },
  getUserName() {
    const user = Meteor.user();
    return user && user.profile && user.profile.name;
  },
  isUserPopupVisibleHandler() {
    return FlowRouter.getQueryParam('userinfo');
  },
});

Template.userPopup.events({
  'click .menu-user-logout'(event, template) {
    event.preventDefault();
    FlowRouter.setQueryParams({ userinfo: null });
    Meteor.logout();
  },
  'click .menu-user-login'(event, template) {
    event.preventDefault();
    FlowRouter.setQueryParams({ userinfo: null });
    FlowRouter.go('/login');
  },
  'click .menu-user-toggle-popup'(event, template) {
    event.preventDefault();
    event.stopPropagation();
    const isVisible = !!FlowRouter.getQueryParam('userinfo');
    FlowRouter.setQueryParams({ userinfo: isVisible ? null : true });
  },
  'click .menu-user'(event, template) {
    event.stopPropagation();
  },
});
