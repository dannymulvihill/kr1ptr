// Filename: views/password/edit

define([
  'marionette',
  'models/password',
  'text!tpls/password/edit.html',
  'jqueryui',
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
      'click #decrypt_btn, #unlock_pass, #unlock_encrypted_notes': 'toggleCryptState',
      'click #encrypt_btn, #lock_pass, #lock_encrypted_notes': 'toggleCryptState',
    },

    viewMode: '',

    editPassword: function() {
      this.setViewMode('edit');

      $('#name').focus();
    },

    toggleCryptState: function() {
      App.KR1PTR.toggleCryptState();
    },

    savePassword: function() {
      if (App.KR1PTR.cryptState == 'encrypt' || ($('#pass').val() == '' && $('#encrypted_notes').val() == '')) {
        var self = this;
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
                if (self.viewMode == 'add') {
                  Backbone.history.navigate('/passwords/'+response.id);
                }

                self.setViewMode('view');
              }
            },
            error: function(model, response) {
              console.log('error');
            }
        });
      }
      else {
        App.KR1PTR.toggleCryptState();
        this.savePassword();
      }
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

    onShow: function() {
      if (this.model.isNew()){
        App.KR1PTR.encrypt_fields = {pass: false, encrypted_notes: false};

        $('.title').html('Add New Password');

        this.setViewMode('add');
        App.KR1PTR.cryptState = 'decrypt';
        App.KR1PTR.setCryptView();

        $('#name').focus();
      }
      else {
        $('.title').html('View/Edit Password');
        this.setViewMode('view');
        App.KR1PTR.cryptState = 'encrypt';
        App.KR1PTR.setCryptView();
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
            App.KR1PTR.startTimer();
            App.KR1PTR.toggleCryptState();
            $(this).dialog('close');
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
            App.KR1PTR.startTimer();
            App.KR1PTR.toggleCryptState();
            $(this).dialog('close');
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
          App.KR1PTR.startTimer();
          App.KR1PTR.toggleCryptState();
          $('#decrypt_form').dialog('close');
        }
      })
      $('#encrypt_key').keypress(function(e){
        if (e.keyCode === $.ui.keyCode.ENTER){
          App.KR1PTR.startTimer();
          App.KR1PTR.toggleCryptState();
          $('#encrypt_form').dialog('close');
        }
      })
    }

  });

  return PasswordView;
});