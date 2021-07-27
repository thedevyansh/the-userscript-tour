/* eslint-disable max-len */
/**
 * Guidedtour-tour-tut4.js
 *
 * It creates a guided tour for The Userscript Tour: Mission 4 (Novelty of OOUI).
 * The users are made familiar with Object-Oriented User Interface, how to easily create user
 * interfaces with OOUI, and  how to write userscripts using OOUI. Optionally, users can get to
 * know about promoting their userscripts to gadgets.
 *
 * The following is the entire license notice for the JavaScript code in this Guided Tour.
 *
 * Copyright (C) 2021 Devyansh Chawla <https://meta.wikimedia.org/wiki/User:Novusistic> and contributors
 *
 * The JavaScript/Gadget code in this page is free software: you can
 * redistribute it and/or modify it under the terms of the GNU
 * General Public License (GNU GPL) as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option)
 * any later version.  The code is distributed WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU GPL for more details.
 *
 * As additional permission under GNU GPL version 3 section 7, you
 * may distribute non-source (e.g., minimized or compacted) forms of
 * that code without the copy of the GNU GPL normally required by
 * section 4, provided you include this license notice and a URL
 * through which recipients can access the Corresponding Source.
 *
 * The above is the entire license notice for the JavaScript code in this Guided Tour.
 */
