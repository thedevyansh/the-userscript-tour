/**
 * Guidedtour-tour-tut1.js
 *
 * It creates a guided tour for The Userscript Tour: Mission 1 (Let's begin the journey).
 * It helps the users understand what userscripts are and how they are written and loaded in
 * their common.js, with the help of walkthroughs.
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
			name: 'tut1',
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
			title: 'Welcome to The Userscript Tour',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>We\'re so thrilled to have you! There\'s a ton of things to know about <b>user scripts</b>.<br><br>Don\'t worry, the learnings would be facilitated using interactive missions, each designed to help you get well-versed with the various aspects of user scripts.<br><br>The missions are constructed such that each one of them builds on its preceding missions in one or the other way.<br><br><b>Let\'s have some fun :)</b><br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: 'Let\'s get started',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '2' );

	// Step 2
	tour
		.step( {
			name: '2',
			title: 'Know before you go',
			description: '<br><b>Close button (X)</b><br> This box is  your tour guide: if you close it before completing a mission, you leave the tour and need to restart the mission from the beginning.<br><br><b>Automatic messages</b><br> When you take this tour, you send some messages to your personal MediaWiki pages, any time you see <big><b>*</b></big> in the blue button.<br><br><b>Source Editor</b><br> This tour uses only the Source Editor, not the Visual Editor.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=1'
			}, {
				name: 'Yeah, understood',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '3' );

	// Step 3
	tour
		.step( {
			name: '3',
			title: 'What is a user script?',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>A user script is a public JavaScript program that immediately changes the behavior of the software for a logged-in user. This program can be shared with other users and is located on wiki pages.<br><br>It provides a <b>personalized user experience of the MediaWiki software.</b> We can write user scripts either from scratch or by modifying an existing user script.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=2'
			}, {
				name: 'And gadgets?',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '4' );

	// Step 4
	tour
		.step( {
			name: '4',
			title: 'Gadgets',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>A gadget is a user script that has been <i>promoted</i> by an interface administrator.<br><br>Logged-in users can enable gadgets in the <b>Gadgets</b> tab of their <b>[[Special:Preferences|Preferences]]</b>.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=3'
			}, {
				name: 'Where is a user script written?',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '5' );

	// Step 5
	tour
		.step( {
			name: '5',
			title: 'Please welcome common.js!',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>A user script comes to life after being written or loaded on <b>common.js.</b><br><br> Confused a bit? Not to worry. We’ll get to it soon.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=4'
			}, {
				name: 'Hmm, alright',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '6' );

	// Step 6
	tour
		.step( {
			name: '6',
			title: 'Login or create an account',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Working with user scripts or gadgets requires you to login first.  Go for it.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=5'
			}, {
				name: 'I\'m logged in',
				type: 'neutral',
				onclick: function () {
					if ( mw.config.get( 'wgUserName' ) === null ) {
						showAlert( 'Please login', 'Please login to continue on the tour.' );
						return;
					}
					window.location.href = mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=7';
				}
			}, {
				name: 'I need to login',
				action: 'externalLink',
				url: mw.config.get( 'wgServer' ) + mw.config.get( 'wgScriptPath' ) + '/index.php?title=Special:UserLogin&returnto=TUT/1/Start&returntoquery=tour%3Dtut1%26step%3D7'
			}, {
				name: 'Register!',
				action: 'externalLink',
				url: mw.config.get( 'wgServer' ) + mw.config.get( 'wgScriptPath' ) + '/index.php?title=Special:UserLogin&returnto=TUT/1/Start&returntoquery=tour%3Dtut1%26step%3D7%26showGettingStarted%3Dfalse&type=signup'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 7
	tour
		.step( {
			name: '7',
			title: 'What\'s this common.js?',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>It’s <b>your personal JavaScript page,</b> located at User:' + mw.config.get( 'wgUserName' ) + '/common.js.<br><br>This page influences the interface and layout of a wiki for yourself only. It’s loaded regardless of which skin you are using.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=5'
			}, {
				name: 'Say hello to your common.js*',
				onclick: function () {
					if ( !mw.config.get( 'wgUserName' ) ) {
						showAlert( 'Please login', 'Please login to continue on the tour.' );
						return;
					}
					sendMessage(
						'User talk:' + mw.config.get( 'wgUserName' ),
						'TUT/Welcome',
						mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=8'
					);
				}
			} ],
			allowAutomaticOkay: false
		} );

	// Step 8
	tour
		.step( {
			name: '8',
			title: 'Your common.js',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Now you know the place where you write or load your user scripts. <b>Although public, only you can edit it.</b><br><br>How about loading your very first user script?<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=7'
			}, {
				name: 'Let\'s do this',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/1/Userscript1' ) + '?tour=tut1&step=9'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 9
	tour
		.step( {
			name: '9',
			title: 'Sneak Peek!',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>GO THROUGH the user script present at the above location.<br><br>We know you won\'t understand everything yet. You\'d get the hang of it once we make you familiar with <b>ResourceLoader</b> and <b>Action API.</b><br><br>Till then, our main focus is to learn to make the script come into effect.<br><br>',
			onShow: gt.parseDescription,
			attachTo: '#tutMessageBox1',
			position: 'bottom',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=8'
			}, {
				name: 'That feels better',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=10'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 10
	tour
		.step( {
			name: '10',
			title: 'Edit common.js',
			description: '<br>Edit this page to make your user script come to life.<br><br>Click <b>CREATE SOURCE</b> or <b>EDIT SOURCE</b> above.<br><br>(This tour always uses the SOURCE editor).<br><br>',
			onShow: gt.parseDescription,
			attachTo: '#ca-edit',
			position: 'bottom',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/1/Userscript1' ) + '?tour=tut1&step=9'
			} ],
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.hasQuery( { action: 'edit' } ) ) {
				return '11';
			}
		} );

	// Step 11
	tour
		.step( {
			name: '11',
			title: 'Let\'s load the user script',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>There are many ways to load a user script depending on whether it is on the same wiki or the other.<br><br>We’ll use <code>mw.loader.load()</code> as it can load user script from other Wikimedia websites as well.<br><br>Copy and paste above:<br><b>mw.loader.load</b>(\'<nowiki>https://en.wikipedia.org/w/index.php?title=User:BrandonXLF/Invert.js&action=raw&ctype=text/javascript</nowiki>\');<br><br>',
			onShow: gt.parseDescription,
			attachTo: '.wikiEditor-ui-text',
			position: 'bottomRight',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=10'
			}, {
				name: 'Copied and Pasted!',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '12' );

	// Step 12
	tour
		.step( {
			name: '12',
			title: 'Edit summary and Save Changes',
			description: '<br>That looks pretty cool! Before you click Save Changes, leave a brief note about the changes you made.<br><br>Click SAVE CHANGES when you\'re ready.<br><br>',
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
						url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=11&action=edit'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '13';
			}
		} );

	// Step 13
	tour
		.step( {
			name: '13',
			title: 'Play around',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>You could now see an <b>Invert link</b> on the top toolbar! Play around with it.<br><br>In case you don’t see the link, you may try <b>bypassing your cache.</b> Hold the <b>Shift</b> key and click the <i>Reload</i> button on the navigation toolbar.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=12&action=edit'
			}, {
				name: 'That\'s pretty cool',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=14'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 14
	tour
		.step( {
			name: '14',
			title: 'Congrats!',
			description: 'New badge earned: <b>SOLID START</b><div class="center">[[File:TUT badge 1.png|110px|link=]]</div><br>What a great start! You\'ve just loaded your first user script. How does it feel?<br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=13'
			}, {
				name: 'Thanks*',
				onclick: function () {
					if ( !mw.config.get( 'wgUserName' ) ) {
						showAlert( 'Please login', 'Please login to continue on the tour.' );
						return;
					}
					sendMessage(
						'User:' + mw.config.get( 'wgUserName' ) + '/theUserscriptTourBadges',
						'TUT/Badge/1template1',
						mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=15'
					);
				}
			} ],
			allowAutomaticOkay: false
		} );

	// Step 15
	tour
		.step( {
			name: '15',
			title: 'Your user subpage',
			description: '<br><br>Let\'s try something different this time!<br><br>We shall create a subpage in our user namespace to write the user script.<br><br><br>Well, how about <b>User:' + mw.config.get( 'wgUserName' ) + '/zoomThePage.js ?</b><br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=14'
			}, {
				name: 'Seems good',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/zoomThePage.js' ) + '?tour=tut1&step=16'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 16
	tour
		.step( {
			name: '16',
			title: 'Write a user script here',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Let\'s move ahead to write a user script in this <b>subpage of yours</b>. It would add 2 buttons to zoom in and zoom out the current page.',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/1/Start' ) + '?tour=tut1&step=15'
			}, {
				name: 'Why not?',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/zoomThePage.js' ) + '?tour=tut1&step=17&action=edit&preload=User:Novusistic/TUT_zoom.js'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 17
	tour
		.step( {
			name: '17',
			title: 'Sneak Peek!',
			description: '<br>Try to understand what\'s written in the above user script.<br><br>When done, edit the summary and click Save Changes.<br><br>',
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
						url: mw.util.getUrl( 'Special:MyPage/zoomThePage.js' ) + '?tour=tut1&step=16'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '18';
			}
		} );

	// Step 18
	tour
		.step( {
			name: '18',
			title: 'The Rationale',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>The logic behind the user script goes like this:<br><br><b>1.</b> The zoom-in and zoom-out buttons are instantiated using <b>OOUI</b> (to be discussed later).<br><br><b>2.</b> <b>updateSize() and zoom()</b> functions are defined to handle the click events on the zoom-in and zoom-out buttons.<br><br><b>3.</b> Later, the DOM elements are created and grabbed using CSS selectors via jQuery.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '#bodyContent',
			position: 'bottom',
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/zoomThePage.js' ) + '?tour=tut1&step=17&action=edit'
			}, {
				name: 'Sure',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '19' );

	// Step 19
	tour
		.step( {
			name: '19',
			title: 'What\'s next?',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>Do you think our task is over?<br>We haven\'t yet LOADED the user script in our common.js. So, let\'s head back to our common.js.<br><br><br><b>P.S.</b>If you recall, we loaded our first script using a similar argument. That\'s how you create user scripts in your user subpage and share them with the community.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '#bodyContent',
			position: 'bottom',
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/zoomThePage.js' ) + '?tour=tut1&step=18'
			}, {
				name: 'We are approaching the final steps',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=20'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 20
	tour
		.step( {
			name: '20',
			title: 'Edit common.js',
			description: '<br>Edit common.js to make your user script come to life. Click <b>EDIT SOURCE</b> above.',
			onShow: gt.parseDescription,
			attachTo: '#ca-edit',
			position: 'bottom',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/zoomThePage.js' ) + '?tour=tut1&step=19'
			} ],
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.hasQuery( { action: 'edit' } ) ) {
				return '21';
			}
		} );

	// Step 21
	tour
		.step( {
			name: '21',
			title: 'Load the user script',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Do you remember which method would come handy here? Ofcourse you do :)<br><br><br>Copy and paste above:<br><b>mw.loader.load</b>( \'<nowiki>https:' + mw.config.get( 'wgServer' ) + '/w/index.php?title=User:' + mw.config.get( 'wgUserName' ) + '/zoomThePage.js&action=raw&ctype=text/javascript</nowiki>\' );<br><br>',
			onShow: gt.parseDescription,
			attachTo: '.wikiEditor-ui-text',
			position: 'bottomRight',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=20'
			}, {
				name: 'Copied and Pasted!',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '22' );

	// Step 22
	tour
		.step( {
			name: '22',
			title: 'Edit summary and Save Changes',
			description: '<br>Well done! Before you click Save Changes, leave a brief note about the changes you made.<br><br>Click Save Changes when you\'re ready.<br><br>',
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
						url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=21&action=edit'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '23';
			}
		} );

	// Step 23
	tour
		.step( {
			name: '23',
			title: 'You are impressive!',
			description: '<br><div align="center">[[File:TWA fireworks small.png|100px|link=]]</div><br>Check out the <b>two magnifying glass buttons</b> on the right of the article page. If they are not visible, consider bypassing the cache.<br><br>It\'s striking to see your pace of experiential learning! Keep up the good work.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=22&action=edit'
			}, {
				name: 'Where to go next?',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/1/End' ) + '?tour=tut1&step=24'
			} ],
			allowAutomaticOkay: false
		} );

	// Step 24
	tour
		.step( {
			name: '24',
			title: 'Mission 1 complete!',
			description: '<br>This concludes <b>Mission 1:</b> Let\'s get started.<br><br>You\'re all set for your journey on <b>Mission 2:</b> Developing with ResourceLoader<br><br>',
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
