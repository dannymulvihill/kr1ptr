// Filename: js/app.js

define([
  'jquery',
  'marionette',
  'router',
  'config',
  'views/nav',
  'views/user/login-dialog',
  'aes',
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
        if (App.Auth.is_jwt_expired()){
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
      jqXHR.setRequestHeader('X-JWT-Auth-Token', App.Auth.get_jwt());
    });
  });

  App.addInitializer(function(){
    $(document).ajaxSuccess( function( event, jqXHR, settings ) {

      jqXHR.responseJSON = JSON.parse(jqXHR.responseText);

      if (jqXHR.responseJSON.hasOwnProperty('jwt')) {
        App.Auth.store_jwt(jqXHR.responseJSON);
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
        if (App.Auth.is_jwt_expired()){
          var loginDialogView = new LoginDialogView();
          window.App.dialogRegion.show(loginDialogView);
        }

        var url = $(event.currentTarget).attr("href").replace(/^\//, "");
        Backbone.history.navigate(url, { trigger: true });
      }
    });

    if (Backbone.history.fragment != '') {
      // need to check jwt expiration settings - this will trigger the logic upon hard page refreshes
      if (App.Auth.is_jwt_expired()){
        // really need to abstract this out!
        var loginDialogView = new LoginDialogView();
        window.App.dialogRegion.show(loginDialogView);
      }
    }
  });

  App.module("KR1PTR", function(KR1PTR, App, Backbone, Marionette, $, _){
    // Private Data And Functions
    var privateData = "this is private data";

    var privateFunction = function(){
        console.log(privateData);
    }

    // Public Data And Functions
    KR1PTR.someData = "public data";

    KR1PTR.someFunction = function(){
        privateFunction();
        console.log(KR1PTR.someData);
    }

    this.key = null;
    this.keyTimer = '';
    this.keyTimerCount = 0;
    this.cryptFields = ['#pass', '#encrypted_notes'];
    this.cryptState = 'encrypt';

    this.keyCheck = function() {
      if (_.isNull(this.key)) {
        var form = (this.cryptState == 'encrypt') ? '#decrypt_form' : '#encrypt_form';
        $(form).dialog('open');
        return false;
      }
      return true;
    },

    this.toggleCryptState = function() {
      // first things first, see if we have the encryption key
      if (this.keyCheck()) {

        // toggle state value
        this.cryptState = (this.cryptState == 'encrypt') ? 'decrypt' : 'encrypt';

        // encrypt/decrypt fields
        _.each(this.cryptFields, function(field) {
          var text   = $(field).val();
          if (text.length > 0) {
            var result = Aes.Ctr[App.KR1PTR.cryptState](text, App.KR1PTR.key, 128);
            $(field).val(result);
          }
        });

        this.setCryptView();
      }
    },

    this.setCryptView = function() {
      // update DOM view state
      switch (this.cryptState) {
        case 'encrypt':
          $('.decrypted').hide();
          $('.encrypted').show();
          break;

        case 'decrypt':
          $('.encrypted').hide();
          $('.decrypted').show();
          break;
      }
    },

    this.startTimer = function() {
      if (this.keyTimerCount <= 0) {
        this.storeKey();
        this.keyTimerCount = 5;
        this.keyTimer = setInterval("App.KR1PTR.timer()", 1000);
      }
    },

    this.storeKey = function() {
      var key_field = (this.cryptState == 'decrypt') ? '#decrypt_key' : '#encrypt_key';
      this.key = $(key_field).val();
      $(key_field).val('');
    },

    this.killKey = function() {
      $('#encrypt_key').val('');
      $('#decrypt_key').val('');
      clearTimeout(this.keyTimer);
      this.keyTimerCount = 0;
      this.key = null;
    },

    this.timer = function() {
      // decrement the timer count
      --this.keyTimerCount;
      if (this.keyTimerCount < 0) {
        // unset the recurring timer
        clearInterval(this.keyTimer);

        // if current state is decrypted, encrypt everything again
        if (this.cryptState == 'decrypt'){
          this.toggleCryptState();
        }

        // set time count back to 0 and unset the encryption key
        this.killKey();

        // clear the onscreen timer
        $('#timer').html('');

        // exit this method
        return;
      }

      $('#timer').html(this.keyTimerCount);
    }

  });

  App.module("Auth", function(Auth, App, Backbone, Marionette, $, _){
    this.store_jwt = function(response) {
      localStorage.setItem('kr1ptr_jwt', response.jwt);
      localStorage.setItem('kr1ptr_exp', response.exp);
    }

    this.get_jwt = function() {
      return localStorage.getItem('kr1ptr_jwt');
    }

    this.get_jwt_exp = function() {
      return localStorage.getItem('kr1ptr_exp');
    }

    this.is_jwt_expired = function() {
      var now = Math.floor((new Date()).getTime() / 1000);
      var exp = localStorage.getItem('kr1ptr_exp');

      if (now < exp) {
        return false;
      }
      else {
        return true;
      }
    }
  });

  return App;
});