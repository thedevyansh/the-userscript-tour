// The script runs after the mediawiki.api module and wiki page are completely loaded.
$.when( mw.loader.using( [ 'mediawiki.api' ] ), $.ready ).then( function () {
	// Instantiates the mw.Api object.
	var api = new mw.Api();

	// The parameter object is defined to send the GET request to the API. The GET request fetches
	// the basic information of a wiki page.

	// 1. action is a parameter of main module. It specifies which action to perform.
	// 2. query is another module. It requests the API to fetch data from and about MediaWiki.
	// 3. prop is a parameter of query module. It specifies which properties to get for the queried pages.
	// 4. titles is a parameter of query module. It specifies a list of titles to work on.
	// 5. format is a parameter of the main module. It specifies the format of the output.
	var params = {
		action: 'query',
		prop: 'info',
		titles: mw.config.get( 'wgPageName' ),
		format: 'json'
	};

	// Send the GET request with the modules and paramters defined in "params".
	api
		.get( params )
		.done( function ( response ) {
			var pages = response.query.pages;

			for ( var p in pages ) {
                // Checks if the title is present in the API response, as on many wiki pages
                // (for example, Recent changes page), title property is undefined.
				if ( pages[ p ].length !== undefined ) {
					var text = '<p id="byte-count">[ NUMBER OF BYTES ON THIS PAGE: ' + pages[ p ].length + ' ]</p>';

					// Prepends the count of bytes on the top of the wiki page.
					$( '#mw-content-text' ).prepend( text );

					// Add styling to the <p> tag we just created by grabbing its ID.
					$( '#byte-count' ).css( {
						textAlign: 'center',
						color: '#4743A9',
						fontWeight: 'bold',
						marginBottom: '1.5em'
					} );
				}
			}
		} );
} );
