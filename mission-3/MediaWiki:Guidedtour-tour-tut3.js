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

	// Step 1
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

	// Step 2
	tour
		.step( {
			name: '2',
			title: 'MediaWiki Action API',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>The MediaWiki Action API is a web service that allows access to wiki-features like page operations (create and edit a page, get the contents of a page, etc.) and search.<br><br>It\'s a medium to perform actions on a wiki <i>programmatically.</i><br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=1'
			}, {
				name: 'Okay!',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '3' );

	// Step 3
	tour
		.step( {
			name: '3',
			title: 'What can it be used for?',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>The MediaWiki Action API can be used to:<br>1) access wiki features<br>2) interact with a wiki<br>3) obtain meta-information about wikis and public users<br><br>The wiki operations that can be performed via the user-interface can also be performed via the MediaWiki Action API.<br><br>',
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

	// Step 4
	tour
		.step( {
			name: '4',
			title: 'Interesting use case',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>A widely used application of MediaWiki Action API is <b>HotCat.</b><br><br>HotCat facilitates addition, removal and changing of categories on wiki pages.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=3'
			}, {
				name: 'Explore HotCat',
				type: 'neutral',
				onclick: function () {
					window.open( 'https://commons.wikimedia.org/wiki/Help:Gadget-HotCat', '_blank' );
				}
			}, {
				name: 'Move ahead',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '5' );

	// Step 5
	tour
		.step( {
			name: '5',
			title: 'Hands-on',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Let\'s leverage the MediaWiki Action API.<br><br>To begin with, we\'ll fetch the basic information about the wiki pages.<br><br>',
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

	// Step 6
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

	// Step 7
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

	// Step 8
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

	// Step 9
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

	// Step 10
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

	// Step 11
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

	// Step 12
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

	// Step 13
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

	// Step 14
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

	// Step 15
	tour
		.step( {
			name: '15',
			title: 'Where to go for reference?',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>The MediaWiki Action API is big. To work out your API request:<br><br>In the sidebar of the <b>API:Main_page</b>, look for the feature you wish to implement and follow the link for information about which modules to call.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=14'
			}, {
				name: 'API:Main_page',
				action: 'externalLink',
				url: mw.util.getUrl( 'API:Main_page' ) + '?tour=tut3&step=16'
			}, {
				name: 'API Sandbox',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:ApiSandbox' ) + '?tour=tut3&step=17'
			}, {
				name: 'Next',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/quickChangeLog.js' ) + '?tour=tut3&step=23'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 16
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
				name: 'Continue on the tour',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/quickChangeLog.js' ) + '?tour=tut3&step=23'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 17
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

	// Step 18
	tour
		.step( {
			name: '18',
			title: 'main module',
			description: '<br>This is the main module with available parameters.<br><br>Choose <b>"query"</b> from the dropdown corresponding to the parameter <b>"action"</b>, below.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '#mw-head',
			position: 'bottom',
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'back'
			}, {
				name: 'Selected query module',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.back( '17' )
		.next( '19' );

	// Step 19
	tour
		.step( {
			name: '19',
			title: 'action=query',
			description: '<br>Next, select <b>action=query</b> from the sidebar.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '.oo-ui-menuLayout-menu',
			position: 'rightTop',
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'back'
			}, {
				name: 'Done',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.back( '18' )
		.next( '20' );

	// Step 20
	tour
		.step( {
			name: '20',
			title: 'query module',
			description: '<br>This is the query module with available parameters.<br><br><b>1)</b> Select <b>"info"</b> from the dropdown corresponding to the parameter- <b>prop</b><br><b>2)</b> Type <b>API:Main_page</b> in the field corresponding to the parameter- <b>titles</b><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '#mw-head',
			position: 'bottom',
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'back'
			}, {
				name: 'Selected',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.back( '19' )
		.next( '21' );

	// Step 21
	tour
		.step( {
			name: '21',
			title: 'Make request',
			description: '<br>Once done, click MAKE REQUEST to send the API request.<br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '.mw-apisandbox-toolbar',
			position: 'bottomRight',
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'back'
			} ],
			allowAutomaticOkay: false
		} )
		.back( '20' );

	// Step 22
	tour
		.step( {
			name: '22',
			title: 'API response',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Here\'s the response from the server!<br><br>In the similar manner, you can test your API requests using different combinations of modules, submodules, and parameters.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '.api-pretty-content',
			position: 'bottom',
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:ApiSandbox' ) + '?tour=tut3&step=17'
			}, {
				name: 'That is cool',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/quickChangeLog.js' ) + '?tour=tut3&step=23'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 23
	tour
		.step( {
			name: '23',
			title: 'Your subpage',
			description: '<br>You’ll now put everything you have learned so far into action in the subpage - <b>User:' + mw.config.get( 'wgUserName' ) + '/quickChangeLog.js</b>.<br><br>The next user script shows a dialog with up to 25 recent edits on the entire wiki!<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/3/Start' ) + '?tour=tut3&step=15'
			}, {
				name: 'Okay',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/quickChangeLog.js' ) + '?tour=tut3&step=24&action=edit&preload=User:Novusistic/TUT_quickChangeLog.js'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 24
	tour
		.step( {
			name: '24',
			title: 'Check it out',
			description: '<br>The above user script combines the <b>crux</b> of the ongoing as well as previous missions.<br><br>Have a good look at this script and when done, edit summary and save the changes.<br><br>',
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
						url: mw.util.getUrl( 'Special:MyPage/quickChangeLog.js' ) + '?tour=tut3&step=23'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '25';
			}
		} );

	// Step 25
	tour
		.step( {
			name: '25',
			title: 'The Rationale',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>LOGIC:<br><br><b>1.</b> The required modules are called.<br><b>2.</b> When the page is fully loaded, a new link is added to the Portlet area.<br><b>3. quickRC()</b> fetches the recent changes using the Action API and passes the data to renderQuickRCDialog().<br><b>4. renderQuickRCDialog()</b> pops up a dialog when the QUICK CHANGELOG link in the toolbox is clicked. The dialog contains the recent changes.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '#bodyContent',
			position: 'bottom',
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/quickChangeLog.js' ) + '?tour=tut3&step=24&action=edit'
			}, {
				name: 'Let\'s head to common.js',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut3&step=26&action=edit'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 26
	tour
		.step( {
			name: '26',
			title: 'Load Quick ChangeLog',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Feel free to clear common.js first, if it looks cluttered.<br><br>Now copy and paste at the very end:<br><b>mw.loader.load</b>(\'<nowiki>http://localhost:8080/w/index.php?title=User:' + mw.config.get( 'wgUserName' ) + '/quickChangeLog.js&action=raw&ctype=text/javascript</nowiki>\');<br><br>',
			onShow: gt.parseDescription,
			attachTo: '.wikiEditor-ui-text',
			position: 'bottomRight',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/quickChangeLog.js' ) + '?tour=tut3&step=25'
			}, {
				name: 'Copied and Pasted!',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '27' );

	// Step 27
	tour
		.step( {
			name: '27',
			title: 'Edit summary and Save Changes',
			description: '<br>Before you click Save Changes, leave a brief note about the changes you made.<br><br>Click Save Changes when you\'re ready.<br><br>',
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
						url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut3&step=26&action=edit'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '28';
			}
		} );

	// Step 28
	tour
		.step( {
			name: '28',
			title: 'Play around',
			description: '<br>Click the QUICK CHANGELOG link in the toolbox.<br><br>Bypass your cache if the changes are not visible to you.<br><br>',
			onShow: gt.parseDescription,
			attachTo: '#t-prettylinkwidget',
			position: 'right',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut3&step=27&action=edit'
			}, {
				name: 'Legit',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut3&step=29'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 29
	tour
		.step( {
			name: '29',
			title: 'Congrats!',
			description: 'New badge earned: <b>ONE FRONTIER TO GO</b><div class="center">[[File:TUT badge 3.png|110px|link=]]</div><br>Brilliant work! Take your time to pat on your shoulder for coming this far.<br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut3&step=28'
			}, {
				name: 'Thanks*',
				onclick: function () {
					if ( !mw.config.get( 'wgUserName' ) ) {
						showAlert( 'Please login', 'Please login to continue on the tour.' );
						return;
					}
					sendMessage(
						'User:' + mw.config.get( 'wgUserName' ),
						'TUT/Badge/3template1',
						mw.util.getUrl( 'TUT/3/End' ) + '?tour=tut3&step=30'
					);
				}
			} ],
			allowAutomaticOkay: false
		} );

	// Step 30
	tour
		.step( {
			name: '30',
			title: 'Mission 3 complete!',
			description: '<br>This concludes <b>Mission 3.</b><br><br>You\'re all set for your journey on <b>Mission 4:</b> Novelty of OOUI<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: 'Congrats me!',
				action: 'end'
			} ],
			allowAutomaticOkay: false
		} );

}( window, document, jQuery, mediaWiki, mediaWiki.guidedTour ) );
