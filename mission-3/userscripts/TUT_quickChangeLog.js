/**
 * Quick Recent Changes or Changelog
 *
 * A user script which adds a "Quick Changelog" link to the page skin's toolbox,
 * and when clicked it pops up a dialog with up to 25 recent edits.
 *
 * Demonstrates:
 * - Use of jQuery
 * - Use of the MediaWiki Action API
 * - Use of ResourceLoader and some of the default modules that come with it
 *
 * Original user script: https://www.mediawiki.org/w/index.php?title=MediaWiki:Tutorial-QuickRC.js
 *
 * Modifications done: Replaced the jQuery API call with MediaWiki Action API call. Did some
 * formatting in jQuery dialog.
 */

// Import the required modules at the beginning of the script.
mw.loader.using( [ 'mediawiki.util', 'mediawiki.api', 'jquery.ui' ] ).done( function () {

	// Defines the jQuery dialog and sets up the content in formatted manner.
	function renderQuickRCDialog( pageLinks ) {
		$( '<div>' )
			.html(
				'<strong>' +
                '<br>Welcome, ' + mw.user.getName() +
                '</strong>' +
                '! The following pages have been recently modified:' +
                '<br><br><ul><li>' +
                pageLinks.join( '<br /><li>' ) + '</ul>'
			)
			.dialog( {
				autoOpen: true,
				title: 'Hello there',
				width: '55%',
				modal: true,
				zIndex: 100000010
			} );
	}

	// Defines the behaviour to pop up a dialog when the "Quick ChangeLog" link is clicked,
	// showing a maximum of 25 recent changes.
	function quickRC() {
		var myPageLinks = [];
		var myTitles = [];
		var api = new mw.Api();

		// Makes a GET request to fetch a maximum of 25 recent changes on the entire wiki.
		api
			.get( {
				action: 'query',
				list: 'recentchanges',
				rclimit: 25,
				format: 'json'
			} )
			.done( function ( data ) {
				var recentChanges = data.query.recentchanges;

				// Build a unique array of links, using the mw.html library to format them.
				$.each( recentChanges, function ( index, rc ) {

					// Don't link to this title if we've seen this title already.
					if ( $.inArray( rc.title, myTitles ) === -1 ) {
						myPageLinks.push(
							mw.html.element(
								'a', { href: mw.util.getUrl( rc.title ) }, rc.title
							)
						);
					}
					myTitles.push( rc.title );
				} );

				renderQuickRCDialog( myPageLinks );
			} );
	}

	// Adds a link to the portlet area once the page is completely loaded.
	$( function () {

		// Add a link to the toolbox section.
		var link = mw.util.addPortletLink(
			'p-tb',
			'#',
			'QUICK CHANGELOG',
			't-prettylinkwidget',
			'Show a list of recent changes',
			'/',
			'#t-whatlinkshere'
		);

		// Create a jQuery object for this link so that we get to use jQuery awesomeness
		// like .click() for binding functions to events and methods like e.preventDefault().
		$( link ).on( 'click', function ( e ) {
			// Avoid the browser going to '#'.
			e.preventDefault();

			// Initiate quickRC
			quickRC();
		} );

	} );

} );
