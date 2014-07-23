// Filename: views/user/profile

define([
  'marionette',
  'models/user',
  'text!tpls/user/profile.html',
  ],
function(Marionette, UserModel, profileTemplate){

	var ProfileView = Backbone.Marionette.ItemView.extend({
		model: new UserModel(),

		events: {
			submit: 'saveProfile',
			'click #edit_btn': 'editProfile',
      'click #save_btn': 'saveProfile',
      'click #cancel_btn': 'cancelEdit',
      'click #change_pw_btn': 'changePassword',
      'click #cancel_change_pw_btn': 'cancelChangePassword',
		},

    viewMode: '',

    template: _.template(profileTemplate),

    editProfile: function() {
      this.setViewMode('edit');

      $('#first_name').focus();
    },

    saveProfile: function(e) {

			var self = this;
      this.model.save({
          first_name:  $("#first_name").val(),
          last_name:   $("#last_name").val(),
          email:       $("#email").val(),
          //password:    $("#pass").val(),
        },
        {
          success: function(model, response) {
            if (response.error) {
              // error alert
            }
            else {
              self.setViewMode('view');
            }
          },
          error: function(model, response) {
            console.log('error');
          }
      });
    },

    cancelEdit: function() {
      this.setViewMode('view');
    },

    setViewMode: function(mode) {
      this.viewMode = mode;

      // hide all the buttons/inputs/spans with mode_tgl class, then show the ones we want
      $('.mode_tgl').hide();
      $('.' + mode + '_mode').show();
      if ( mode == 'view' ) {
        // Disable input and textares for view mode
        $('input[type=text], textarea').each(function(){
          $(this).attr('disabled', 'disabled');
        });
      }
      else {
        // enable input and textareas for add/edit
        $('input[disabled=disabled], textarea[disabled=disabled]').each(function(){
          $(this).removeAttr('disabled');
        });
      }
    },

    changePassword: function() {
    	$('#change_pw_btn').prop('disabled', true);
    	$('#cancel_change_pw_btn, #change_pw_form, #save_new_pw_btn').show();
    	$('#current_password').focus();
    },

    cancelChangePassword: function() {
    	$('#change_pw_btn').prop('disabled', false);
    	$('#cancel_change_pw_btn, #change_pw_form, #save_new_pw_btn').hide();
    	$('#save_new_pw_btn').prop('disabled', true);
    	$('#current_password, #new_password, #confirm_password').val('');
    },

    onShow: function() {
    	//$('#first_name').focus();
    	this.setViewMode('view');
    },

  });

  return ProfileView;
});