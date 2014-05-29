// Filename: views/password/generate

define([
  'marionette',
  'text!tpls/password/generate.html',
  ],
function(Marionette, generatePasswordTemplate){

  var GeneratePasswordView = Backbone.Marionette.ItemView.extend({

    template: _.template(generatePasswordTemplate),

    events: {
      'click #generate_btn': 'generatePassword',
    },

    characters: {
      lowercase: ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'],
      uppercase: ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'],
      numbers: ['1','2','3','4','5','6','7','8','9','0'],
      punctuation: ['!','@','#','$','%','^','&','*','(',')','-','_','+','[',']','{','}','|',',','.'],
      space: [' ']
    },

    generatePassword: function() {
      var parent = this;
      var length = $('#length').val();
      var chars = [];
      $('input[type=checkbox]').each(function(){
        if ($(this).is(':checked')) {
          $.merge(chars, parent.characters[this.id]);
        }
      });

      var password = '';

      for (var i = length; i >= 0; i--) {
        password += chars[Math.floor(Math.random()*chars.length)];
      };

      $('#generated_pw').html(password);
    },

  });

  return GeneratePasswordView;
});