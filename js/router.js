// Filename: router.js

define([
  'jquery',
  'marionette',
  'views/user/login',
  'views/user/profile',
  'views/password/item',
  'views/password/edit',
  'views/password/list',
  'views/password/not-found',
  'views/password/generate',
  'models/password',
  'models/user',
  'views/nav',
],
function(
  $,
  Marionette,
  LoginView,
  ProfileView,
  PasswordItemView,
  PasswordView,
  PasswordCompositeView,
  PasswordNotFoundView,
  GeneratePasswordView,
  PasswordModel,
  UserModel,
  NavView
  ){
  var AppRouter = Backbone.Marionette.AppRouter.extend({
    routes: {
      '': 'login',
      'logout': 'logout',
      'passwords/': 'addPassword',
      'passwords/:id(/)': 'showPassword',
      'passwords': 'listPasswords',
      'generate': 'generatePassword',
      'profile': 'viewProfile',
      'settings': 'settings',
      '*actions': 'defaultAction'
    },

    onRoute: function(name, path, args){
      if (Backbone.history.fragment.length > 0){

        if(_.isUndefined(App.navRegion.currentView)){
          var navView = new NavView();
          App.navRegion.show(navView);
        }
      }
      else {
        App.navRegion.close();
      }
    },

    login: function(){
      var loginView = new LoginView();
      App.contentRegion.show(loginView);
    },

    logout: function(){
      App.Auth.logout();
    },

    showPassword: function(id){
      var passwordView = new PasswordView();
      if (!_.isNull(id)) {
        passwordView.model.set({id: id});

        passwordView.model.fetch({
          success: function(collection, response) {
            if (response.error) {
              var passwordNotFoundView = new PasswordNotFoundView();
              App.contentRegion.show(passwordNotFoundView);
            }
            else {
              // fetch successfully completed
              App.contentRegion.show(passwordView);
            }
          },
          error: function() {
              console.log('Failed to fetch!');
          }
        });
      }
      else {
        this.addPassword();
      }
    },

    addPassword: function(){
      var passwordView = new PasswordView();

      if (!_.isEmpty(passwordView.model.id)) {
        passwordView.model.clear().set(passwordView.model.defaults);
      }

      App.contentRegion.show(passwordView);
    },

    listPasswords: function(){
      var passwordCompositeView = new PasswordCompositeView();
      var dataTable = function() {
        $('.list_view').dataTable({
          "aLengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
          "iDisplayLength": -1,
        });
      }
      passwordCompositeView.collection.fetch({success : dataTable});
      App.contentRegion.show(passwordCompositeView);
    },

    generatePassword: function(){
      var generatePasswordView = new GeneratePasswordView();
      App.contentRegion.show(generatePasswordView);
    },

    viewProfile: function(){
      var profileView = new ProfileView();

      //profileView.model.set({id: id});

      profileView.model.fetch({
        success: function(collection, response) {

          if (response.error) {
            /*var passwordNotFoundView = new PasswordNotFoundView();
            App.contentRegion.show(passwordNotFoundView);*/
          }
          else {
            // fetch successfully completed
            App.contentRegion.show(profileView);
          }
        },
        error: function() {
            console.log('Failed to fetch!');
        }
      });
    },

    defaultAction: function(){
      console.log('no match');
    },

  });

  return AppRouter;
});