'use strict';

const assert = require('assert');
const sinon = require('sinon'); // TODO: Удалить пакет если не буду его использовать.
const Card = require('../../classes/Card');
const Fool = require('../../classes/Fool');
const {State} = require('../../classes/PlayerState');

const game36 = require('./data/game36.json');

// describe('classes/Fool.js', () => {
// 	//TODO: Тест на то что независимо от рандомы ходит всегда игрок с наименьшей козырной картой
// 	describe('#attack', () => {
// 		beforeEach(() => {
// 			this.game = new Fool(['Player1', 'Player2', 'Player3']);
// 			this.game.deck.trump = 'C';
// 			this.game.field.attack = []
// 			this.game.players[0].hand = [
// 				Card.getByString('D:6'),
// 				Card.getByString('H:6'),
// 			];
// 			this.game.players[1].hand = [
// 				Card.getByString('H:6'),
// 				Card.getByString('H:7'),
// 				Card.getByString('S:6'),
// 			];
// 		});
// 		it('should be error ATTACK_UNAVAILABLE', () => {
// 			this.game.field.attack = ['H:8']
// 			assert.throws(() => {
// 				this.game.attack();
// 			}, new Error('ATTACK_UNAVAILABLE'));
// 		});
// 		it('should be error ATTACK_NO_CARD', () => {
// 			assert.throws(() => {
// 				this.game.attack();
// 			}, new Error('ATTACK_NO_CARD'));
// 		});
// 		it('should be error ATTACK_SUIT_NOT_EQUALS', () => {
// 			assert.throws(() => {
// 				this.game.attack(['C:6', 'C:7']);
// 			}, new Error('ATTACK_SUIT_NOT_EQUALS'));
// 		});
// 		it('should be error ATTACK_CARD_NOT_IN_HAND', () => {
// 			assert.throws(() => {
// 				this.game.attack(['S:6', 'H:6']);
// 			}, new Error('ATTACK_CARD_NOT_IN_HAND'));
// 		});
// 		it('should be error ATTACK_PROTECTION_PLAYER_HAVE_LESS_CARD', () => {
// 			this.game.players[1].hand = [
// 				Card.getByString('H:6'),
// 			];
// 			assert.throws(() => {
// 				this.game.attack(['S:6', 'H:6']);
// 			}, new Error('ATTACK_PROTECTION_PLAYER_HAVE_LESS_CARD'));
// 		});
// 		it('should be error WRONG_NAME_PLAYER', () => {
// 			assert.throws(() => {
// 				new Player({});
// 			}, new Error('WRONG_NAME_PLAYER'));
// 		});
// 		it('should be success step', () => {
// 			this.game.attack(['D:6', 'H:6'], () => {
// 			});
// 			assert.strictEqual(this.game.currentPlayer.state, State.Throw);
// 			assert.deepStrictEqual(this.game.field.attack, [
// 				Card.getByString('D:6'),
// 				Card.getByString('H:6'),
// 			]);
// 			// Карты выложенные на стол должны уйти из руки игрока.
// 			assert.deepStrictEqual(this.game.players[0].hand, []);
// 		});
// 	});
// 	describe('#hit', () => {
// 		beforeEach(() => {
// 			this.game = new Fool(['Player1', 'Player2']);
// 			this.game.players[0].trump = 'C';
// 			this.game.field.attack = [
// 				Card.getByString('D:6'),
// 				Card.getByString('H:6'),
// 			]
// 			this.game.players[0].hand = [
// 				Card.getByString('D:7'),
// 				Card.getByString('H:7'),
// 				Card.getByString('S:6'),
// 				Card.getByString('C:6'),
// 			];
// 		});
// 		it('should be error HIT_UNAVAILABLE', () => {
// 			this.game.field.attack = [];
// 			assert.throws(() => this.game.hit(['D:7', 'H:6'], () => {
// 			}), new Error('HIT_UNAVAILABLE'));
// 		});
// 		it('should be error HIT_NO_CARD', () => {
// 			assert.throws(() => this.game.hit(undefined, () => {
// 			}), new Error('HIT_NO_CARD'));
// 		});
// 		it('should be error HIT_CARD_COUNT_NOT_EQUAL_FIELD_COUNT', () => {
// 			assert.throws(() => this.game.hit(['D:7'], () => {
// 			}), new Error('HIT_CARD_COUNT_NOT_EQUAL_FIELD_COUNT'));
// 		});
// 		it('should be error HIT_CARD_NOT_IN_HAND', () => {
// 			this.game.field.attack = [Card.getByString('D:6')]
// 			this.game.players[0].hand = [Card.getByString('D:7')];
// 			assert.throws(() => this.game.hit(['D:8'], () => {
// 			}), new Error('HIT_CARD_NOT_IN_HAND'));
// 		});
// 		it('should be error HIT_CANT_FIGHT #1', () => {
// 			this.game.players[0].trump = 'C';
// 			this.game.field.attack = [Card.getByString('D:7')]
// 			this.game.players[0].hand = [Card.getByString('D:6')];
// 			assert.throws(() => this.game.hit(['D:6'], () => {
// 			}), new Error('HIT_CANT_FIGHT'));
// 		});
// 		it('should be error HIT_CANT_FIGHT #2', () => {
// 			this.game.deck.trump = 'C';
// 			this.game.field.attack = [Card.getByString('C:7')];
// 			this.game.players[0].hand = [Card.getByString('D:6')];
// 			assert.throws(() => this.game.hit(['D:6'], () => {
// 			}), new Error('HIT_CANT_FIGHT'));
// 		});
// 		it('should be error because wrong sort protection card', () => {
// 			this.game.players[0].trump = 'D';
// 			this.game.field.attack = [
// 				Card.getByString('D:6'),
// 				Card.getByString('H:6'),
// 				Card.getByString('S:6'),
// 			];
// 			this.game.players[0].hand = [
// 				Card.getByString('D:7'),
// 				Card.getByString('H:7'),
// 				Card.getByString('S:7'),
//
// 			];
// 			assert.throws(() => this.game.hit(['D:7', 'S:7', 'H:7'], () => {
// 			}), new Error('HIT_CANT_FIGHT'));
// 		});
// 		it('should be success', () => {
// 			this.game.deck.trump = 'D';
// 			this.game.players[0].state = State.Protection;
// 			this.game.field.attack = [Card.getByString('C:A')];
// 			this.game.players[0].hand = [Card.getByString('D:6')];
// 			this.game.hit(['D:6']);
// 			assert.deepStrictEqual(this.game.field.protection, [
// 				Card.getByString('D:6'),
// 			]);
// 			assert.strictEqual(this.game.players[0].state, State.Wait);
// 			// Карты выложенные на стол должны уйти из руки игрока.
// 			assert.deepStrictEqual(this.game.players[0].hand, []);
// 		});
// 	});
// 	describe('#pass', () => {
// 		beforeEach(() => {
//
// 		});
// 		afterEach(() => {
//
// 		});
// 		it('should be ', () => {
//
// 		});
// 	});
// 	describe('Fool.load', () => {
// 		beforeEach(() => {
// 		    this.game = new Fool(['Player1', 'Player2', 'Player3'], 36);
// 		})
// 		it('should be success because Fool correct load', () => {
// 			const res = Fool.load(clone(this.game));
// 			const game = this.game;
// 			assert.deepStrictEqual(JSON.stringify(res), game.log());
// 		});
// 	});
// });

