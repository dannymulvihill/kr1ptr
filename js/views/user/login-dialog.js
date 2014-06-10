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

			e.preventDefault();

			$.post('/login', $('#login_form').serialize(), function(data){

				var response = $.parseJSON(data);

				if (response.error) {
					$('#error_msg').html('Authentication Failed. Try Again.');
					return;
				}
				else {
					App.Auth.store_jwt(response);
						$('#session_timeout').dialog('close');
		        window.App.dialogRegion.close();

		        Backbone.history.loadUrl();
				}
			});
    },

    onShow: function() {
    	var view = this;

    	if (App.Auth.is_jwt_expired()) {
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
	            window.App.dialogRegion.close();
	            Backbone.history.navigate('/', { trigger: true });
	          }
	        },
	      });
	    }

	    $('#email').focus();
    },
  });

  return LoginDialogView;
});