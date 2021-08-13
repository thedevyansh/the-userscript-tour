// The required module - oojs-ui-core is loaded before the code runs.
// oojs-ui-core: OOUI's core JavaScript library. Contains the basic widgets and layouts.
$.when( mw.loader.using( [ 'oojs-ui-core' ] ), $.ready ).then( function () {

	// Creating a widget involves two basic steps:
	// 1. The widget is created and configured.
	// 2. The widget is added to the DOM.

	// The ButtonWidget is instantiated and configured using the configuration object:
	// label: The label of the button.
	// icon: The icon to be shown inside the button.
	// id: ID of the button when it is displayed in DOM.
	var button = new OO.ui.ButtonWidget( {
		label: 'Click me',
		icon: 'alert',
		id: [ 'tut-ooui-alert' ]
	} );

	// Connecting the 'click' event listener to the button widget.
	button.on( 'click', function () {
		// This function runs when the button is clicked.
		// OO.ui.alert displays a quick modal alert dialog.
		OO.ui.alert( 'I am learning OOUI as part of The Userscript Tour.' );
	} );

	// The button is added to the DOM (in the toolbox section of the Portlet area).
	$( '#p-tb' ).append( button.$element );
} );
