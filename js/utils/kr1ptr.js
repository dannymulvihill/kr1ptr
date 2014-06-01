
var KR1PTR = {
	key: null,
	keyTimer: '',
	keyTimerCount: 0,
	cryptFields: ['#pass', '#encrypted_notes'],
	cryptState: 'encrypt',

	keyCheck: function() {
		if (_.isNull(this.key)) {
			var form = (this.cryptState == 'encrypt') ? '#decrypt_form' : '#encrypt_form';
			$(form).dialog('open');
			return false;
		}
		return true;
	},

	toggleCryptState: function() {
		// first things first, see if we have the encryption key
		if (this.keyCheck()) {

			// toggle state value
			this.cryptState = (this.cryptState == 'encrypt') ? 'decrypt' : 'encrypt';

			// encrypt/decrypt fields
			_.each(this.cryptFields, function(field) {
				var text   = $(field).val();
				if (text.length > 0) {
					var result = Aes.Ctr[KR1PTR.cryptState](text, KR1PTR.key, 128);
					$(field).val(result);
				}
			});

			this.setCryptView();
		}
	},

	setCryptView: function() {
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

	startTimer: function() {
		if (this.keyTimerCount <= 0) {
			this.storeKey();
			this.keyTimerCount = 5;
			this.keyTimer = setInterval("KR1PTR.timer()", 1000);
		}
	},

	storeKey: function() {
		var key_field = (this.cryptState == 'decrypt') ? '#decrypt_key' : '#encrypt_key';
		this.key = $(key_field).val();
		$(key_field).val('');
	},

	killKey: function() {
		$('#encrypt_key').val('');
		$('#decrypt_key').val('');
		clearTimeout(this.keyTimer);
		this.keyTimerCount = 0;
		this.key = null;
	},

	timer: function() {
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