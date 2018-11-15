import { AccountsTemplates } from 'meteor/useraccounts:core';

AccountsTemplates.configure({
    defaultLayout: 'App_layout_maint',
    defaultLayoutRegions: {},
    defaultContentRegion: 'main'
});

AccountsTemplates.addFields([{
    _id: 'name',
    type: 'text',
    displayName: 'Player name',
    placeholder: 'kuski',
    required: true,
    minLength: 3,
}]);

AccountsTemplates.configureRoute('signIn', {
  layoutType: 'blaze',
  name: 'signin',
  path: '/login',
  layoutTemplate: 'App_layout_main',
  layoutRegions: {
    header: 'header'
  },
  contentRegion: 'main'
});

AccountsTemplates.configureRoute('signUp', {
  layoutType: 'blaze',
  name: 'signUp',
  path: '/register',
  layoutTemplate: 'App_layout_main',
  layoutRegions: {
    header: 'header'
  },
  contentRegion: 'main'
});
