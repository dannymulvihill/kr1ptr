// Filename: views/user/login

define([
  'marionette',
  'models/user',
  'text!tpls/user/login.html',
  ],
function(Marionette, UserModel, loginTemplate){

	var LoginView = Backbone.Marionette.ItemView.extend({
		events: {
			submit: 'loginUser'
		},

    template: _.template(loginTemplate),

    loginUser: function(e) {

			e.preventDefault();

			$.post('/login', $('#login_form').serialize(), function(data){
				var response = $.parseJSON(data);

				if (response.error) {
					$('#error_msg').html('Authentication Failed. Try Again.');
				}
				else {
					KR1PTR.store_jwt(response);
					Backbone.history.navigate('/passwords', { trigger: true });
				}
			});
    },

    onShow: function() {
    	$('#email').focus();
    },

  });

  return LoginView;
});