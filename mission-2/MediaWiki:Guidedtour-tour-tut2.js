/* eslint-disable max-len */
( function ( window, document, $, mw, gt ) {

	var tour = new gt.TourBuilder( {
			name: 'tut2',
			shouldLog: true
		} ),
		postEditButtons = [];

	function showAlert( title, message ) {
		var messageDialog = new OO.ui.MessageDialog(),
			windowManager = new OO.ui.WindowManager();

		messageDialog.$element.css( { zIndex: '100000010' } );

		$( 'body' ).append( windowManager.$element );

		windowManager.addWindows( [ messageDialog ] );

		windowManager.openWindow( messageDialog, {
			title: title,
			message: message,
			actions: [ {
				action: 'accept',
				label: 'OK',
				flags: 'primary'
			} ]
		} );
	}

	function sendMessage( targetPage, msgPage, linkTo ) {
		var api = new mw.Api();

		api
			.get( {
				action: 'query',
				titles: msgPage,
				prop: 'revisions',
				rvprop: 'content',
				rvslots: '*',
				indexpageids: 1,
				meta: 'tokens'
			} )
			.done( function ( result ) {
				result = result.query;
				var csrfToken = result.tokens.csrftoken,
					page = result.pages[ result.pageids[ 0 ] ],
					text = page.revisions !== undefined ?
						page.revisions[ 0 ].slots.main[ '*' ] :
						'Page unavailable';

				if ( text === 'Page unavailable' ) {
					window.location.href = linkTo;
					return;
				}

				api
					.post( {
						action: 'edit',
						title: targetPage,
						appendtext: '\n' + text,
						summary: 'New Message (simulated automatically as part of [[MediaWiki:The Userscript Tour|The Userscript Tour]])',
						token: csrfToken
					} )
					.done( function () {
						window.location.href = linkTo;
					} )
					.fail( function () {
						showAlert( 'Error', 'An error occured. Please try again.' );
					} );
			} )
			.fail( function () {
				showAlert( 'Error', 'An error occured. Please try again.' );
			} );
	}

	mw.loader.load( [ 'oojs-ui-core', 'oojs-ui-windows' ] );

	if ( mw.config.get( 'wgAction' ) === 'view' && !gt.isPostEdit() ) {
		postEditButtons.push( {
			name: 'Click here to go back and make an edit',
			onclick: function () {
				window.location.href = window.location.href + '?action=edit';
			}
		} );
	}

	tour
		.firstStep( {
			name: '1',
			title: 'Developing with ResourceLoader',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Journey to Mission 2 begins.<br><br>We\'ll answer some of your questions that arose in the previous mission, here. So, without further ado, let\'s get started.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: 'Let\'s go',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '2' );

	tour
		.step( {
			name: '2',
			title: 'ResourceLoader',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br><b>ResourceLoader</b>, as the name suggests, is a mechanism to <b>intelligently deliver the resources to the wikis.</b><br><br>The resources could be any of the following:<br>1) JavaScript<br>2) Styles<br>3) Messages or Localisation text<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'MediaWiki:TUT/2/Start' ) + '?tour=tut2&step=1'
			}, {
				name: 'Alright',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '3' );

	tour
		.step( {
			name: '3',
			title: 'More about resources',
			description: '<br><br>1) <b>JavaScript:</b> These are the scripts that enable dynamic and interactive features on pages they are loaded on.<br><br>2) <b>Styles:</b> These are the stylesheets which are used to format the layout of webpages.<br><br>3) <b>Messages:</b> Since interfaces are loaded dynamically, they should be correct in terms of the localised language. And localisation text does exactly that!<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'MediaWiki:TUT/2/Start' ) + '?tour=tut2&step=2'
			}, {
				name: 'Are these resources requested separately?',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '4' );

	tour
		.step( {
			name: '4',
			title: 'Are these resources requested separately?',
			description: '<br>They are not...Please welcome <b>MODULES!</b><br><br><div align="center">[[File: TUT modules.png|400px|link=]]</div><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'MediaWiki:TUT/2/Start' ) + '?tour=tut2&step=3'
			}, {
				name: 'What is a module?',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '5' );

	tour
		.step( {
			name: '5',
			title: 'Module',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>A module is a <b>bundle of resources.</b> It can contain any type of resources we discussed lately.<br><br>ResourceLoader makes it possible to load a module by just using its name. Multiple modules bundled are delivered to the client in a <b>single request.</b><br><br><i>This concept is responsible for MediaWiki\'s low-cost high-performant front end.</i><br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'MediaWiki:TUT/2/Start' ) + '?tour=tut2&step=4'
			}, {
				name: 'Cool',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '6' );

}( window, document, jQuery, mediaWiki, mediaWiki.guidedTour ) );
