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
			description: '<br>The base module <b>mediawiki</b> initialises the <code>mw</code> global object.<br><br>Add the following line at the end:<br><b>mw.notify( \'* I am on a ResouceLoader Tour! *\' );</b><br><br>',
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

	tour
		.step( {
			name: '10',
			title: 'Good work!',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>Did you see the bubble notification on the top right? If you didn’t, try bypassing your cache.<br><br>You would now see the notification on every page load since common.js is loaded every time.<br><br><b>How can we go about using the modules other than the base modules?</b><br><br>',
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

	tour
		.step( {
			name: '11',
			title: 'Challenge yourself above',
			description: '<br>Hint: You can learn as much from getting it wrong as getting it right.  And you can always try again!<br>',
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

	tour
		.step( {
			name: '12',
			title: 'mw.loader.using()',
			description: '<br><div align="left">[[File:TUT rocket.png]]</div><br>It\'s actually simple to load modules in user scripts!<br><br>For user scripts, the only way to load dependencies is to do so lazily, by wrapping the code in a <code>mw.loader.using</code> block, and specify the required modules.<br><br>',
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

	tour
		.step( {
			name: '13',
			title: 'Toggle font color',
			description: '<div align="right">[[File:TUT nurturing yourself.png]]</div><br>We would be using the modules: <b>mediawiki.util</b> and <b>oojs-ui-core.</b><br><br>Go through the comments in the user script that we\'re going to put up for you in your common.js<br><br>',
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

	tour
		.step( {
			name: '14',
			title: 'Play around',
			description: '<br>Click the toggle button to change the font color. Or bypass your cache in case the button is not visible.<br><br>Pretty neat...How about a glance at the <b>core modules<b/>?<br><br>',
			onShow: gt.parseDescription,
			attachTo: '.toggleColorBtn',
			position: 'bottomLeft',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: 'Let\'s see',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'TUT/2/ResourceLoader/CoreModules' ) + '?tour=tut2&step=15'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '15',
			title: 'Sneak Peek',
			description: '<br><div align="left">[[File:TUT rocket.png]]</div><br>To have an exhaustive view of all the core modules, click <b>Check all modules</b>. You can always use it as a reference.<br><br>Click <b>Continue</b> to continue on the tour.<br><br>',
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
				url: 'https://www.mediawiki.org/wiki/ResourceLoader/Core_modules'
			}, {
				name: 'Continue',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/quickChangeLog.js' ) + '?tour=tut2&step=16'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '16',
			title: 'Your subpage',
			description: '<br>You’ll now put everything you have learned so far into action in subpage - <b>User:' + mw.config.get( 'wgUserName' ) + '/quickChangeLog.js</b>.<br><br>The next user script shows a dialog with up to 25 recent edits on the entire wiki!<br><br>',
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
				url: mw.util.getUrl( 'Special:MyPage/quickChangeLog.js' ) + '?tour=tut2&step=17&action=edit&preload=User:Novusistic/TUT_quickChangeLog.js'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '17',
			title: 'Check it out',
			description: '<br>The above user script is a good example. You may refer <b>[[ResourceLoader/Core_modules]]</b> anytime.<br><br>Have a look at this script and when done, edit summary and save the changes.<br><br>',
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
						url: mw.util.getUrl( 'Special:MyPage/quickChangeLog.js' ) + '?tour=tut2&step=16'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '18';
			}
		} );

	tour
		.step( {
			name: '18',
			title: 'The Rationale',
			description: '<div align="right">[[File:TUT nurturing yourself.png|link=]]</div><br>The logic behind the user script goes like this:<br><br><b>1.</b> The required modules are called.<br><b>2.</b> When the page is fully loaded, a new link is added to the Portlet area.<br><b>3. quickRC()</b> fetches the recent changes and passes the data to renderQuickRCDialog().<br><b>4. renderQuickRCDialog()</b> pops up a dialog when the QUICK CHANGELOG link in the toolbox is clicked. The dialog contains the recent changes.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '#bodyContent',
			position: 'bottom',
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/quickChangeLog.js' ) + '?tour=tut2&step=17&action=edit'
			}, {
				name: 'Let\'s head to common.js',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=19&action=edit'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '19',
			title: 'Load Quick ChangeLog',
			description: '<br><div align="left">[[File:TUT rocket.png|link=]]</div><br>In case your common.js looks cluttered at this point, feel free to clear it up :)<br><br>Now copy and paste above:<br><b>mw.loader.load</b>(\'<nowiki>http://localhost:8080/w/index.php?title=User:' + mw.config.get( 'wgUserName' ) + '/quickChangeLog.js&action=raw&ctype=text/javascript</nowiki>\');<br><br>',
			onShow: gt.parseDescription,
			attachTo: '.wikiEditor-ui-text',
			position: 'bottomRight',
			overlay: false,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/quickChangeLog.js' ) + '?tour=tut2&step=18'
			}, {
				name: 'Copied and Pasted!',
				action: 'next'
			} ],
			allowAutomaticOkay: false
		} )
		.next( '20' );

	tour
		.step( {
			name: '20',
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
						url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=19&action=edit'
					} ] :
					postEditButtons,
			allowAutomaticOkay: false
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '21';
			}
		} );

	tour
		.step( {
			name: '21',
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
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=20&action=edit'
			}, {
				name: 'Legit',
				type: 'progressive',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=22'
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '22',
			title: 'Congrats!',
			description: 'New badge earned: <b>CONQUEROR</b><div class="center">[[File:TUT badge 2.png|110px|link=]]</div><br>Kudos! You have been resilient all this time. Great work!<br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [ {
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut2&step=21'
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
						mw.util.getUrl( 'TUT/2/End' ) + '?tour=tut2&step=23'
					);
				}
			} ],
			allowAutomaticOkay: false
		} );

	tour
		.step( {
			name: '23',
			title: 'Mission 2 complete!',
			description: '<br>This concludes <b>Mission 2:</b> Developing with ResourceLoader.<br><br>You\'re all set for your journey on <b>Mission 3:</b> Strengths of the Action API<br><br>',
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
