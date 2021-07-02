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
				name: 'Get started',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '2' );

	tour
		.step( {
			name: '2',
			title: 'ResourceLoader',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br><b>ResourceLoader</b> is a mechanism to <b>intelligently deliver the resources to the wikis.</b><br><br>The resources could be any of the following:<br>1) JavaScript<br>2) Styles<br>3) Messages or Localisation text *<br><br><small>* Messages ensure that the interfaces should be correct in terms of the localised language.</small><br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/2/Start' ) + '?tour=tut2&step=1'
			}, {
				name: 'Are these resources requested separately?',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '3' );

	tour
		.step( {
			name: '3',
			title: 'Are these resources requested separately?',
			description: '<br>They are not...Please welcome <b>MODULES!</b><br><br><div align="center">[[File: TUT modules.png|400px|link=]]</div><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/2/Start' ) + '?tour=tut2&step=2'
			}, {
				name: 'What is a module?',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '4' );

	tour
		.step( {
			name: '4',
			title: 'Module',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>A module is a <b>bundle of resources.</b> It can contain any type of resources we discussed lately.<br><br>ResourceLoader makes it possible to load a module by just using its name. Multiple modules bundled are delivered to the client in a <b>single request.</b><br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/2/Start' ) + '?tour=tut2&step=3'
			}, {
				name: 'Do I have to request all modules?',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '5' );

	tour
		.step( {
			name: '5',
			title: 'Do I have to request all modules?',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Not always!<br><br>The modules <b>mediawiki</b> and <b>jquery</b> together form the base environment and are ALWAYS present.<br><br>In other words, these modules will <b>never</b> be requested since they are ubiquitous.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/2/Start' ) + '?tour=tut2&step=4'
			}, {
				name: 'Noted',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=6'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '6',
			title: 'Hands-On',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Let\'s start simple. We\'ll show a <b>bubble notification</b> on the page.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/2/Start' ) + '?tour=tut2&step=5'
			}, {
				name: 'Should be fun',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '7' );

	tour
		.step( {
			name: '7',
			title: 'Edit common.js',
			description: '<br>Edit this page.<br><br>Click <b>CREATE SOURCE</b> or <b>EDIT SOURCE</b> above.<br><br>',
			onShow: gt.parseDescription,
			attachTo: '#ca-edit',
			position: 'bottom',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=6'
			} ],
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.hasQuery( { action: 'edit' } ) ) {
				return '8';
			}
		} );

	tour
		.step( {
			name: '8',
			title: 'mw.notify()',
			description: '<br>The base module <b>mediawiki</b> initialises the <code>mw</code> global object.<br><br>Add above:<br><b>mw.notify( \'I am on a ResouceLoader Tour:)\' );</b><br><br>',
			onShow: gt.parseDescription,
			attachTo: '.wikiEditor-ui-text',
			position: 'bottomRight',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=7'
			}, {
				name: 'Added!',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '9' );

	// Step 12
	tour
		.step( {
			name: '9',
			title: 'Edit summary and Save Changes',
			description: '<br>Nice! Before you click Save Changes, leave a brief note about the changes you made.<br><br>Click SAVE CHANGES when you\'re ready.<br><br>',
			onShow: gt.parseDescription,
			attachTo: '#wpSave',
			position: 'bottomRight',
			overlay: false,
			closeOnClickOutside: false,
			buttons:
				postEditButtons.length === 0 ?
					[ {
						name: '<big>←</big>',
						action: 'externalLink',
						url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=8&action=edit'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '10';
			}
		} );

}( window, document, jQuery, mediaWiki, mediaWiki.guidedTour ) );
