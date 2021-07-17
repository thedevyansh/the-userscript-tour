/* eslint-disable max-len */
/**
 * Guidedtour-tour-tut3.js
 *
 * It creates a guided tour for The Userscript Tour: Mission 3 (Strengths of the Action API).
 * It makes the users familiar with MediaWiki Action API, how to test the API with the API Sandbox,
 * and how to write userscripts using the API.
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
			name: 'tut3',
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
			title: 'Welcome back!',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Hey, good to see you again. You seem all pumped up to embark on this journey of <b>MediaWiki Action API.</b><br><br>Ready to make this journey an insightful one?<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: 'Let\'s begin',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '2' );

	tour
		.step( {
			name: '2',
			title: 'Action API',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>The MediaWiki Action API is a web service that allows access to wiki-features like authentication, page operations, and search.<br><br>It\'s a medium to perform actions on a wiki <i>programmatically.</i><br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=1'
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
			title: 'What can it be used for?',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>The Action API can be used to:<br>1) access wiki features<br>2) interact with a wiki<br>3) obtain meta-information about wikis and public users<br><br>Think of any operation you can perform on a wiki via the user-interface. You can perform the same and <b>more</b> via the Action API!<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=2'
			}, {
				name: 'Sounds good',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '4' );

	tour
		.step( {
			name: '4',
			title: 'Interesting use cases',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>To have a glimpse of the demo apps created using the Action API, we encourage you to explore <b>Toolforge.</b><br><br>It shows a plethora of things you can build using the API.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=3'
			}, {
				name: 'Browse demo apps on Toolforge',
				action: 'externalLink',
				url: 'https://apps-gallery.toolforge.org/'
			}, {
				name: 'Done',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '5' );

	tour
		.step( {
			name: '5',
			title: 'Hands-on Action API',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Let\'s leverage the Action API.<br><br>To begin with, we\'ll fetch the basic information about the wiki pages - in this case, the MediaWiki pages.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=4'
			}, {
				name: 'Alright',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/basicPageInfo.js' ) + '?tour=tut3&step=6'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '6',
			title: 'Your subpage',
			description: '<br>This user script will display the length of characters (or the number of bytes) on every page.<br><br>The name of our subpage would be <b>User:' + mw.config.get( 'wgUserName' ) + '/basicPageInfo.js</b><br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=5'
			}, {
				name: 'Sure',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/basicPageInfo.js' ) + '?tour=tut3&step=7&action=edit&preload=User:Novusistic/TUT_basicPageInfo.js'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '7',
			title: 'Sneak Peek',
			description: '<br>Go through the comments in the above user script. The concepts are explained well.<br><br>Once done, edit the summary and save changes.<br><br>',
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
						url: mw.util.getUrl( 'Special:MyPage/basicPageInfo.js' ) + '?tour=tut3&step=6'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '8';
			}
		} );

	tour
		.step( {
			name: '8',
			title: 'The Rationale',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>LOGIC:<br><br>1) The <b>mediawiki.api</b> module is initially loaded, which makes the mw.Api constructor available.<br><br>2) Once the module is loaded, a <b>GET</b> request is made to fetch the basic information of the current page.<br><br>3) The desired information is shown on the top of the page using the prepend() method of jQuery.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '#bodyContent',
			position: 'bottom',
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/basicPageInfo.js' ) + '?tour=tut3&step=7&action=edit'
			}, {
				name: 'Let\'s get to common.js',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut3&step=9'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '9',
			title: 'Edit common.js',
			description: '<br>By now, you would have memorized all the steps of loading a user script.<br><br>Click CREATE SOURCE or EDIT SOURCE above.<br><br>',
			onShow: gt.parseDescription,
			attachTo: '#ca-edit',
			position: 'bottom',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/basicPageInfo.js' ) + '?tour=tut3&step=8'
			} ],
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.hasQuery( { action: 'edit' } ) ) {
				return '10';
			}
		} );

	tour
		.step( {
			name: '10',
			title: 'Load the userscript',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>In case the page looks cluttered, you may consider clearing it a bit or entirely.<br><br>Now copy and paste the following at the end of common.js:<br><b>mw.loader.load</b>( \'<nowiki>http://localhost:8080/w/index.php?title=User:' + mw.config.get( 'wgUserName' ) + '/basicPageInfo.js&action=raw&ctype=text/javascript</nowiki>\' );<br><br>',
			onShow: gt.parseDescription,
			attachTo: '.wikiEditor-ui-text',
			position: 'bottomRight',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut3&step=9'
			}, {
				name: 'Copied and Pasted!',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '11' );

	tour
		.step( {
			name: '11',
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
						url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut3&step=10&action=edit'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '12';
			}
		} );

	tour
		.step( {
			name: '12',
			title: 'Number of bytes',
			description: '<br>Do you see the byte count. If you don’t, try bypassing your cache (<i>by holding the Shift key and clicking the Reload button</i>).<br><br><b>You would now see the number of bytes on every page.</b><br><br>',
			onShow: gt.parseDescription,
			attachTo: '#byte-count',
			position: 'bottom',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut3&step=11&action=edit'
			}, {
				name: 'Right',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=13'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '13',
			title: 'Endpoints',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>All Wikimedia wikis have endpoints that follow this pattern: <b><nowiki>https://www.example.org/w/api.php</nowiki></b>. For example:<br><br>MediaWiki API -<br><code><nowiki>https://www.mediawiki.org/w/api.php</nowiki></code><br><br>English Wikipedia API -<br><code><nowiki>https://en.wikipedia.org/w/api.php</nowiki></code><br><br>and so on.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut3&step=12'
			}, {
				name: 'Okay',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '14' );

	tour
		.step( {
			name: '14',
			title: 'Module, submodule, parameter',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>Consider the following request:<br><b>api.php ? action=query & prop=info & titles=API:Main_page & format=json</b><br><br>here:<br><br>1) <code>action</code> is a parameter of the main module.<br>2) <code>action=query</code> is another module.<br>3) <code>prop</code> and <code>titles</code> are parameters of the query module.<br>4) <code>format</code> is a parameter of the main module.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=13'
			}, {
				name: 'Alright',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '15' );

	tour
		.step( {
			name: '15',
			title: 'Where to go for reference?',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>The MediaWiki Action API is big. To work out your API request:<br><br>In the sidebar of the <b>API Main Page</b>, look for the feature you wish to implement and follow the link for information about which modules to call.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=14'
			}, {
				name: 'Check the API main page',
				action: 'externalLink',
				url: 'https://www.mediawiki.org/wiki/API:Main_page?tour=tut3&step=16'
			}, {
				name: 'What\'s next',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:ApiSandbox' ) + '?tour=tut3&step=17'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '16',
			title: 'Lots of use cases!',
			description: '<br>You may look for the feature you wish to implement using the API from the pool of features in the sidebar.<br><br>',
			onShow: gt.parseDescription,
			attachTo: '.vertical-navbox',
			position: 'leftTop',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=15'
			}, {
				name: 'What\'s next',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:ApiSandbox' ) + '?tour=tut3&step=17'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '17',
			title: 'API Sandbox',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Welcome to the API Sandbox!<br><br>It is used to test and experiment with the Action API. Note that, although this is a sandbox, actions you carry out on this page may modify the wiki.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=15'
			}, {
				name: 'Play with the sandbox',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '18' );

}( window, document, jQuery, mediaWiki, mediaWiki.guidedTour ) );
