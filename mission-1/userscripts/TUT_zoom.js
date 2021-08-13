$( function () {
	// Loads the dependencies for using the OOUI buttons (To be discussed later).
	mw.loader.using( [ 'oojs-ui-core', 'oojs-ui.styles.icons-media' ] ).done( function () {

		// Creates the zoom-in button.
		var zoomIn = new OO.ui.ButtonWidget( {
				icon: 'zoomIn',
				title: 'zoomin'
			} ),
			// Creates the zoom-out button.
			zoomOut = new OO.ui.ButtonWidget( {
				icon: 'zoomOut',
				title: 'zoomout'
			} ),
			// Finds the DOM element. To be used later.
			$bodyContent = $( '.mw-body-content' ),
			// Computes the default font size.
			size = parseFloat( $( '.mw-body-content' ).css( 'font-size' ) );

		/**
		 * Update the font-size.
		 *
		 * Changes the font-size of the displayed page.
		 */
		function updateSize() {
			$bodyContent.css( { 'font-size': size + 'pt' } );
		}

		/**
		 * Updates the font-size by 1pt.
		 *
		 * It updates the font-size by 1pt. If zoom-in button is clicked, it increases the font-size by
		 * 1pt and vice-versa.
		 *
		 * @param {number} dif Amount by which to zoom in or zoom out.
		 */
		function zoom( dif ) {
			size += dif;
			updateSize();
		}

		// The following adds event listeners on zoom buttons. When they are clicked, the font
		// size of the displayed page changes accordingly.
		zoomIn.on( 'click', function () {
			zoom( 1 );
		} );

		zoomOut.on( 'click', function () {
			zoom( -1 );
		} );

		// Creates the DOM element for the zoom-in and zoom-out buttons.
		$( '#firstHeading' ).append( '<div id="zoomButtons"></div>' );
		$( '#zoomButtons' ).append( zoomIn.$element, zoomOut.$element );
		$( '#zoomButtons' ).css( { fontSize: '0.5em', float: 'right' } );

	} );
} );