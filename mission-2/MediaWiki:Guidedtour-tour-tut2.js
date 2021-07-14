/**
 * Guidedtour-tour-tut2.js
 *
 * It creates a guided tour for The Userscript Tour: Mission 2 (Developing with ResourceLoader).
 * It makes the users familiar with ResourcLoader, and how to write userscripts by loading the
 * ResourceLoader core modules in their scripts. It helps them know about the modules such as
 * mediawiki, jquery, mediawiki.util, etc. and where to go for the references.
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
			name: 'tut2',
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
			title: 'Developing with ResourceLoader',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Journey to Mission 2 begins.<br><br>We\'ll answer some of your questions that arose in the previous mission, here. Let\'s get started.<br><br>',
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

	// Step 2
	tour
		.step( {
			name: '2',
			title: 'ResourceLoader',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br><b>ResourceLoader</b> is a mechanism to <b>intelligently deliver the resources to the wikis.</b><br><br>The resources could be any of the following:<br>1) JavaScript<br>2) Styles<br>3) Messages<br><br>',
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

	// Step 3
	tour
		.step( {
			name: '3',
			title: 'Are these resources requested separately?',
			description: '<br>These resources are not requested separately.<br><br>Please welcome <b>MODULES!</b><br><br><div align="center">[[File:ResourceLoader OSCON 2011.pdf|page=15|400px|link=]]</div><br>',
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

	// Step 4
	tour
		.step( {
			name: '4',
			title: 'Module',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>A module is a <b>bundle of resources.</b> It can contain any type of resources.<br><br>ResourceLoader makes it possible to load a module by just using its name. Multiple modules bundled are delivered to the client in a <b>single request.</b><br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/2/Start' ) + '?tour=tut2&step=3'
			}, {
				name: 'Got it',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '5' );

	// Step 5
	tour
		.step( {
			name: '5',
			title: 'Do I have to request all modules?',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>The modules <b>mediawiki</b> and <b>jquery</b> together form the base environment and are ALWAYS present, so they will <b>never</b> be requested.<br><br><b>P.S.</b> As we shall see, modules like mediawiki.api, mediawiki.util, etc. need to be requested even though <b>mediawiki</b> is always present.<br><br>',
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

	// Step 6
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

	// Step 7
	tour
		.step( {
			name: '7',
			title: 'Edit common.js',
			description: '<br>Click <b>CREATE SOURCE</b> or <b>EDIT SOURCE</b> above.<br><br>',
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

	// Step 8
	tour
		.step( {
			name: '8',
			title: 'mw.notify()',
			description: '<br>The base module <b>mediawiki</b> initialises the <code>mw</code> global object.<br><br>Add the following line at the end:<br><b>mw.notify( \'I am on RESOURCELOADER TOUR.\', { type: \'success\' } );</b><br><br>',
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

	// Step 9
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

	// Step 10
	tour
		.step( {
			name: '10',
			title: 'Good work!',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Did you see the bubble notification on the top right? If you didn’t, try bypassing your cache (<i>by holding the Shift key and clicking the Reload button</i>).<br><br><b>How can we go about using the modules other than the base modules?</b><br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=9&action=edit'
			}, {
				name: 'Let\'s find out',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/2/Question1' ) + '?tour=tut2&step=11'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 11
	tour
		.step( {
			name: '11',
			title: 'Challenge yourself above',
			description: '<br>You can learn as much from getting it wrong as getting it right.  And you can always try again!<br>',
			onShow: gt.parseDescription,
			attachTo: '#tutMessageBox1',
			position: 'bottom',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=10'
			} ],
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( mw.config.get( 'wgPageName' ) === 'TUT/2/Question1/2' ) {
				return '12';
			}
		} );

	// Step 12
	tour
		.step( {
			name: '12',
			title: 'mw.loader.using()',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>It\'s actually simple to load modules in user scripts!<br><br>For user scripts, the only way to load dependencies is to do so lazily, by wrapping the code in a <code>mw.loader.using</code> block, and specifying the required modules.<br><br>',
			onShow: gt.parseDescription,
			attachTo: '#tutMessageBox1',
			position: 'bottom',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=10'
			}, {
				name: 'Hands-On',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=13'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 13
	tour
		.step( {
			name: '13',
			title: 'Toggle font color',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>Now, we would be using the module: <b>mediawiki.util.</b><br><br>Go through the comments in the user script that we\'re going to put up for you in common.js<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/2/Question1/2' ) + '?tour=tut2&step=12'
			}, {
				name: 'Sure, thanks*',
				onclick: function () {
					if ( !mw.config.get( 'wgUserName' ) ) {
						showAlert( 'Please login', 'Please login to continue on the tour.' );
						return;
					}
					sendMessage(
						'User:' + mw.config.get( 'wgUserName' ) + '/common.js',
						'User:Novusistic/TUT_toggleFontColor.js',
						mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=14'
					);
				}
			} ],
			allowAutomaticOkay: false
		} );

	// Step 14
	tour
		.step( {
			name: '14',
			title: 'Play around',
			description: '<br>Click the \'Toggle color\' link to change the font color. Or bypass your cache in case the button is not visible.<br><br>Also, you can check its user script in your common.js below.<br><br>',
			onShow: gt.parseDescription,
			attachTo: '#t-toggleFontColor',
			position: 'bottomLeft',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: 'Let\'s check the core modules',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/2/ResourceLoader/CoreModules' ) + '?tour=tut2&step=15'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 15
	tour
		.step( {
			name: '15',
			title: 'Sneak Peek',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>To have an exhaustive view of all the core modules, click <b>Check all modules</b>. You can always use it as a reference.<br><br>Click <b>Continue</b> to continue on the tour.<br><br>',
			onShow: gt.parseDescription,
			attachTo: '#tutMessageBox1',
			position: 'bottom',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=14'
			}, {
				name: 'Check all modules',
				action: 'externalLink',
				url: 'https://www.mediawiki.org/wiki/ResourceLoader/Core_modules?tour=tut2&step=16'
			}, {
				name: 'Continue',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/userEditCount.js' ) + '?tour=tut2&step=17'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 16
	tour
		.step( {
			name: '16',
			title: 'All the core modules!',
			description: '<br>The following gives a detailed view of all the ResourceLoader core modules. Have a look.<br><br>',
			onShow: gt.parseDescription,
			attachTo: '#contentSub',
			position: 'bottom',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/2/ResourceLoader/CoreModules' ) + '?tour=tut2&step=15'
			}, {
				name: 'Continue on the tour',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/userEditCount.js' ) + '?tour=tut2&step=17'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 17
	tour
		.step( {
			name: '17',
			title: 'Your subpage',
			description: '<br>Next, we\'ll be using mw.config in our user script. Let\'s create a subpage - <b>User:' + mw.config.get( 'wgUserName' ) + '/userEditCount.js</b>.<br><br>This script will show the count of edits made by you on the current wiki.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/2/ResourceLoader/CoreModules' ) + '?tour=tut2&step=15'
			}, {
				name: 'Okay',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/userEditCount.js' ) + '?tour=tut2&step=18&action=edit&preload=User:Novusistic/TUT_userEditCount.js'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 18
	tour
		.step( {
			name: '18',
			title: 'Check it out',
			description: '<br>You may refer to the <b>core modules</b> anytime.<br><br>Have a look at this tiny script and when done, edit summary and save the changes.<br><br>',
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
						url: mw.util.getUrl( 'Special:MyPage/userEditCount.js' ) + '?tour=tut2&step=17'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '19';
			}
		} );

	// Step 19
	tour
		.step( {
			name: '19',
			title: 'The Rationale',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>The logic behind the user script goes like this:<br><br><b>1.</b> The user script waits for the page to load.<br><br><b>2.</b> When it does, the count of edits made by the logged-in user is found using <b>mw.config.get()</b> method.<br><br><b>3.</b> Finally, the edit count is appended to the username of the logged-in user at the personal portlet area.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '#bodyContent',
			position: 'bottom',
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/userEditCount.js' ) + '?tour=tut2&step=18&action=edit'
			}, {
				name: 'Let\'s head to common.js',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=20&action=edit'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 20
	tour
		.step( {
			name: '20',
			title: 'Load the script',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>In case your common.js looks cluttered at this point, feel free to clear it up :)<br><br>Now copy and paste at the very end:<br><b>mw.loader.load</b>(\'<nowiki>https://mediawiki.org/w/index.php?title=User:' + mw.config.get( 'wgUserName' ) + '/userEditCount.js&action=raw&ctype=text/javascript</nowiki>\');<br><br>',
			onShow: gt.parseDescription,
			attachTo: '.wikiEditor-ui-text',
			position: 'bottomRight',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/userEditCount.js' ) + '?tour=tut2&step=19'
			}, {
				name: 'Copied and Pasted!',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '21' );

	// Step 21
	tour
		.step( {
			name: '21',
			title: 'Edit summary and Save Changes',
			description: '<br>Great! Before you click Save Changes, leave a brief note about the changes you made.<br><br>Click Save Changes when you\'re ready.<br><br>',
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
						url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=20&action=edit'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '22';
			}
		} );

	// Step 22
	tour
		.step( {
			name: '22',
			title: 'See something?',
			description: '<br>You could now see the count of edits made by you on this wiki (in brackets).<br><br>Bypass your cache if the changes are not visible to you.<br><br>',
			onShow: gt.parseDescription,
			attachTo: '#pt-userpage',
			position: 'bottom',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=21&action=edit'
			}, {
				name: 'Legit',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=23'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 23
	tour
		.step( {
			name: '23',
			title: 'Congrats!',
			description: 'New badge earned: <b>CONQUEROR</b><div class="center">[[File:TUT badge 2.png|110px|link=]]</div><br>Kudos! You have been resilient all this time. Great work!<br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=22'
			}, {
				name: 'Thanks*',
				onclick: function () {
					if ( !mw.config.get( 'wgUserName' ) ) {
						showAlert( 'Please login', 'Please login to continue on the tour.' );
						return;
					}
					sendMessage(
						'User:' + mw.config.get( 'wgUserName' ),
						'TUT/Badge/2template1',
						mw.util.getUrl( 'TUT/2/End' ) + '?tour=tut2&step=24'
					);
				}
			} ],
			allowAutomaticOkay: false
		} );

	// Step 24
	tour
		.step( {
			name: '24',
			title: 'Mission 2 complete!',
			description: '<br>This concludes <b>Mission 2.</b><br><br>You\'re all set for your journey on <b>Mission 3:</b> Strengths of the Action API<br><br>',
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
