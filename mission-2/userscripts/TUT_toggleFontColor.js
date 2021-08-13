// Loads the module: mediawiki.util
$.when( mw.loader.using( [ 'mediawiki.util' ] ), $.ready ).then( function () {

	// Adds a <style> element to the HEAD and returns the CSSStyleSheet object.
	var myCssRules = mw.util.addCSS( '#content { color: #EB5160; }' );
	myCssRules.disabled = true;

	// Add a link for toggling font-color to the Personal area, on the left of "Log out" link.
	var link = mw.util.addPortletLink(
		// portletId
		'p-personal',
		// href
		'#',
		// text
		'Toggle color',
		// id (Optional)
		't-toggleFontColor',
		// tooltip (Optional)
		'Toggle the font color of content',
		// accesskey (Optional)
		'/',
		// nextnode (Optional)
		'#pt-logout'
	);

	// Create a jQuery object for this link so that we get
	// to use jQuery awesomeness like .click() for binding functions to events
	// and methods like e.preventDefault();
	$( link ).on( 'click', function ( e ) {
		// Avoid the browser going to '#'
		e.preventDefault();

		myCssRules.disabled = !myCssRules.disabled;
	} );

} );
