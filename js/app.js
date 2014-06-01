// Filename: js/app.js

define([
  'jquery',
  'marionette',
  'router',
  'config',
  'views/nav',
  'views/user/login-dialog',
],
function($, Marionette, AppRouter, config, NavView, LoginDialogView){

  window.App = new Backbone.Marionette.Application();

  App.addRegions({
    navRegion: '#menu',
    contentRegion: '#content',
    dialogRegion: '#dialog',
  });

  App.addInitializer(function(){
    appRouter = new AppRouter();
    appRouter.initialize();
  });

  // Enable CORS support and JWT Auth Checking
  App.addInitializer(function(){
    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {

      if (options.url != '/login') {
        // need to check jwt expiration settings
        if (KR1PTR.is_jwt_expired()){
          var isOpen = $('#session_timeout').dialog('isOpen');
          if (!isOpen) {
            var loginDialogView = new LoginDialogView();
            window.App.dialogRegion.show(loginDialogView);
          }
          jqXHR.abort();
        }
      }

      // CORS
      options.url = config.apiUrl + options.url;
      jqXHR.setRequestHeader('X-JWT-Auth-Token', KR1PTR.get_jwt());
    });
  });

  App.addInitializer(function(){
    $(document).ajaxSuccess( function( event, jqXHR, settings ) {

      jqXHR.responseJSON = JSON.parse(jqXHR.responseText);

      if (jqXHR.responseJSON.hasOwnProperty('jwt')) {
        KR1PTR.store_jwt(jqXHR.responseJSON);
      }
    });
  });

  App.on('initialize:after', function(){
    Backbone.history.start({pushState: true});

    // Holy crap this is SOOO important!
    $(document).on("click", "a[href^='/']", function(event) {
      if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
        event.preventDefault();

        // need the jwt auth check stuff here too
        if (KR1PTR.is_jwt_expired()){
          var loginDialogView = new LoginDialogView();
          window.App.dialogRegion.show(loginDialogView);
        }

        var url = $(event.currentTarget).attr("href").replace(/^\//, "");
        Backbone.history.navigate(url, { trigger: true });
      }
    });

    if (Backbone.history.fragment != '') {
      // need to check jwt expiration settings - this will trigger the logic upon hard page refreshes
      if (KR1PTR.is_jwt_expired()){
        var loginDialogView = new LoginDialogView();
        window.App.dialogRegion.show(loginDialogView);
      }
    }
  });

  return App;
});