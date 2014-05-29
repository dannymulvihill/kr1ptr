// Filename: js/app.js

define([
  'jquery',
  'marionette',
  'router',
  'views/nav',
  'views/user/login-dialog',
],
function($, Marionette, AppRouter, NavView, LoginDialogView){

  window.App = new Backbone.Marionette.Application();

  App.addRegions({
    navRegion: '#menu',
    contentRegion: '#content',
    dialogRegion: '#dialog',
  });

  // Enable CORS support and JWT Auth Checking
  App.addInitializer(function(){
    $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {

      // need to check jwt expiration settings
      if (options.url != '/login') {

        if (KR1PTR.is_jwt_expired()){
          var loginDialogView = new LoginDialogView();
          window.App.dialogRegion.show(loginDialogView);

          jqXHR.abort();
        }
      }

      // CORS
      options.url = 'http://api.kr1ptr.local' + options.url;
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

  App.addInitializer(function(){
    appRouter = new AppRouter();
    appRouter.initialize();
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

  });

  return App;
});