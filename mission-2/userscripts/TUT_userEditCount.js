// Waits for the page to completely load.
$( function () {
	// Uses the base module: mediawiki which exposes the global variable 'mw'. Various configuration
	// values can be accessed using mw.config.
	// editCount stores the number of edits made by the logged-in user on the current wiki.
	var editCount = mw.config.get( 'wgUserEditCount' );

	// Appends the number of edits to the username of the logged-in user.
	$( '#pt-userpage' ).append( ' (' + editCount + ')' );
} );
