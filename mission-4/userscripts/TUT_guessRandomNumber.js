// Load the required module - oojs-ui-core before the code runs.
$.when( mw.loader.using( [ 'oojs-ui-core' ] ), $.ready ).then( function () {

	// Generate a random number between 1 and 100 (1 and 100 included).
	var randomNumber = Math.floor( Math.random() * 100 ) + 1;
	// Variables to keep track of previous guesses and the number of guesses made so far.
	var previousGuesses,
		guessCount = 1;

	/*
     * A custom widget is made which provides everything we need to build our tiny
     * random number guessing game. It includes following:
     * (i) A message widget to display status of ongoing game i.e. whether the user
     * has won, has lost, or the guess is smaller/larger than actual random number.
     *
     * (ii) A label widget to display the previous made guesses.
     *
     * (iii) An text input widget to input the guess.
     *
     * (iv) A submit button to check whether whether the guess is correct or not (can
     * also be checked by pressing enter inside the input field).
     *
     * (v) It embeds the styling of all the above elements in the same custom widget.
     * However, ideally styling should be defined in the css/less file for consistency
     * and easy modifications.
     */
	var RandomNumberWidget = function ( config ) {
		config = config || {};

		RandomNumberWidget.parent.call( this, config );

		this.status = new OO.ui.MessageWidget( {
			type: 'notice',
			label: 'Guess a random number between 1 and 100. You\'ve got 10 chances.',
			inline: true
		} );

		this.previous = new OO.ui.LabelWidget();

		this.input = new OO.ui.TextInputWidget( {
			placeholder: 'Enter your guess...'
		} );

		this.button = new OO.ui.ButtonWidget( {
			label: 'Submit',
			flags: [ 'primary', 'progressive' ]
		} );

		this.input.connect( this, { enter: 'onBtnClick' } );
		this.button.connect( this, { click: 'onBtnClick' } );

		this.$element
			.append(
				this.status.$element.css( {
					marginBottom: '10px'
				} ),
				this.previous.$element.css( {
					marginBottom: '10px'
				} ),
				this.input.$element.css( {
					width: '80%',
					display: 'inline-block'
				} ),
				this.button.$element
			)
			.css( { marginBottom: '40px', width: '60%' } )
			.addClass( 'guessRandomNumberWidget' );
	};

	// Extending the base widget provided by OOUI i.e., OO.ui.Widget
	OO.inheritClass( RandomNumberWidget, OO.ui.Widget );

	// Defines the behaviour of the custom widget on pressing enter or clicking the submit button
	RandomNumberWidget.prototype.onBtnClick = function () {

		// This ensures that the input value is valid i.e. only numbers are allowed
		// and any other value is discarded with notification shown to the user.
		// NOTE: The invalid step is not counted in the maximum of 10 chances given.
		var inputValue = this.input.getValue();
		var regex = /^[0-9]+$/;

		if ( !inputValue.match( regex ) ) {
			mw.notify( 'You can input only numbers', { type: 'warn' } );
			this.input.setValue( '' );
			return;
		}

		var userGuess = Number( inputValue );

		if ( guessCount === 1 ) {
			previousGuesses = 'Previous guesses: ';
			this.previous.setLabel( previousGuesses );
		}

		previousGuesses += userGuess + ' ';

		// It defines what to do when a number is entered. If the value is equal
		// to the random number or the number of chances are exhausted, the game ends.
		// otherwise, the user is told whether his value is less than or greater than
		// the actual random value.
		if ( userGuess === randomNumber ) {
			this.setLabels( 'You have won!', userGuess );
			mw.notify( 'You have won!', { type: 'success' } );
			this.setGameOver();
		} else if ( guessCount === 10 ) {
			this.setLabels( 'Game over!', previousGuesses );
			mw.notify( 'Game over!', { type: 'error' } );
			this.setGameOver();
		} else {
			if ( userGuess < randomNumber ) {
				this.setLabels( 'Last guess was too low!',
					previousGuesses );
			} else if ( userGuess > randomNumber ) {
				this.setLabels( 'Last guess was too high!',
					previousGuesses );
			}
		}

		// Increments the count of attempts made and input field is cleared
		guessCount++;
		this.input.setValue( '' );
	};

	// Once the game is over, the input field and the submit button are disabled
	// so that the next game can be started.
	RandomNumberWidget.prototype.setGameOver = function () {
		this.input.setDisabled( true );
		this.button.setDisabled( true );
	};

	// It shows the relevant messages i.e. the present game status and the previous
	// suesses to the user.
	RandomNumberWidget.prototype.setLabels = function ( statusLabel, prevGuessLabel ) {
		var value =
            statusLabel === 'You have won!' ?
            	'The random number is ' + prevGuessLabel :
            	prevGuessLabel;

		if ( statusLabel === 'You have won!' ) {
			this.status.setType( 'success' );
		} else if ( statusLabel === 'Game over!' ) {
			this.status.setType( 'error' );
		}

		this.status.setLabel( statusLabel );
		this.previous.setLabel( value );
	};

	// Creates a new custom widget object
	var randNumGameWidget = new RandomNumberWidget();

	// Appends the custom widget to the content section
	$( '#mw-content-text' ).prepend( randNumGameWidget.$element );
} );
