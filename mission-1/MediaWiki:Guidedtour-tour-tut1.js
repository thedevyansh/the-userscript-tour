( function ( window, document, $, mw, gt ) {

	mw.loader.load( [ 'oojs-ui-core', 'oojs-ui-windows' ] );

	function displayAlert() {
		var messageDialog = new OO.ui.MessageDialog();
		messageDialog.$element.css( { zIndex: '100000010' } );

		var windowManager = new OO.ui.WindowManager();
		$( 'body' ).append( windowManager.$element );

		windowManager.addWindows( [ messageDialog ] );

		windowManager.openWindow( messageDialog, {
			title: 'Please login',
			message: 'Please login to continue on the tour.',
			actions: [
				{
					action: 'accept',
					label: 'OK',
					flags: 'primary'
				}
			]
		} );
	}

	function sendMessage( targetPage, msgPage, linkTo ) {
		var api = new mw.Api();
		api
			.get( {
				action: 'query',
				titles: msgPage,
				prop: 'revisions',
				meta: 'tokens',
				rvprop: 'content',
				indexpageids: 1
			} )
			.done( function ( result ) {
				result = result.query;
				var csrfToken = result.tokens.csrftoken;
				var page = result.pages[ result.pageids[ 0 ] ];
				var text = page.revisions[ 0 ][ '*' ];
				api
					.post( {
						action: 'edit',
						title: targetPage,
						appendtext: '\n' + text,
						summary:
              'New Message (simulated automatically as part of [[MediaWiki:The Userscript Tour|The Userscript Tour]])',
						token: csrfToken
					} )
					.done( function () {
						window.location.href = linkTo;
					} );
			} );
	}

	var postEditButtons = [];
	if ( mw.config.get( 'wgAction' ) === 'view' && !gt.isPostEdit() ) {
		postEditButtons.push( {
			name: 'Click here to go back and make an edit',
			onclick: function () {
				window.location.href = window.location.href + '?action=edit';
			}
		} );
	}

	var tour;
	tour = new gt.TourBuilder( {
		name: 'tut1',
		shouldLog: true
	} );

	tour
		.firstStep( {
			name: '1',
			title: 'Welcome to The Userscript Tour',
			description:
        '<br><div align="left">[[File:TUT rocket.png|120px|link=]]</div><br>We\'re so thrilled to have you! There\'s a ton of things to know about <b>user scripts</b>.<br><br>Don\'t worry, the learnings would be facilitated using interactive missions, each designed to help you get well-versed with the various aspects of user scripts.<br><br>The missions are constructed such that each one of them builds on its preceding missions in one or the other way.<br><br><b>Let\'s have some fun :)</b><br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [
				{
					name: "Let's get started",
					action: 'next'
				}
			],
			allowAutomaticOkay: false
		} )
		.next( '2' );

	tour
		.step( {
			name: '2',
			title: 'Know before you go',
			description:
        "<br><b>Don't [x] out</b><br> This box is  your tour guide: if you close it before completing a mission, you leave the tour and need to restart the mission from the beginning.<br><br><b>Automatic messages</b><br> When you take this tour, you send some messages to your personal MediaWiki pages, any time you see <big><b>*</b></big> in the blue button.<br><br><b>Source Editor</b><br> This tour uses only the Source Editor, not the Visual Editor.<br><br>",
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url: mw.util.getUrl( 'MediaWiki:TUT/1/Start' ) + '?tour=tut1&step=1'
				},
				{
					name: 'Yeah, understood',
					action: 'next'
				}
			],
			allowAutomaticOkay: false
		} )
		.next( '3' );

	tour
		.step( {
			name: '3',
			title: 'What is a user script?',
			description:
        '<div align="right">[[File:TUT nurturing yourself.png|120px|link=]]</div><br>A user script is a public JavaScript program that immediately changes the behavior of the software for a logged-in user. This program can be shared with other users and is located on wiki pages.<br><br>It provides a <b>personalized user experience of the MediaWiki software.</b> We can write user scripts either from scratch or by modifying an existing user script.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url: mw.util.getUrl( 'MediaWiki:TUT/1/Start' ) + '?tour=tut1&step=2'
				},
				{
					name: 'And gadgets?',
					action: 'next'
				}
			],
			allowAutomaticOkay: false
		} )
		.next( '4' );

	tour
		.step( {
			name: '4',
			title: 'Gadgets',
			description:
        '<div align="right">[[File:TUT nurturing yourself.png|120px|link=]]</div><br>A gadget is a user script that has been <b>promoted</b> by an <i>interface administrator.</i> Logged-in users can enable gadgets in the <b>Gadgets</b> tab of their user preferences.<br><br>That means once you write a user script, it can potentially be converted into a gadget by contacting an interface administrator.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url: mw.util.getUrl( 'MediaWiki:TUT/1/Start' ) + '?tour=tut1&step=3'
				},
				{
					name: 'Where is a user script written?',
					action: 'next'
				}
			],
			allowAutomaticOkay: false
		} )
		.next( '5' );

	tour
		.step( {
			name: '5',
			title: 'Please welcome common.js!',
			description:
        '<br><div align="left">[[File:TUT rocket.png|120px|link=]]</div><br>A user script comes to life after being written or loaded on <b>common.js.</b><br><br> Confused a bit? Not to worry. We’ll get to it soon.<br><br><br><b>A word of caution</b><br>User scripts enable a user account to do powerful things that it otherwise couldn’t. You are fully responsible for whatever the user script does on your behalf.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url: mw.util.getUrl( 'MediaWiki:TUT/1/Start' ) + '?tour=tut1&step=4'
				},
				{
					name: 'Hmm, alright',
					action: 'next'
				}
			],
			allowAutomaticOkay: false
		} )
		.next( '6' );

	tour.step( {
		name: '6',
		title: 'Login or create an account',
		description:
      '<br><div align="left">[[File:TUT rocket.png|120px|link=]]</div><br>Working with user scripts or gadgets requires you to login first.  Go for it.<br><br>',
		onShow: gt.parseDescription,
		overlay: true,
		closeOnClickOutside: false,
		buttons: [
			{
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'MediaWiki:TUT/1/Start' ) + '?tour=tut1&step=5'
			},
			{
				name: "I'm logged in",
				// action: 'externalLink',
				// url: mw.util.getUrl( 'MediaWiki:TUT/1/Start' ) + '?tour=tut1&step=7'
				action: 'okay',
				onclick: function () {
					if ( mw.config.get( 'wgUserName' ) === null ) {
						displayAlert();
						return;
					}
					window.location.href =
            mw.util.getUrl( 'MediaWiki:TUT/1/Start' ) + '?tour=tut1&step=7';
				},
				type: 'neutral'
			},
			{
				name: 'Register!',
				action: 'externalLink',
				url:
          mw.config.get( 'wgServer' ) +
          mw.config.get( 'wgScriptPath' ) +
          '/index.php?title=Special:UserLogin&returnto=MediaWiki:TUT/1/Start&returntoquery=tour%3Dtut1%26step%3D7%26showGettingStarted%3Dfalse&type=signup'
			},
			{
				name: 'I need to login',
				action: 'externalLink',
				url:
          mw.config.get( 'wgServer' ) +
          mw.config.get( 'wgScriptPath' ) +
          '/index.php?title=Special:UserLogin&returnto=MediaWiki:TUT/1/Start&returntoquery=tour%3Dtut1%26step%3D7'
			}
		],
		allowAutomaticOkay: false
	} );

	tour.step( {
		name: '7',
		title: "What's this common.js?",
		description:
      '<div align="right">[[File:TUT nurturing yourself.png|120px|link=]]</div><br>It’s <b>your personal JavaScript file,</b> located at User:' +
      mw.config.get( 'wgUserName' ) +
      '/common.js.<br><br>This file influences the interface and layout of a wiki for yourself only. It’s loaded regardless of which skin you are using.<br><br>',
		onShow: gt.parseDescription,
		overlay: false,
		closeOnClickOutside: false,
		buttons: [
			{
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'MediaWiki:TUT/1/Start' ) + '?tour=tut1&step=5'
			},
			{
				name: 'Say hello to your common.js*',
				onclick: function () {
					if ( !mw.config.get( 'wgUserName' ) ) {
						displayAlert();
						return;
					}
					sendMessage(
						'User talk:' + mw.config.get( 'wgUserName' ),
						'MediaWiki:TUT/Welcome',
						mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=8'
					);
				}
			}
		],
		allowAutomaticOkay: false
	} );

	tour.step( {
		name: '8',
		title: 'Your common.js',
		description:
      '<br><div align="left">[[File:TUT rocket.png|120px|link=]]</div><br>This is one of your special files. So now you know the place where you write or load your user scripts. <b>Although public, only you can edit it.</b><br><br>How about loading your very first user script?<br><br>',
		onShow: gt.parseDescription,
		overlay: false,
		closeOnClickOutside: false,
		buttons: [
			{
				name: '<big>←</big>',
				action: 'externalLink',
				url: mw.util.getUrl( 'MediaWiki:TUT/1/Start' ) + '?tour=tut1&step=7'
			},
			{
				name: "Let's do this",
				action: 'externalLink',
				url:
          mw.util.getUrl( 'MediaWiki:TUT/1/Userscript1' ) + '?tour=tut1&step=9'
			}
		],
		allowAutomaticOkay: false
	} );

	tour
		.step( {
			name: '9',
			title: 'Sneak Peek!',
			description: 'Have a look at the following user script and COPY ITS LOCATION.',
			attachTo: '#contentSub',
			position: 'bottom',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			allowAutomaticOkay: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=8'
				},
				{
					name: 'Done',
					action: 'next'
				}
			]
		} )
		.next( '10' );

	tour.step( {
		name: '10',
		title: "What's going on here?",
		description:
      '<br><div align="left">[[File:TUT rocket.png|120px|link=]]</div><br>Don\'t worry if you didn\'t understand every bit of information in this user script. For the time being, our main focus is to learn how to make the script come into effect.<br><br>Here\'s the script location in case you haven\'t copied:<br><br><small><b><nowiki>http://localhost:8080/w/index.php?title=MediaWiki:Zoom_Toggle.js</nowiki></b></small>',
		onShow: gt.parseDescription,
		overlay: true,
		closeOnClickOutside: false,
		buttons: [
			{
				name: '<big>←</big>',
				action: 'externalLink',
				url:
          mw.util.getUrl( 'MediaWiki:TUT/1/Userscript1' ) + '?tour=tut1&step=9'
			},
			{
				name: 'Copied',
				action: 'externalLink',
				url: mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=11'
			}
		],
		allowAutomaticOkay: false
	} );

	tour
		.step( {
			name: '11',
			title: 'Edit common.js',
			description:
        '<br>Edit this file to make your user script come to life.<br><br>Click <b>CREATE SOURCE</b> or <b>EDIT SOURCE</b> above.<br><br>(This tour always uses the SOURCE editor).<br><br>',
			attachTo: '#ca-edit',
			position: 'bottom',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			allowAutomaticOkay: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'MediaWiki:TUT/1/Userscript1' ) +
            '?tour=tut1&step=10'
				}
			]
		} )
		.transition( function () {
			if ( gt.hasQuery( { action: 'edit' } ) ) {
				return '12';
			}
		} );

	tour
		.step( {
			name: '12',
			title: "Let's load the user script",
			description:
        '<div align="right">[[File:TUT nurturing yourself.png|120px|link=]]</div><br>There are many ways to load a user script depending on whether it is on the same wiki or the other. We’ll use <code>mw.loader.load()</code> as it can load user script from other Wikimedia websites as well.<br><br>Type <b>mw.loader.load(<i>script_location</i>&action=raw&ctype=text/javascript)</b>.<br><br>DON\'T FORGET to replace <b>script_location</b> with the script location you copied.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '.editOptions',
			position: 'bottomRight',
			closeOnClickOutside: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=11'
				},
				{
					name: 'Typed it',
					action: 'next'
				}
			]
		} )
		.next( '13' );

	tour
		.step( {
			name: '13',
			title: 'Edit summary and Publish',
			description:
        "<br>That looks pretty cool! Before you click Publish, leave a brief note about the changes you made.<br><br>Click PUBLISH when you're ready.<br><br>",
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '#wpSave',
			position: 'bottomRight',
			closeOnClickOutside: false,
			allowAutomaticOkay: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage/common.js' ) +
            '?tour=tut1&step=12&action=edit'
				}
			],
			buttons: postEditButtons
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '14';
			}
		} );

	tour.step( {
		name: '14',
		title: 'Congrats!',
		description:
      'New badge earned: <b>SOLID START</b><div class="center">[[File:TUT badge 1.png|110px|link=]]</div><br>What a great start! You\'ve just loaded your first user script. How does it feel?<br>',
		overlay: true,
		onShow: gt.parseDescription,
		closeOnClickOutside: false,
		allowAutomaticOkay: false,
		buttons: [
			{
				name: '<big>←</big>',
				action: 'externalLink',
				url:
          mw.util.getUrl( 'Special:MyPage/common.js' ) +
          '?tour=tut1&step=13&action=edit'
			},
			{
				name: 'Thanks*',
				onclick: function () {
					if ( !mw.config.get( 'wgUserName' ) ) {
						displayAlert();
						return;
					}
					sendMessage(
						'User:' + mw.config.get( 'wgUserName' ),
						'MediaWiki:TUT/Badge/1template1',
						mw.util.getUrl( 'MediaWiki:TUT/1/Start' )
					);
				}
			}
		]
	} )
		.transition( function () {
			if ( mw.config.get( 'wgPageName' ) === 'MediaWiki:TUT/1/Start' ) {
				return '15';
			}
		} );

	tour
		.step( {
			name: '15',
			title: 'Play around',
			description: '<br><div align="left">[[File:TUT rocket.png|120px|link=]]</div><br>You could now see three magnifying glasses on top right. Play around with them.<br><br>In case you don’t see the icons, you may try <b>bypassing your cache.</b> Hold the <b>Shift</b> key and click the <i>Reload</i> button on the navigation toolbar.<br><br><br>When done, we’ll load another user script because it’s fun :)<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			allowAutomaticOkay: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=14'
				},
				{
					name: 'Continue',
					action: 'next'
				}
			]
		} )
		.next( '16' );

	tour
		.step( {
			name: '16',
			title: 'Invert',
			description: '<div align="right">[[File:TUT nurturing yourself.png|120px|link=]]</div><br>Our next user script allows us to invert the page color and the color of images on the current page.<br><br><br>COPY THE ENTIRE CODE from the script location:<br><small><b><nowiki>https://en.wikipedia.org/w/index.php?title=User:BrandonXLF/Invert.js</nowiki></b></small><br><br><br>Again, don\'t bother much if you can\'t understand every bit of it!<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			allowAutomaticOkay: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage' ) + '?tour=tut1&step=15'
				},
				{
					name: 'So far so good',
					action: 'next'
				}
			]
		} )
		.next( '17' );

	tour
		.step( {
			name: '17',
			title: 'Your user subpage',
			description: '<br>Let\'s try something different this time!<br><br>We shall create a subpage in our user namespace on <b>MediaWiki.org</b> to PASTE the user script.<br><br>Well, how about <b>User:' + mw.config.get( 'wgUserName' ) + '/invert.js ?</b><br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			allowAutomaticOkay: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage' ) + '?tour=tut1&step=16'
				},
				{
					name: 'Seems good',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage/invert.js' ) + '?tour=tut1&step=18'
				}
			]
		} );

	tour
		.step( {
			name: '18',
			title: 'Edit your subpage',
			description:
        '<br>Edit this file to paste the user script.<br><br>Click <b>CREATE SOURCE</b> or <b>EDIT SOURCE</b> above.<br><br>',
			attachTo: '#ca-edit',
			position: 'bottom',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			allowAutomaticOkay: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage' ) + '?tour=tut1&step=17'
				}
			]
		} )
		.transition( function () {
			if ( gt.hasQuery( { action: 'edit' } ) ) {
				return '19';
			}
		} );

	tour
		.step( {
			name: '19',
			title: 'Paste the script',
			description: '<br>PASTE the user script, you just copied, above.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '.editOptions',
			position: 'bottomRight',
			closeOnClickOutside: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage/invert.js' ) + '?tour=tut1&step=18'
				},
				{
					name: 'Pasted',
					action: 'next'
				}
			]
		} )
		.next( '20' );

	tour
		.step( {
			name: '20',
			title: 'Edit summary and Publish',
			description:
        "<br>Nice! Before you click Publish, leave a brief note about the changes you made.<br><br>Click PUBLISH when you're ready.<br><br>",
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '#wpSave',
			position: 'bottomRight',
			closeOnClickOutside: false,
			allowAutomaticOkay: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage/invert.js' ) +
            '?tour=tut1&step=19&action=edit'
				}
			],
			buttons: postEditButtons
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '21';
			}
		} );

	tour
		.step( {
			name: '21',
			title: 'What\'s next?',
			description: '<div align="right">[[File:TUT nurturing yourself.png|120px|link=]]</div><br>Do you think our task is over?<br>We haven\'t yet LOADED the user script in our common.js. So, it\'s time to copy the script location that we just created and head towards our common.js.<br><br>COPY the script URL:<br><small><b><nowiki>http://localhost:8080/w/index.php?title=User:' + mw.config.get( 'wgUserName' ) + '/invert.js</nowiki></b></small><br><br><b>P.S.</b>If you recall, we loaded our first script using a similar argument. That\'s how you create user scripts in your user subpage and share them with the community.<br><br>',
			onShow: gt.parseDescription,
			overlay: true,
			closeOnClickOutside: false,
			allowAutomaticOkay: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage/invert.js' ) + '?tour=tut1&step=20&action=edit'
				},
				{
					name: 'We are approaching the final steps',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=22'
				}
			]
		} );

	tour
		.step( {
			name: '22',
			title: 'Edit common.js',
			description:
        '<br>Edit common.js to make your user script come to life. Click <b>EDIT SOURCE</b> above.',
			attachTo: '#ca-edit',
			position: 'bottom',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			allowAutomaticOkay: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage/invert.js' ) + '?tour=tut1&step=21'
				}
			]
		} )
		.transition( function () {
			if ( gt.hasQuery( { action: 'edit' } ) ) {
				return '23';
			}
		} );

	tour
		.step( {
			name: '23',
			title: 'Load the user script',
			description:
        '<br><div align="left">[[File:TUT rocket.png|120px|link=]]</div><br>Do you remember which method would come handy here? Ofcourse you do :)<br><br><code>mw.loader.load()</code> is your friend. Type <b>mw.loader.load(<i>script_location</i>&action=raw&ctype=text/javascript)</b>.<br><br>DON\'T FORGET to replace <b>script_location</b> with the script location you copied.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '.editOptions',
			position: 'bottomRight',
			closeOnClickOutside: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=22'
				},
				{
					name: 'Loaded',
					action: 'next'
				}
			]
		} )
		.next( '24' );

	tour
		.step( {
			name: '24',
			title: 'Edit summary and Publish',
			description:
        "<br>Well done! Before you click Publish, leave a brief note about the changes you made.<br><br>Click PUBLISH when you're ready.<br><br>",
			onShow: gt.parseDescription,
			overlay: false,
			attachTo: '#wpSave',
			position: 'bottomRight',
			closeOnClickOutside: false,
			allowAutomaticOkay: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage/common.js' ) +
            '?tour=tut1&step=23&action=edit'
				}
			],
			buttons: postEditButtons
		} )
		.transition( function () {
			if ( gt.isPostEdit() ) {
				return '25';
			}
		} );

	tour
		.step( {
			name: '25',
			title: 'You are impressive!',
			description: '<br><div align="center">[[File:TUT fireworks small.png|100px|link=]]</div><br>Check out the <b>Invert</b> button on the top navigation panel. If it\'s not visible, consider bypassing the cache.<br><br>It\'s striking to see your pace of experiential learning! Keep up the good work.<br><br>',
			onShow: gt.parseDescription,
			overlay: false,
			closeOnClickOutside: false,
			allowAutomaticOkay: false,
			buttons: [
				{
					name: '<big>←</big>',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'Special:MyPage/common.js' ) + '?tour=tut1&step=24&action=edit'
				},
				{
					name: 'Where to go next?',
					action: 'externalLink',
					url:
            mw.util.getUrl( 'MediaWiki:TUT/1/End' ) + '?tour=tut1&step=26'
				}
			]
		} );

	tour.step( {
		name: '26',
		title: 'Mission 1 complete!',
		description: '<br>This concludes <b>Mission 1:</b> Let\'s get started.<br><br>You\'re all set for your journey on <b>Mission 2:</b> Developing with ResourceLoader<br><br>',
		onShow: gt.parseDescription,
		overlay: true,
		closeOnClickOutside: false,
		buttons: [ {
			name: 'Congrats me!',
			action: 'end'
		} ]
	} );

}( window, document, jQuery, mediaWiki, mediaWiki.guidedTour ) );