const gameSteps = [
	['attack', ['D:8', 'H:8']], // P3 > D:8 H:8
	['hit', ['D:K', 'H:10']], //P1 > D:K H:10
	['throw', ['D:10']], //P2 > D:10
	['pass'], //P1
	['attack', ['D:9']], //P2 > D:9
	['hit', ['C:7']], //P3 > C:7
	['throw', ['S:7']], //P2 > C:7
];

describe('game process 36', () => {
	it('Player3 /attack Player1 D:8 H:8 => State.Throw', () => {
		const game = gotoGameStep(0);
		assert.strictEqual(game.currentPlayer.name, 'Player3');
		assert.strictEqual(game.attackPlayer.name, 'Player3');
		assert.strictEqual(game.protectionPlayer.name, 'Player1');
		game.attack(['D:8', 'H:8']);
		// Карты появились на столе:
		assert.deepStrictEqual(game.field.attack, [
			Card.getByString('D:8'),
			Card.getByString('H:8'),
		]);
		// Пропали из руки игрока.
		assert.deepStrictEqual(game.attackPlayer.hand, [
			Card.getByString('C:J'),
			Card.getByString('C:Q'),
			Card.getByString('S:6'),
			Card.getByString('C:7'),
		]);
		// Статус атакующего игрока перешел в Throw
		assert.strictEqual(game.attackPlayer.state, State.Throw);
	});
	it('Player1 /hit Player3 D:K H:10 => State.Wait', () => {
		const game = gotoGameStep(1);
		//
		assert.strictEqual(game.currentPlayer.name, 'Player1');
		assert.strictEqual(game.attackPlayer.name, 'Player3');
		assert.strictEqual(game.protectionPlayer.name, 'Player1');
		game.hit(['D:K', 'H:10']);
		// Карты появились на столе:
		assert.deepStrictEqual(game.field.attack, [
			Card.getByString('D:8'),
			Card.getByString('H:8'),
		]);
		assert.deepStrictEqual(game.field.protection, [
			Card.getByString('D:K'),
			Card.getByString('H:10'),
		]);
		// Пропали из руки игрока.
		assert.deepStrictEqual(game.protectionPlayer.hand, [
			Card.getByString('S:10'),
			Card.getByString('S:9'),
			Card.getByString('C:A'),
			Card.getByString('S:Q'),
		]);
		// Статус атакующего игрока перешел в Throw
		assert.strictEqual(game.protectionPlayer.state, State.Wait);
		// TODO НА ЭТОМ ЭТАПЕ ИГРОК Player1 отбился игра должна автоматически расчитать это. раздать недостающие карты по определенным правилам, сначала тому кто ходил первый и только потом всем остальным.
		// Проверить на этом этапе что игрокам пришли соответствующие карты
	});
	it('Player2 /throw Player1 D:10 => State.Wait, Player1 is Protection', () => {
		const game= gotoGameStep(2);
		//
		assert.strictEqual(game.currentPlayer.name, 'Player2');
		assert.strictEqual(game.attackPlayer.name, 'Player3');
		assert.strictEqual(game.protectionPlayer.name, 'Player1');
		game.throw(['D:10']);

		// Карты появились на столе:
		assert.deepStrictEqual(game.field.attack, [
			Card.getByString('D:8'),
			Card.getByString('H:8'),
			Card.getByString('D:10'),
		]);
		assert.deepStrictEqual(game.field.protection, [
			Card.getByString('D:K'),
			Card.getByString('H:10'),
		]);
		// Пропали из руки игрока. Ушедшие на поле.
		assert.deepStrictEqual(game.getPlayerByName('Player2').hand, [
			Card.getByString('H:9'),
			Card.getByString('C:9'),
			Card.getByString('D:9'),
			Card.getByString('D:Q'),
			Card.getByString('S:7'),
		]);
		// Пропали из руки игрока.
		assert.deepStrictEqual(game.protectionPlayer.hand, [
			Card.getByString('S:10'),
			Card.getByString('S:9'),
			Card.getByString('C:A'),
			Card.getByString('S:Q'),
		]);
		// Статус подкидывающего игрока Wait
		assert.strictEqual(game.getPlayerByName('Player2').state, State.Wait);
		assert.strictEqual(game.currentPlayer.state, State.Protection);
		assert.strictEqual(game.currentPlayer.name, 'Player1')
		game.log()
	});
	it('Player2 /end next player is Player3', () => {
		const game = gotoGameStep(2);
		//
		assert.strictEqual(game.currentPlayer.name, 'Player2');
		assert.strictEqual(game.attackPlayer.name, 'Player3');
		assert.strictEqual(game.protectionPlayer.name, 'Player1');
		game.log('before:');
		game.end();
		game.log('after:');
		// Карты на столе:
		assert.deepStrictEqual(game.field.attack, [
			'D:8',
			'H:8',
		].map(Card.getByString));
		assert.deepStrictEqual(game.field.protection, [
			Card.getByString('D:K'),
			Card.getByString('H:10'),
		]);
		// Карты в руке игрока который ходил:
		// Карты в руке игрока который ходил
		assert.deepStrictEqual(game.getPlayerByName('Player1').hand, [
			'S:10',
			'S:9',
			'C:A',
			'S:Q'
		].map(Card.getByString));
		assert.deepStrictEqual(game.getPlayerByName('Player2').hand, [
			"H:9",
			"C:9",
			"D:Q",
			"D:J",
		].map(Card.getByString));
		assert.deepStrictEqual(game.getPlayerByName('Player3').hand, [
			"C:J",
			"C:Q",
			"S:6",
			"D:7",
		].map(Card.getByString));
		// Пропали из руки игрока.
		assert.deepStrictEqual(game.protectionPlayer.hand, [
			Card.getByString('S:10'),
			Card.getByString('S:9'),
			Card.getByString('C:A'),
			Card.getByString('S:Q'),
		]);
		// Статусы игроков
		assert.strictEqual(game.getPlayerByName('Player1').state, State.Wait, 'Player1');
		assert.strictEqual(game.getPlayerByName('Player2').state, State.Wait, 'Player2');
		assert.strictEqual(game.getPlayerByName('Player3').state, State.Wait, 'Player3');
		assert.strictEqual(game.currentPlayer.state, State.Protection);
		assert.strictEqual(game.currentPlayer.name, 'Player3');

		game.log();
	});
	it('Player2 and Player3 /end STRIKE!', () => {
		const game = gotoGameStep(2);
		//
		assert.strictEqual(game.currentPlayer.name, 'Player2');
		assert.strictEqual(game.attackPlayer.name, 'Player3');
		assert.strictEqual(game.protectionPlayer.name, 'Player1');
		game.end(); // Player2 /end
		game.end(); // Player3 /end
		// Карты на столе:
		assert.deepStrictEqual(game.field.attack, []);
		assert.deepStrictEqual(game.field.protection, []);
		assert.deepStrictEqual(game.field.discharge, [
			{
				attack: [
					"D:8",
					"H:8"
				],
				protection: [
					"D:K",
					"H:10"
				]
			}
		]);
		// Проверяем что игроку 3 первому раздали карты.
		assert.deepStrictEqual(game.getPlayerByName('Player3').hand, [
			Card.getByString('C:J'),
			Card.getByString('C:Q'),
			Card.getByString('S:6'),
			Card.getByString('C:7'),
			Card.getByString('C:10'),
			Card.getByString('D:7'),
		]);
		// Остальные игроки получают карты в том порядке в котором сидят.
		assert.deepStrictEqual(game.getPlayerByName('Player2').hand, [
			Card.getByString('H:9'),
			Card.getByString('D:10'),
			Card.getByString('C:9'),
			Card.getByString('D:9'),
			Card.getByString('D:Q'),
			Card.getByString('S:7'),
		]);
		// Остальные игроки получают карты в том порядке в котором сидят.
		assert.deepStrictEqual(game.getPlayerByName('Player1').hand, [
			Card.getByString('S:10'),
			Card.getByString('S:9'),
			Card.getByString('C:A'),
			Card.getByString('S:Q'),
			Card.getByString('D:J'),
			Card.getByString('H:7'),
		]);
		// Статус атакующего игрока перешел в Throw
		assert.strictEqual(game.currentPlayer.state, State.Attack);
		assert.strictEqual(game.currentPlayer.name, 'Player1');
		assert.strictEqual(game.protectionPlayer.state, State.Protection);
		assert.strictEqual(game.protectionPlayer.name, 'Player2');
	});
	it('Player1 /pass and take all card in field', () => {
		const game = gotoGameStep(3);
		//
		assert.strictEqual(game.currentPlayer.name, 'Player1');
		assert.strictEqual(game.attackPlayer.name, 'Player3');
		assert.strictEqual(game.protectionPlayer.name, 'Player1');
		game.pass();
		// Карты на поле
		assert.deepStrictEqual(game.field.attack, []);
		assert.deepStrictEqual(game.field.protection, []);
		// Карты в руке игрока который ходил
		assert.deepStrictEqual(game.getPlayerByName('Player1').hand, [
			"S:10",
			"S:9",
			"C:A",
			"S:Q",
			"D:8",
			"H:8",
			"D:10",
			"D:K",
			"H:10"
		].map(Card.getByString));
		assert.deepStrictEqual(game.getPlayerByName('Player2').hand, [
			"H:9",
			"C:9",
			"D:9",
			"D:Q",
			"S:7",
			"D:J",
		].map(Card.getByString));
		assert.deepStrictEqual(game.getPlayerByName('Player3').hand, [
			"C:J",
			"C:Q",
			"S:6",
			"C:7",
			"C:10",
			"D:7",
		].map(Card.getByString));
		// Статусы игроков
		assert.strictEqual(game.getPlayerByName('Player1').state, State.Wait);
		assert.strictEqual(game.getPlayerByName('Player2').state, State.Attack);
		assert.strictEqual(game.getPlayerByName('Player3').state, State.Protection);
		assert.strictEqual(game.currentPlayer.state, State.Attack);
		assert.strictEqual(game.currentPlayer.name, 'Player2');
	});
	it('Player2 /attack D:7 => Player3', () => {
		const game = gotoGameStep(4);
		game.log();
		//
		assert.strictEqual(game.currentPlayer.name, 'Player2');
		assert.strictEqual(game.attackPlayer.name, 'Player2');
		assert.strictEqual(game.protectionPlayer.name, 'Player3');
		game.attack(['D:9']);
		// Карты на поле
		assert.deepStrictEqual(game.field.attack, ['D:9'].map(Card.getByString));
		assert.deepStrictEqual(game.field.protection, []);
		// Карты в руке игрока который ходил
		assert.deepStrictEqual(game.getPlayerByName('Player1').hand, [
			"S:10",
			"S:9",
			"C:A",
			"S:Q",
			"D:8",
			"H:8",
			"D:10",
			"D:K",
			"H:10"
		].map(Card.getByString));
		assert.deepStrictEqual(game.getPlayerByName('Player2').hand, [
			"H:9",
			"C:9",
			"D:Q",
			"S:7",
			"D:J",
		].map(Card.getByString));
		assert.deepStrictEqual(game.getPlayerByName('Player3').hand, [
			"C:J",
			"C:Q",
			"S:6",
			"C:7",
			"C:10",
			"D:7",
		].map(Card.getByString));
		// Статусы игроков
		assert.strictEqual(game.getPlayerByName('Player1').state, State.Wait);
		assert.strictEqual(game.getPlayerByName('Player2').state, State.Throw);
		assert.strictEqual(game.getPlayerByName('Player3').state, State.Protection);
		assert.strictEqual(game.currentPlayer.state, State.Protection);
		assert.strictEqual(game.currentPlayer.name, 'Player3');
	});
	it('Player3 /hit C:7 => Player2', () => {
		const game = gotoGameStep(5);
		game.log();
		//
		assert.strictEqual(game.currentPlayer.name, 'Player3');
		assert.strictEqual(game.attackPlayer.name, 'Player2');
		assert.strictEqual(game.protectionPlayer.name, 'Player3');
		game.hit(['C:7']);
		// Карты на поле
		assert.deepStrictEqual(game.field.attack, ['D:9'].map(Card.getByString));
		assert.deepStrictEqual(game.field.protection, ['C:7'].map(Card.getByString));
		// Карты в руке игрока который ходил
		assert.deepStrictEqual(game.getPlayerByName('Player1').hand, [
			"S:10",
			"S:9",
			"C:A",
			"S:Q",
			"D:8",
			"H:8",
			"D:10",
			"D:K",
			"H:10"
		].map(Card.getByString));
		assert.deepStrictEqual(game.getPlayerByName('Player2').hand, [
			"H:9",
			"C:9",
			"D:Q",
			"S:7",
			"D:J",
		].map(Card.getByString));
		assert.deepStrictEqual(game.getPlayerByName('Player3').hand, [
			"C:J",
			"C:Q",
			"S:6",
			"C:10",
			"D:7",
		].map(Card.getByString));
		// Статусы игроков
		assert.strictEqual(game.getPlayerByName('Player1').state, State.Wait);
		assert.strictEqual(game.getPlayerByName('Player2').state, State.Throw);
		assert.strictEqual(game.getPlayerByName('Player3').state, State.Wait);
		assert.strictEqual(game.currentPlayer.state, State.Throw);
		assert.strictEqual(game.currentPlayer.name, 'Player2');
	});
	it('Player2 /throw S:7 => Player3' , () => {
		const game = gotoGameStep(6);
		game.log();
		//
		assert.strictEqual(game.currentPlayer.name, 'Player2');
		assert.strictEqual(game.attackPlayer.name, 'Player2');
		assert.strictEqual(game.protectionPlayer.name, 'Player3');
		game.throw(['S:7']);
		// Карты на поле
		assert.deepStrictEqual(game.field.attack, [
			'D:9',
			'S:7',
		].map(Card.getByString));
		assert.deepStrictEqual(game.field.protection, ['C:7'].map(Card.getByString));
		// Карты в руке игрока который ходил
		assert.deepStrictEqual(game.getPlayerByName('Player1').hand, [
			"S:10",
			"S:9",
			"C:A",
			"S:Q",
			"D:8",
			"H:8",
			"D:10",
			"D:K",
			"H:10"
		].map(Card.getByString));
		assert.deepStrictEqual(game.getPlayerByName('Player2').hand, [
			"H:9",
			"C:9",
			"D:Q",
			"D:J",
		].map(Card.getByString));
		assert.deepStrictEqual(game.getPlayerByName('Player3').hand, [
			"C:J",
			"C:Q",
			"S:6",
			"C:10",
			"D:7",
		].map(Card.getByString));
		// Статусы игроков
		assert.strictEqual(game.getPlayerByName('Player1').state, State.Wait);
		assert.strictEqual(game.getPlayerByName('Player2').state, State.Wait);
		assert.strictEqual(game.getPlayerByName('Player3').state, State.Protection);
		assert.strictEqual(game.currentPlayer.state, State.Protection);
		assert.strictEqual(game.currentPlayer.name, 'Player3');
	});
	it('Player3 /hit C:10 => Player3' , () => {
		const game = gotoGameStep(7);
		game.log();
		//
		assert.strictEqual(game.currentPlayer.name, 'Player3');
		assert.strictEqual(game.attackPlayer.name, 'Player2');
		assert.strictEqual(game.protectionPlayer.name, 'Player3');
		game.hit(['C:10']);
		game.log();
		// Карты на поле
		assert.deepStrictEqual(game.field.attack, [
			'D:9',
			'S:7',
		].map(Card.getByString));
		assert.deepStrictEqual(game.field.protection, ['C:7', 'C:10'].map(Card.getByString));
		// Карты в руке игрока который ходил
		assert.deepStrictEqual(game.getPlayerByName('Player1').hand, [
			"S:10",
			"S:9",
			"C:A",
			"S:Q",
			"D:8",
			"H:8",
			"D:10",
			"D:K",
			"H:10"
		].map(Card.getByString));
		assert.deepStrictEqual(game.getPlayerByName('Player2').hand, [
			"H:9",
			"C:9",
			"D:Q",
			"D:J",
		].map(Card.getByString));
		assert.deepStrictEqual(game.getPlayerByName('Player3').hand, [
			"C:J",
			"C:Q",
			"S:6",
			"D:7",
		].map(Card.getByString));
		// Статусы игроков
		assert.strictEqual(game.getPlayerByName('Player1').state, State.Wait, 'Player1');
		assert.strictEqual(game.getPlayerByName('Player2').state, State.Wait, 'Player2');
		assert.strictEqual(game.getPlayerByName('Player3').state, State.Wait, 'Player3');
		assert.strictEqual(game.currentPlayer.state, State.Protection);
		assert.strictEqual(game.currentPlayer.name, 'Player3');
	});
	// TODO: Нужен тест на ситуацию когда у игрока была не было возможности подкинуть карту и эта возможность перешла другому, затем другой игрок подкинул карту и возможность появилась
	// TODO: Проверка должна касаться кейса, что если игрок в статусе Protection решил отбиться и выложил карты на стол, тогда остальные игроки переходят в статус Wait даже если они завершили свой Trow ход в /end
});
