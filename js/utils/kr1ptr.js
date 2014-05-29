
var KR1PTR = {
	key: null,
	key_timer: '',
	key_timer_count: 0,
	encrypt_fields: {pass: true, encrypted_notes: true},

	check_for_key: function(mode) {
		if (typeof this.key == 'undefined' || this.key === null) {
			$('#'+mode+'_form').dialog('open');
			return false;
		}
		return true;
	},

	decrypt: function(field_id) {
		if (this.check_for_key('decrypt')) {
			var input = field_id.substr(7); // cut off the unlock_
			var other = field_id.substr(2); // cut off the un

			if ($('#'+input).val().length > 0) {
				$('#'+input).val(Aes.Ctr.decrypt( $('#'+input).val(), this.key, 128)).removeClass('hide');
			}
			else {
				$('#'+input).removeClass('hide');
			}

			$('#'+field_id).addClass('hide');
			$('#'+other).removeClass('hide');
			$('#decrypt_form').dialog('close');

			this.start_timer();

			this.encrypt_fields[input] = false;
		}
	},

	encrypt: function(field_id) {
		if (this.check_for_key('encrypt')) {
			var input = field_id.substr(5); // cut off the lock_

			if ($('#'+input).val().length > 0) {
				$('#'+input).val(Aes.Ctr.encrypt( $('#'+input).val(), this.key, 128)).addClass('hide');
			}
			else {
				$('#'+input).addClass('hide');
			}

			$('#'+field_id).addClass('hide');
			$('#un'+field_id).removeClass('hide');
			$('#encrypt_form').dialog('close');

			this.encrypt_fields[input] = true;
		}
	},

	start_timer: function() {
		if (this.key_timer_count <= 0) {
			this.store_key();
			this.key_timer_count = 60;
			this.key_timer = setInterval("KR1PTR.timer()", 1000);
		}
	},

	store_key: function() {
		this.key = $('#decrypt_key').val();
		$('#decrypt_key').val('');
	},

	kill_key: function() {
		$('#encrypt_key').val('');
		$('#decrypt_key').val('');
		clearTimeout(this.key_timer);
		this.key_timer_count = 0;
		delete this.key;
	},

	timer: function() {
		// decrement the timer count
		--this.key_timer_count;
		if (this.key_timer_count < 0) {
			// unset the recurring timer
			clearInterval(this.key_timer);

			// if any fields are left decrypted, encrypt them
			this.encrypt_all();

			// set time count back to 0 and unset the encryption key
			this.kill_key();

			// clear the onscreen timer
			$('#timer').html('');

			// exit this method
			return;
		}

		$('#timer').html(this.key_timer_count);
	},

	// all this stuff should be moved to a class specifically for authentication
	store_jwt: function(response) {
		localStorage.setItem('kr1ptr_jwt', response.jwt);
		localStorage.setItem('kr1ptr_exp', response.exp);
	},

	get_jwt: function() {
		return localStorage.getItem('kr1ptr_jwt');
	},

	get_jwt_exp: function() {
		return localStorage.getItem('kr1ptr_exp');
	},

	is_jwt_expired: function() {
		var now = Math.floor((new Date()).getTime() / 1000);
		var exp = localStorage.getItem('kr1ptr_exp');

		if (now < exp) {
			return false;
		}
		else {
			return true;
		}
	}
}