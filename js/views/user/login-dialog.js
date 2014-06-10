// Filename: views/user/login

define([
  'marionette',
  'models/user',
  'text!tpls/user/login-dialog.html',
  ],
function(Marionette, UserModel, loginTemplate){

	var LoginDialogView = Backbone.Marionette.ItemView.extend({

    template: _.template(loginTemplate),

    loginUser: function(e) {
    	console.log('loginUser');
			e.preventDefault();

			$.post('/login', $('#login_form').serialize(), function(data){
				console.log('post');
				console.log($('#login_form').serialize());
				var response = $.parseJSON(data);

				if (response.error) {
					$('#error_msg').html('Authentication Failed. Try Again.');
				}
				else {
					App.Auth.store_jwt(response);
						$('#email').val('');
						//$('#session_timeout').dialog('close');
						$('#session_timeout').dialog('destroy').remove()
		        App.dialogRegion.close();

		        Backbone.history.loadUrl();
				}
			});
    },

    onShow: function() {
    	var view = this;

      $('#session_timeout').dialog({
        autoOpen: true,
        height: 270,
        width: 300,
        modal: true,
        resizable: false,
        draggable: false,
        closeOnEscape: false,
        buttons: {
          login: function(e) {
            view.loginUser(e);
          },
          cancel: function() {
            $(this).dialog('close');
            App.dialogRegion.close();
            Backbone.history.navigate('/', { trigger: true });
          }
        },
      });

	    $('#email').focus();

	    $('#session_timeout').keypress(function(e){
        if (e.keyCode === $.ui.keyCode.ENTER){
          view.loginUser(e);
        }
      });
    },
  });

  return LoginDialogView;
});