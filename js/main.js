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
		kr1ptr: 'utils/kr1ptr',
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
	    kr1ptr: {
	    	deps: ['jqueryui'],
	    }
	},
});

require(['app'], function(App){
	App.start();
});