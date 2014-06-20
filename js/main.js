// File: app/main.js

require.config({
	baseUrl: '/js',
	paths: {
		jquery: 'libs/jquery/jquery',
		jqueryui: 'libs/jquery/jquery-ui',
		datatables: 'libs/jquery/datatables',
		underscore: 'libs/underscore/underscore',
		backbone: 'libs/backbone/backbone',
		marionette: 'libs/marionette/marionette',
		bootstrap: 'libs/bootstrap/bootstrap',
		text: 'libs/require/text',
		tpls: '/tpls',
		aes: 'utils/aes',
	},
	shim: {
		backbone: {
			deps: ['underscore', 'jquery'],
			exports: 'Backbone',
		},
	    jqueryui: {
	    	deps: ['jquery'],
	    },
	    datatables: {
	    	deps: ['jquery'],
	    },
		marionette : {
	      deps: ['jquery', 'underscore', 'backbone'],
	      exports : 'Marionette',
	    },
	    bootstrap: {
	    	deps: ['jquery'],
	    },
	},
});

require(['app'], function(App){
	App.start();
});