// Filename: views/password/edit

define([
  'marionette',
  'models/password',
  'text!tpls/password/edit.html',
  'jqueryui',
  'aes',
  'kr1ptr',
  ],
function(Marionette, PasswordModel, passwordTemplate){

  var PasswordView = Backbone.Marionette.ItemView.extend({
    model: new PasswordModel(),

    template: _.template(passwordTemplate),

    events: {
      'click #edit_btn': 'editPassword',
      'click #save_btn': 'savePassword',
      'click #cancel_btn': 'cancelEdit',
      'click #delete_btn': 'confirmPasswordDelete',
      'click #decrypt_btn, #unlock_pass, #unlock_encrypted_notes': 'decryptAll',
      'click #encrypt_btn, #lock_pass, #lock_encrypted_notes': 'encryptAll',
    },

    editPassword: function() {
      this.setViewMode('edit');

      $('#name').focus();
    },

    savePassword: function() {
      var parent = this;
      this.model.save({
          name:            $("#name").val(),
          host:            $("#host").val(),
          username:        $("#user").val(),
          password:        $("#pass").val(),
          notes:           $("#notes").val(),
          encrypted_notes: $("#encrypted_notes").val(),
        },
        {
          success: function(model, response) {
            if (response.error) {
              // error alert
            }
            else {
              parent.setViewMode('view');
            }
          },
          error: function(model, response) {
            console.log('error');
          }
      });
    },

    cancelEdit: function() {
      // if we cancel while in the add mode, redirect to the listview
      if (_.isEmpty(this.model.id)) {
        Backbone.history.navigate('passwords', { trigger: true });
      }
      else {
        this.setViewMode('view');
      }
    },

    confirmPasswordDelete: function() {
      $('#delete_confirmation').dialog('open');
    },

    deletePassword: function() {
      this.model.destroy();
      Backbone.history.navigate('passwords', { trigger: true });
    },

    decryptAll: function() {
      _.each(KR1PTR.encrypt_fields, function(encrypted, field) {
        if (encrypted) {
          KR1PTR.decrypt('unlock_'+field);
        }
      });
    },

    encryptAll: function() {
      _.each(this.encrypt_fields, function(encrypted, field) {
        if (!encrypted) {
          KR1PTR.encrypt('lock_'+field);
        }
      });
    },

    setViewMode: function(mode) {

      switch (mode) {
        case 'edit':
          $('.add_mode, .view_mode').hide();
          $('.edit_mode').show();
          // save current values in case user cancels we can reset them
          //KR1PTR.bkup_values = {};
          $('input[disabled=disabled], textarea[disabled=disabled]').each(function(){
            //KR1PTR.bkup_values[this.id] = $(this).val();
            $(this).removeAttr('disabled');
          });
          break;

        case 'view':
          $('.edit_mode, .add_mode').hide();
          $('.view_mode').show();

          $('input[type=text], textarea').each(function(){
            $(this).attr('disabled', 'disabled');
          });
          break;

        case 'add':
          $('.edit_mode, .view_mode').hide();
          $('.add_mode').show();
          $('input[disabled=disabled], textarea[disabled=disabled]').each(function(){
            $(this).removeAttr('disabled');
          });
          break;
      }
    },

    setEncryptedState: function(state) {
      switch (state) {
        case 'encrypted':
          $('.decrypted').hide();
          $('.encrypted').show();
          break;

        case 'decrypted':
          $('.encrypted').hide();
          $('.decrypted').show();
          break;
        }
    },

    onShow: function() {
      var view = this;

      if (this.model.isNew()){
        KR1PTR.encrypt_fields = {pass: false, encrypted_notes: false};

        $('.title').html('Add New Password');

        this.setViewMode('add');
        this.setEncryptedState('encrypted');

        $('#name').focus();
      }
      else {
        $('.title').html('View/Edit Password');
        this.setViewMode('view');
        this.setEncryptedState('encrypted');
      }

      $('#decrypt_form').dialog({
        autoOpen: false,
        height: 120,
        width: 300,
        modal: true,
        resizable: false,
        draggable: false,
        buttons: {
          decrypt: function() {
            KR1PTR.key = $('#decrypt_key').val();
            view.setEncryptedState('decrypted');
            view.decryptAll();

          },
          cancel: function() {
            $(this).dialog('close');
          }
        },
      });

      $('#encrypt_form').dialog({
        autoOpen: false,
        height: 120,
        width: 300,
        modal: true,
        resizable: false,
        draggable: false,
        buttons: {
          encrypt: function() {
            KR1PTR.key = $('#encrypt_key').val();
            view.setEncryptedState('encrypted');
            view.encryptAll();
          },
          cancel: function() {
            $(this).dialog('close');
          }
        },
      });

      $('#delete_confirmation').dialog({
        autoOpen: false,
        height: 145,
        width: 300,
        modal: true,
        resizable: false,
        draggable: false,
        buttons: {
          delete: function() {
            App.contentRegion.currentView.deletePassword();
            $(this).dialog('close');
          },
          cancel: function() {
            $(this).dialog('close');
          }
        },
      });

      $('#decrypt_key').keypress(function(e){
        if (e.keyCode === $.ui.keyCode.ENTER){
          KR1PTR.key = $('#decrypt_key').val();
          KR1PTR.decrypt_all();
        }
      })
      $('#encrypt_key').keypress(function(e){
        if (e.keyCode === $.ui.keyCode.ENTER){
          KR1PTR.key = $('#encrypt_key').val();
          KR1PTR.encrypt_all();
        }
      })
    }

  });

  return PasswordView;
});