// Filename: router.js

define([
  'jquery',
  'marionette',
  'views/user/login',
  'views/password/item',
  'views/password/edit',
  'views/password/list',
  'views/password/not-found',
  'views/password/generate',
  'models/password',
  'views/nav',
],
function(
  $,
  Marionette,
  LoginView,
  PasswordItemView,
  PasswordView,
  PasswordCompositeView,
  PasswordNotFoundView,
  GeneratePasswordView,
  PasswordModel,
  NavView
  ){
  var AppRouter = Backbone.Marionette.AppRouter.extend({
    routes: {
      '': 'login',
      'passwords/': 'addPassword',
      'passwords/:id(/)': 'showPassword',
      'passwords': 'listPasswords',
      'generate': 'generatePassword',
      'profile': 'viewProfile',
      '*actions': 'defaultAction'
    },

    onRoute: function(name, path, args){
      if (Backbone.history.fragment.length > 0){

        if(_.isUndefined(window.App.navRegion.currentView)){
          var navView = new NavView();
          window.App.navRegion.show(navView);
        }
      }
      else {
        window.App.navRegion.close();
      }
    },

    login: function(){
      var loginView = new LoginView();
      window.App.contentRegion.show(loginView);
    },

    showPassword: function(id){
      var passwordView = new PasswordView();
      if (!_.isNull(id)) {
        passwordView.model.set({id: id});

        passwordView.model.fetch({
          success: function(collection, response) {
            if (response.error) {
              var passwordNotFoundView = new PasswordNotFoundView();
              window.App.contentRegion.show(passwordNotFoundView);
            }
            else {
              // fetch successfully completed
              window.App.contentRegion.show(passwordView);
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

      window.App.contentRegion.show(passwordView);
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
      window.App.contentRegion.show(passwordCompositeView);
    },

    generatePassword: function(){
      var generatePasswordView = new GeneratePasswordView();
      window.App.contentRegion.show(generatePasswordView);
    },

    viewProfile: function(){
      window.App.contentRegion.close();
    },

    defaultAction: function(){
      console.log('no match');
    },

  });

  return AppRouter;
});