( function ( $ ) {
	'use strict';

	module( 'jquery.i18n - $.fn.i18n Tests', {
		setup: function () {
			$.i18n( {
				locale: 'localex'
			} );
		},
		teardown: function () {
			$.i18n().destroy();
		}
	} );

	test( 'Message parse tests', 1, function ( assert ) {
		var i18n = $( document ).data( 'i18n' ),
			$fixture = $( '#qunit-fixture' );
		// Load messages for localex
		i18n.load( {
			'x': 'X'
		}, 'localex' );
		$fixture.data( 'i18n', 'x' );
		assert.strictEqual( $fixture.i18n().text(), 'X', 'Content of fixture localized' );
	} );

	QUnit.module( 'jquery.i18n', {
		setup: function () {
			$.i18n( {
				locale: 'en'
			} );
		},
		teardown: function () {
			$.i18n().destroy();
		}
	} );

	QUnit.test( 'Message parse tests (en)', 14, function ( assert ) {
		var pluralAndGenderMessage,
			pluralAndGenderMessageWithLessParaMS,
			pluralAndGenderMessageWithCase,
			pluralAndGenderMessageWithSyntaxError,
			pluralAndGenderMessageWithSyntaxError2,
			i18n = $( document ).data( 'i18n' );

		QUnit.stop();
		$.when(
			i18n.load( 'i18n/test-en.json', 'en' )
		).then( function () {
			QUnit.start();
			assert.strictEqual( i18n.locale, 'en', 'Locale is English' );
			assert.strictEqual( $.i18n( 'message_1' ), 'ONE', 'Simple message' );
		} );
		assert.strictEqual(
			$.i18n( 'This message key does not exist' ),
			'This message key does not exist',
			'This message key does not exist'
		);
		assert.strictEqual( $.i18n( 'Hello $1', 'Bob' ), 'Hello Bob', 'Parameter replacement' );
		pluralAndGenderMessage = '$1 has $2 {{plural:$2|kitten|kittens}}. ' +
			'{{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.';
		pluralAndGenderMessageWithLessParaMS = '$1 has $2 {{plural:$2|kitten}}. ' +
			'{{gender:$3|He|She}} loves to play with {{plural:$2|it}}.';
		pluralAndGenderMessageWithCase = '$1 has $2 {{plURAl:$2|kitten}}. ' +
			'{{genDER:$3|He|She}} loves to play with {{pLural:$2|it}}.';
		pluralAndGenderMessageWithSyntaxError = '$1 has $2 {{plural:$2|kitten}. ' +
			'{{gender:$3|He|She}} loves to play with {plural:$2|it}}.';
		pluralAndGenderMessageWithSyntaxError2 = '$1 has $2 {{plural:$2|kitten}}. ' +
			'{gender:$3|He|She}} loves to play with {plural:$2|it}}.';
		assert.strictEqual(
			$.i18n( pluralAndGenderMessage, 'Meera', 1, 'female' ),
			'Meera has 1 kitten. She loves to play with it.',
			'Plural and gender test - female, singular'
		);
		assert.throws(
			function () {
				$.i18n( pluralAndGenderMessageWithSyntaxError, 'Meera', 1, 'female' );
			},
			/Parse error at position 10/,
			'Message has syntax error'
		);
		assert.throws(
			function () {
				$.i18n( pluralAndGenderMessageWithSyntaxError2, 'Meera', 1, 'female' );
			},
			/Parse error at position 32/,
			'Message has syntax error'
		);
		assert.strictEqual(
			$.i18n( pluralAndGenderMessageWithLessParaMS, 'Meera', 1, 'female' ),
			'Meera has 1 kitten. She loves to play with it.',
			'Plural and gender test - female, singular, but will less parameters in message'
		);
		assert.strictEqual(
			$.i18n( pluralAndGenderMessageWithCase, 'Meera', 1, 'female' ),
			'Meera has 1 kitten. She loves to play with it.',
			'Plural and gender test - female, singular. Plural, gender keywords with upper and lower case'
		);
		assert.strictEqual(
			$.i18n( pluralAndGenderMessage, 'Meera', 1, 'randomtext' ),
			'Meera has 1 kitten. He loves to play with it.',
			'Plural and gender test - wrong gender- fallback to fist gender'
		);
		assert.strictEqual(
			$.i18n( pluralAndGenderMessage ),
			'$1 has $2 kittens. He loves to play with them.',
			'Plural and gender test - no params passed. Should not fail'
		);
		assert.strictEqual(
			$.i18n( pluralAndGenderMessage,'Meera', 1, 'randomtext', 'extraparam' ),
			'Meera has 1 kitten. He loves to play with it.',
			'Plural and gender test - more params passed. Should not fail'
		);
		assert.strictEqual(
			$.i18n( pluralAndGenderMessage, 'Harry', 2, 'male' ),
			'Harry has 2 kittens. He loves to play with them.',
			'Plural and gender test - male, plural'
		);
		assert.strictEqual(
			$.i18n( 'This costs $1.' ),
			'This costs $1.',
			'No parameter supplied, $1 appears as is'
		);

	} );

	$.when(
		$.i18n().load( 'i18n/test-ml.json', 'ml' )
	).then( function () {
		QUnit.start();
		QUnit.test( 'Message parse tests (ml, fr)', 8, function ( assert ) {
			var i18n = $( document ).data( 'i18n' ),
				pluralAndGenderMessage;
		$.i18n( {
			locale: 'ml'
		} );
		assert.strictEqual( i18n.locale, 'ml', 'Locale is Malayalam' );
		assert.strictEqual( $.i18n( 'message_1' ), '???????????????', 'Simple message' );
		assert.strictEqual( $.i18n( 'This message key does not exist' ),
				'This message key does not exist', 'This message key does not exist' );
		assert.strictEqual( $.i18n( 'Hello $1', 'Bob' ), 'Hello Bob', 'Parameter replacement' );
		pluralAndGenderMessage = '$1 has $2 {{plural:$2|kitten|kittens}}. ' +
			'{{gender:$3|He|She}} loves to play with {{plural:$2|it|them}}.';
		assert.strictEqual( $.i18n( pluralAndGenderMessage, '?????????', 1, 'female' ),
				'?????????????????????????????? ????????? ??????????????????????????????????????? ??????????????????. ????????? ????????????????????? ???????????????????????? ??????????????????????????????????????????.',
				'Plural and gender test - female, singular' );
		assert.strictEqual( $.i18n( pluralAndGenderMessage, '????????????', 2, 'male' ),
				'????????????????????????????????? 2 ????????????????????????????????????????????? ??????????????????. ????????? ???????????????????????????????????? ???????????????????????? ??????????????????????????????????????????.',
				'Plural and gender test - male, plural' );
		i18n.locale = 'fr';
		assert.strictEqual( $.i18n( 'Restaurer $1 modification{{PLURAL:$1||s}}', 1 ),
				'Restaurer 1 modification', 'Plural rule parsed correctly for French' );
		assert.strictEqual( $.i18n( 'Restaurer $1 modification{{PLURAL:$1||s}}', 2 ),
				'Restaurer 2 modifications', 'Plural rule parsed correctly for French' );
		} );
	} );

	QUnit.test( 'Message load tests', 13, function ( assert ) {
		$.i18n();
		var i18n = $( document ).data( 'i18n' );
		assert.strictEqual( i18n.locale, 'en', 'Locale is English - fallback locale' );

		i18n.locale = 'localex';
		assert.strictEqual( i18n.locale, 'localex', 'Locale is localex' );

		// Load messages for localez
		i18n.load( {
			'x': 'X'
		}, 'localex' );
		assert.strictEqual(
			$.i18n( 'x' ),
			'X',
			'Message loaded for localex, message key "x" is present'
		);

		// Load messages for two locales - localey and localez
		i18n.load( {
			'localey': {
				'y': 'Y'
			},
			'localez': {
				'z': 'Z'
			}
		} );
		i18n.load( {
			'localey': {
				'y1': 'Y1'
			}
		} );

		// Switch to locale localey
		i18n.locale = 'localey';
		assert.strictEqual( i18n.locale, 'localey', 'Locale switched to localey' );
		assert.strictEqual(
			$.i18n( 'y1' ),
			'Y1',
			'Message loaded for localey, message key "y1" is present'
		);
		assert.strictEqual(
			$.i18n( 'y' ),
			'Y',
			'Message loaded for localey, message key "y" is still present, not overwritten by second message load.'
		);

		// Switch back to locale localex
		i18n.locale = 'localex';
		assert.strictEqual( i18n.locale, 'localex', 'Going back-Locale is localex' );
		assert.strictEqual( $.i18n( 'x' ), 'X', 'Messages are not lost for localex' );

		// Switch to locale localez
		i18n.locale = 'localez';
		assert.strictEqual( i18n.locale, 'localez', 'Locale is localez' );
		assert.strictEqual(
			$.i18n( 'z' ),
			'Z',
			'Message loaded for localez, message key "z" is present'
		);

		// Load messages for en - with and without country code
		i18n.load( {
			'en-US': {
				'english-us': 'English-US'
			},
			'en': {
				'english': 'English'
			}
		} );
		i18n.locale = 'en-US';
		assert.strictEqual( i18n.locale, 'en-US', 'Locale is en-US' );
		assert.strictEqual(
			$.i18n( 'english-us' ),
			'English-US',
			'Message loaded for en-US, message key "english-us" is present'
		);
		assert.strictEqual(
			$.i18n( 'english' ),
			'English',
			'Message was resolved from en even though current locale is en-US'
		);
	} );

	module( 'jquery.i18n - Fallback test', {
		setup: function () {
			$.i18n().destroy();
			$.i18n();
		},
		teardown: function () {
			$.i18n().destroy();
		}
	} );

	test( 'Locale Fallback test', 7, function ( assert ) {
		var i18n = $( document ).data( 'i18n' );
		i18n.locale = 'sa';
		i18n.load( {
			'hindi': '??????????????????'
		}, 'hi' );
		i18n.load( {
			'this-does-not-exist': 'This does not exist'
		}, 'en' );
		assert.strictEqual( i18n.locale, 'sa', 'Locale is Sanskrit' );
		assert.strictEqual( $.i18n( 'hindi' ), '??????????????????', 'Message got from fallback locale - Hindi' );
		assert.strictEqual( $.i18n( 'this-does-not-exist' ), 'This does not exist', 'Message got from fallback locale - English' );
		i18n.locale = 'tt-cyrl';
		i18n.load( {
			'tt': 'russian-tt'
		}, 'ru' );
		assert.strictEqual( i18n.locale, 'tt-cyrl', 'Locale is tt-cyrl' );
		assert.strictEqual( $.i18n( 'tt' ), 'russian-tt',
				'Message is from fallback locale - Russian' );
		i18n.locale = 'tt';
		assert.strictEqual( $.i18n().locale, 'tt', 'Locale is tt' );
		assert.strictEqual( $.i18n( 'tt' ), 'russian-tt',
				'Message is from fallback locale - Russian' );
	} );

	QUnit.test( 'Message parse plural tests for Arabic', 17, function ( assert ) {
		$.i18n();
		var i18n = $( document ).data( 'i18n' );
		// Switch to locale locally
		i18n.locale = 'ar';
		assert.strictEqual( i18n.locale, 'ar', 'Locale is Arabic' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 1 ), 'one',
				'Arabic plural test for one' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', '??' ), 'zero',
				'Arabic plural test for arabic digit zero' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 2 ), 'two',
				'Arabic plural test for two' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 3 ), 'few',
				'Arabic plural test for few' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', '??' ), 'few',
				'Arabic plural test for few' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 9 ), 'few',
				'Arabic plural test for few' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 110 ), 'few',
				'Arabic plural test for few' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 11 ), 'many',
				'Arabic plural test for many' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 15 ), 'many',
				'Arabic plural test for many' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 99 ), 'many',
				'Arabic plural test for many' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 9999 ), 'many',
				'Arabic plural test for many' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 100 ), 'other',
				'Arabic plural test for other' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 102 ), 'other',
				'Arabic plural test for other' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 1000 ), 'other',
				'Arabic plural test for other' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', 1.7 ), 'one',
				'Arabic decimal plural test for one' );
		assert.strictEqual( $.i18n( '{{plural:$1|zero|one|two|few|many|other}}', '????????????????????' ), 'many',
				'Arabic plural test for ????????????????????' );
	} );

	QUnit.test( 'Test explicit plural forms', 4, function ( assert ) {
		$.i18n();
		assert.strictEqual( $.i18n.languages['default'].convertPlural( 0, [ '0=Explicit Zero', 'Singular', 'Plural'] ),
			'Explicit Zero', 'Explicit Zero' );

		assert.strictEqual( $.i18n.languages['default'].convertPlural( 1, ['0=Explicit Zero', 'Singular', 'Plural', '1=Explicit One'] ),
			'Explicit One', 'Explicit One' );

		assert.strictEqual( $.i18n.languages['default'].convertPlural( 1, ['0=Explicit Zero', 'Singular', 'Plural'] ),
			'Singular', 'Singular' );

		assert.strictEqual( $.i18n.languages['default'].convertPlural( 3, ['0=Explicit Zero', '1=Explicit One', 'Singular', 'Plural'] ),
			'Plural', 'Plural' );

	} );

	QUnit.test( 'Digit transform table tests', 4, function ( assert ) {
		$.i18n();
		var i18n = $( document ).data( 'i18n' );
		// Switch to locale locally
		i18n.locale = 'fa';
		assert.strictEqual( $.i18n.parser.language.convertNumber( '8' ), '??',
				'Persian transform of 8' );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '8', true ), 8,
				'Persian transform of 8' );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '0123456789' ), '????????????????????',
				'Persian transform of 0123456789' );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '????????????????????', true ), 123456789,
				'Persian transform of 0123456789' );
	} );

	QUnit.test( 'Digit transform table tests', 4, function ( assert ) {
		$.i18n();
		var i18n = $( document ).data( 'i18n' );
		// Switch to locale locally
		i18n.locale = 'ar';
		assert.strictEqual( $.i18n.parser.language.convertNumber( '8' ), '??',
				'Arabic transform of 8' );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '8', true ), 8,
				'Arabic transform of 8' );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '0123456789' ), '????????????????????',
				'Arabic transform of 0123456789' );
		assert.strictEqual( $.i18n.parser.language.convertNumber( '????????????????????', true ), 123456789,
				'Arabic transform of 0123456789' );
	} );

	QUnit.test( 'Support fallback loading from folder tests', 2, function ( assert ) {
		var i18n = $( document ).data( 'i18n' );

		QUnit.stop();
		$.when(
				i18n.load( 'i18n/fallback', 'uk' )
			).then( function () {
				QUnit.start();
				i18n.locale = 'uk';
				assert.strictEqual( i18n.locale, 'uk', 'Locale is uk' );
				assert.strictEqual( $.i18n( 'message_1' ), 'ONE',
					'Message loaded from fallback locale English' );
			} );
	} );

	function grammarTest ( langCode, test ) {
		QUnit.test( 'Grammar test for language ' + langCode, function ( assert ) {
			QUnit.expect( test.length + 1 );
			var i, grammarMessage,
				i18n = $.i18n( {
				locale: langCode
			} );
			assert.strictEqual( i18n.locale, langCode, 'Locale is ' + langCode );
			for ( i = 0; i < test.length; i++ ) {
				grammarMessage = '{{GRAMMAR:' + test[i].grammarForm + '|' +
					test[i].word + '}}';
				assert.equal( i18n.parse( grammarMessage ), test[i].expected,
						test[i].description );
			}
		} );
	}

	var grammarTests = {
		bs: [ {
			word: 'word',
			grammarForm: 'instrumental',
			expected: 's word',
			description: 'Grammar test for instrumental case'
		}, {
			word: 'word',
			grammarForm: 'lokativ',
			expected: 'o word',
			description: 'Grammar test for lokativ case'
		} ],

		dsb: [ {
			word: 'word',
			grammarForm: 'instrumental',
			expected: 'z word',
			description: 'Grammar test for instrumental case'
		}, {
			word: 'word',
			grammarForm: 'lokatiw',
			expected: 'wo word',
			description: 'Grammar test for lokatiw case'
		} ],

		fi: [ {
			word: 'talo',
			grammarForm: 'genitive',
			expected: 'talon',
			description: 'Grammar test for genitive case'
		}, {
			word: 'linux',
			grammarForm: 'genitive',
			expected: 'linuxin',
			description: 'Grammar test for genitive case'
		}, {
			word: 'talo',
			grammarForm: 'elative',
			expected: 'talosta',
			description: 'Grammar test for elative case'
		}, {
			word: 'past??roitu',
			grammarForm: 'partitive',
			expected: 'past??roitua',
			description: 'Grammar test for partitive case'
		}, {
			word: 'talo',
			grammarForm: 'partitive',
			expected: 'taloa',
			description: 'Grammar test for partitive case'
		}, {
			word: 'talo',
			grammarForm: 'illative',
			expected: 'taloon',
			description: 'Grammar test for illative case'
		}, {
			word: 'linux',
			grammarForm: 'inessive',
			expected: 'linuxissa',
			description: 'Grammar test for inessive case'
		} ],

		ga: [ {
			word: 'an Domhnach',
			grammarForm: 'ainmlae',
			expected: 'D?? Domhnaigh',
			description: 'Grammar test for ainmlae case'
		}, {
			word: 'an Luan',
			grammarForm: 'ainmlae',
			expected: 'D?? Luain',
			description: 'Grammar test for ainmlae case'
		}, {
			word: 'an Satharn',
			grammarForm: 'ainmlae',
			expected: 'D?? Sathairn',
			description: 'Grammar test for ainmlae case'
		} ],

		he: [ {
			word: '????????????????',
			grammarForm: 'prefixed',
			expected: '??????????????????',
			description: 'Duplicate the "Waw" if prefixed'
		}, {
			word: '??????????????',
			grammarForm: 'prefixed',
			expected: '??????????????',
			description: 'Duplicate the "Waw" if prefixed, but not if it is already duplicated.'
		}, {
			word: '??????????',
			grammarForm: 'prefixed',
			expected: '????????',
			description: 'Remove the "He" if prefixed'
		}, {
			word: 'Wikipedia',
			grammarForm: '????????????',
			expected: '??Wikipedia',
			description: 'Add a hyphen (maqaf) before non-Hebrew letters'
		}, {
			word: '1995',
			grammarForm: '????????????',
			expected: '??1995',
			description: 'Add a hyphen (maqaf) before numbers'
		} ],

		hsb: [ {
			word: 'word',
			grammarForm: 'instrumental',
			expected: 'z word',
			description: 'Grammar test for instrumental case'
		}, {
			word: 'word',
			grammarForm: 'lokatiw',
			expected: 'wo word',
			description: 'Grammar test for lokatiw case'
		} ],

		hu: [ {
			word: 'Wikip??di??',
			grammarForm: 'rol',
			expected: 'Wikip??di??r??l',
			description: 'Grammar test for rol case'
		}, {
			word: 'Wikip??di??',
			grammarForm: 'ba',
			expected: 'Wikip??di??ba',
			description: 'Grammar test for ba case'
		}, {
			word: 'Wikip??di??',
			grammarForm: 'k',
			expected: 'Wikip??di??k',
			description: 'Grammar test for k case'
		} ],

		hy: [ {
			word: '????????????',
			grammarForm: 'genitive',
			expected: '????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '????????',
			grammarForm: 'genitive',
			expected: '????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '????????',
			grammarForm: 'genitive',
			expected: '????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '????????????????',
			grammarForm: 'genitive',
			expected: '??????????????????',
			description: 'Grammar test for genitive case'
		} ],

		la: [ {
			word: 'Translatio',
			grammarForm: 'genitive',
			expected: 'Translationis',
			description: 'Grammar test for genitive case'
		}, {
			word: 'Translatio',
			grammarForm: 'accusative',
			expected: 'Translationem',
			description: 'Grammar test for accusative case'
		}, {
			word: 'Translatio',
			grammarForm: 'ablative',
			expected: 'Translatione',
			description: 'Grammar test for ablative case'
		} ],

		os: [ {
			word: '??????????',
			grammarForm: 'genitive',
			expected: '??????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '??????????',
			grammarForm: 'allative',
			expected: '????????????',
			description: 'Grammar test for allative case'
		}, {
			word: '????????',
			grammarForm: 'dative',
			expected: '????????????',
			description: 'Grammar test for dative case'
		}, {
			word: '??????????',
			grammarForm: 'dative',
			expected: '????????????????',
			description: 'Grammar test for dative case'
		}, {
			word: '??????????',
			grammarForm: 'genitive',
			expected: '??????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '2011',
			grammarForm: 'equative',
			expected: '2011-????',
			description: 'Grammar test for equative case'
		} ],

		ru: [ {
			word: '??????????????????????????',
			grammarForm: 'genitive',
			expected: '??????????????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '??????????',
			grammarForm: 'genitive',
			expected: '??????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '????????????????????',
			grammarForm: 'genitive',
			expected: '????????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '??????????????????',
			grammarForm: 'genitive',
			expected: '??????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '????????????',
			grammarForm: 'genitive',
			expected: '??????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '????????????',
			grammarForm: 'genitive',
			expected: '??????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '????????????????',
			grammarForm: 'genitive',
			expected: '??????????????????',
			description: 'Grammar test for genitive case'
		} ],

		sl: [ {
			word: 'word',
			grammarForm: 'orodnik',
			expected: 'z word',
			description: 'Grammar test for orodnik case'
		}, {
			word: 'word',
			grammarForm: 'mestnik',
			expected: 'o word',
			description: 'Grammar test for mestnik case'
		} ],

		uk: [ {
			word: '??????????????????????????',
			grammarForm: 'genitive',
			expected: '??????????????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '??????????',
			grammarForm: 'genitive',
			expected: '??????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '??????????????????',
			grammarForm: 'genitive',
			expected: '??????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '??????????????????',
			grammarForm: 'genitive',
			expected: '??????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '????????????',
			grammarForm: 'genitive',
			expected: '??????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '????????????',
			grammarForm: 'genitive',
			expected: '??????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '????????????????',
			grammarForm: 'genitive',
			expected: '??????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '??????????????????',
			grammarForm: 'accusative',
			expected: '??????????????????',
			description: 'Grammar test for accusative case'
		} ],
		ml: [ {
			word: '???????????????',
			grammarForm: '????????????????????????',
			expected: '?????????????????????????????????',
			description: 'Grammar test for dative case'
		}, {
			word: '????????????',
			grammarForm: 'dative',
			expected: '??????????????????????????????',
			description: 'Grammar test for dative case'
		}, {
			word: '???????????????',
			grammarForm: 'dative',
			expected: '?????????????????????',
			description: 'Grammar test for dative case'
		}, {
			word: '??????????????????',
			grammarForm: 'dative',
			expected: '?????????????????????',
			description: 'Grammar test for dative case'
		}, {
			word: '???????????????',
			grammarForm: 'dative',
			expected: '???????????????????????????',
			description: 'Grammar test for dative case'
		},{
			word: '???????????????',
			grammarForm: 'dative',
			expected: '????????????',
			description: 'Grammar test for dative case'
		}, {
			word: '????????????',
			grammarForm: 'dative',
			expected: '????????????????????????',
			description: 'Grammar test for dative case'
		}, {
			word: '????????????',
			grammarForm: 'genitive',
			expected: '??????????????????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '??????????????????',
			grammarForm: 'genitive',
			expected: '???????????????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '???????????????',
			grammarForm: 'genitive',
			expected: '??????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '???????????????',
			grammarForm: 'genitive',
			expected: '??????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '???????????????',
			grammarForm: 'genitive',
			expected: '???????????????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '????????????',
			grammarForm: 'genitive',
			expected: '????????????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '??????????????????',
			grammarForm: 'genitive',
			expected: '??????????????????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '???????????????',
			grammarForm: 'genitive',
			expected: '????????????????????????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '????????????????????????',
			grammarForm: '????????????????????????',
			expected: '????????????????????????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '???????????????',
			grammarForm: '????????????????????????',
			expected: '????????????????????????',
			description: 'Grammar test for genitive case'
		}, {
			word: '????????????',
			grammarForm: '????????????????????????',
			expected: '????????????????????????',
			description: 'Grammar test for genitive case'
		} ]
	};

	$.each( grammarTests, function ( langCode, test ) {
		grammarTest( langCode, test );
	} );

}( jQuery ) );