( function ( window, document, $, mw, gt ) {

	// Defined the guided tour.
	var tour = new gt.TourBuilder( {
			name: 'tut4',
			shouldLog: true
		} ),
		postEditButtons = [];

	/**
	 * Show the message dialog box.
	 *
	 * It displays a message dialog box (alert box) with relevant message if the user
	 * is not logged-in or request to the Action API for sending yourself messages fails.
	 *
	 * @param {string} title Represents the title of the error.
	 * @param {string} message Represents the description of the error.
	 */
	function showAlert( title, message ) {
		var messageDialog = new OO.ui.MessageDialog(),
			windowManager = new OO.ui.WindowManager();

		// Sets the z-index of the message dialog box to be greater than that of the 'guider'
		// so that the dialog box appears on top of everything.
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

	/**
	 * Sends the message to the personal wiki page.
	 *
	 * It sends the message to the user's wiki page with API:Edit. For example, Welcome to the Tour,
	 * Badge earned, etc.
	 *
	 * @param {string} targetPage Represents the location of the personal wiki page to send
	 * the message to.
	 * @param {string} msgPage Represents the location of the wiki page containing the message
	 * to be sent.
	 * @param {string} linkTo Represents the location of the wiki page to direct the user to,
	 * after the message has been sent.
	 */
	function sendMessage( targetPage, msgPage, linkTo ) {
		var api = new mw.Api();

		// Sends a GET request to the wiki page containing the message. The response contains the
		// message and the edit token if the Promise is resolved.
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
					// Checks whether the wiki page containing the message exists or not.
					text = page.revisions !== undefined ?
						page.revisions[ 0 ].slots.main[ '*' ] :
						'Page unavailable';

				// If the page containing the message doesn't exist, simply direct the user
				// to the specified location.
				if ( text === 'Page unavailable' ) {
					window.location.href = linkTo;
					return;
				}

				// Sends the extracted message to the personal wiki page.
				api
					.post( {
						action: 'edit',
						title: targetPage,
						appendtext: '\n' + text,
						summary: 'New Message (simulated automatically as part of [[The Userscript Tour]])',
						token: csrfToken
					} )
					.done( function () {
						window.location.href = linkTo;
					} )
					// Should the GET request fail, a message dialog box is displayed to the user.
					.fail( function () {
						showAlert( 'Error', 'An error occured. Please try again.' );
					} );
			} )
			// Should the GET request fail, a message dialog box is displayed to the user.
			.fail( function () {
				showAlert( 'Error', 'An error occured. Please try again.' );
			} );
	}

	// Loads the OOUI dependencies required to display the message dialog box.
	mw.loader.load( [ 'oojs-ui-core', 'oojs-ui-windows' ] );

	// Gracefully handles the situation when the user saves a file without editing it.
	// Asks the user to go back and make an edit.
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
			title: 'Good to see you!',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Congrats on reaching the final phase of <b>The Userscript Tour.</b> You must be very excited to make a difference in this Mission too.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: 'Ready to make a difference',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '2' );

	tour
		.step( {
			name: '2',
			title: 'Object-Oriented User Interface',
			description: '<br><div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br><b>OOUI</b> (Object-Oriented User Interface) allows the creation of web user-interfaces and applications.<br><br>The OOUI library provides the building blocks for building an object-oriented user interface.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/4/Start' ) + '?tour=tut4&step=1'
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
			title: 'Features',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br><b>1)</b> User interfaces created using OOUI abstracts away HTML markup entirely.<br><br><b>2)</b> It uses ready-to-use widgets, layouts, and windows that can be instantiated directly or easily extended.<br><br><b>3)</b> Elements in OOUI can be easily mixed and matched to create custom user interfaces.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/4/Start' ) + '?tour=tut4&step=2'
			}, {
				name: 'Alright',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '4' );

	tour
		.step( {
			name: '4',
			title: 'Widgets',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>The most basic component of the OOUI library is called an <b>element.</b> And <b>widgets</b> are compositions of one or more elements that users can both view and interact with.<br><br>Examples of widgets include buttons, icons, popups, etc.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/4/Start' ) + '?tour=tut4&step=3'
			}, {
				name: 'Okay',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '5' );

	tour
		.step( {
			name: '5',
			title: 'Dependencies',
			description: '<br>Depending on which of the features you\'re going to use, you have to load one or more of the following modules in your user script:<br><br>1) <code>oojs-ui-core </code><br><br>2) <code>oojs-ui-widgets </code><br><br>3) <code>oojs-ui-toolbars </code><br><br>4) <code>oojs-ui-windows </code><br><br>5) <code>oojs-ui.styles.icons-* </code><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/4/Start' ) + '?tour=tut4&step=4'
			}, {
				name: 'Got it',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '6' );

	tour
		.step( {
			name: '6',
			title: 'Hands-on',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>We\'ll begin by writing a basic user script that uses <i>button</i> widget and <i>window</i>, provided by OOUI.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/4/Start' ) + '?tour=tut4&step=5'
			}, {
				name: 'Let\'s do this',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/showAlertBox.js' ) + '?tour=tut4&step=7'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '7',
			title: 'Your subpage',
			description: '<br>This user script will show an alert when a button is clicked. The location of your subpage is <b>User:' + mw.config.get( 'wgUserName' ) + '/showAlertBox.js</b><br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/4/Start' ) + '?tour=tut4&step=6'
			}, {
				name: 'Okay',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/showAlertBox.js' ) + '?tour=tut4&step=8&action=edit&preload=User:Novusistic/TUT_showAlertBox.js'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '8',
			title: 'Sneak Peek',
			description: '<br>Go through the above script. The comments in the script explain it all.<br><br>Once done, edit summary and save the changes.<br><br>',
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
						url: mw.util.getUrl( 'Special:MyPage/showAlertBox.js' ) + '?tour=tut4&step=7'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '9';
			}
		} );

	tour
		.step( {
			name: '9',
			title: 'The Rationale',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>LOGIC:<br><br>1) The modules - <b>oojs-ui-core, oojs-ui-windows</b> are loaded before the code runs. These modules are required to add an OOUI button and alert dialog, respectively.<br><br>2) The button widget is created and added to the navigation section of the Portlet area.<br><br>3) A \'click event listener\' is added to the OOUI button. The event handler shows an alert when the button is clicked.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '#bodyContent',
			position: 'bottom',
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/showAlertBox.js' ) + '?tour=tut4&step=8&action=edit'
			}, {
				name: 'Time to go to common.js',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut4&step=10'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '10',
			title: 'Edit common.js',
			description: '<br>Load the user script by editing common.js page.<br><br>',
			onShow: gt.parseDescription,
			attachTo: '#ca-edit',
			position: 'bottom',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/showAlertBox.js' ) + '?tour=tut4&step=9'
			} ],
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.hasQuery( { action: 'edit' } ) ) {
				return '11';
			}
		} );

	tour
		.step( {
			name: '11',
			title: 'Load the userscript',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Chances are your common.js looks cluttered at this point. Feel free to clear it up first :)<br><br>Next, copy and paste the following at the end of common.js:<br><b>mw.loader.load</b>( \'<nowiki>http://localhost:8080/w/index.php?title=User:' + mw.config.get( 'wgUserName' ) + '/showAlertBox.js&action=raw&ctype=text/javascript</nowiki>\' );<br><br>',
			onShow: gt.parseDescription,
			attachTo: '.wikiEditor-ui-text',
			position: 'bottomRight',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut4&step=10'
			}, {
				name: 'Done with it',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '12' );

	tour
		.step( {
			name: '12',
			title: 'Edit summary and Save Changes',
			description: '<br>Good work! Before you click Save Changes, leave a brief note about the changes you made.<br><br>Click SAVE CHANGES when you\'re ready.<br><br>',
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
						url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut4&step=11&action=edit'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '13';
			}
		} );

	tour
		.step( {
			name: '13',
			title: 'Play around',
			description: '<br>Did you see the button saying "Click me" on the left? In case you didn\'t, try bypassing your cache.<br><br>Click it to see an alert.<br><br>',
			onShow: gt.parseDescription,
			attachTo: '#tut-ooui-alert',
			position: 'bottomRight',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut4&step=12&action=edit'
			}, {
				name: 'Pretty neat',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/4/Start' ) + '?tour=tut4&step=14'
			} ],
			allowAutomaticOkay: false
		} );

}( window, document, jQuery, mediaWiki, mediaWiki.guidedTour ) );