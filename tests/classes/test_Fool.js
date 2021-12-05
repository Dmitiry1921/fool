'use strict';

const assert = require('assert');
const sinon = require('sinon'); // TODO: Удалить пакет если не буду его использовать.
const Player = require('../../classes/Player');
const Card = require('../../classes/Card');
const Fool = require('../../classes/Fool');
const {State} = require('../../classes/PlayerState');

const game36 = require('./data/game36.json');

describe('classes/Fool.js', () => {
	//TODO: Тест на то что независимо от рандомы ходит всегда игрок с наименьшей козырной картой
	describe('#attack', () => {
		beforeEach(() => {
			this.game = new Fool(['Player1', 'Player2', 'Player3']);
			this.game.deck.trump = 'C';
			this.game.field.attack = []
			this.game.players[0].hand = [
				Card.getByString('D:6'),
				Card.getByString('H:6'),
			];
			this.game.players[1].hand = [
				Card.getByString('H:6'),
				Card.getByString('H:7'),
				Card.getByString('S:6'),
			];
		});
		it('should be error ATTACK_UNAVAILABLE', () => {
			this.game.field.attack = ['H:8']
			assert.throws(() => {
				this.game.attack();
			}, new Error('ATTACK_UNAVAILABLE'));
		});
		it('should be error ATTACK_NO_CARD', () => {
			assert.throws(() => {
				this.game.attack();
			}, new Error('ATTACK_NO_CARD'));
		});
		it('should be error ATTACK_SUIT_NOT_EQUALS', () => {
			assert.throws(() => {
				this.game.attack(['C:6', 'C:7']);
			}, new Error('ATTACK_SUIT_NOT_EQUALS'));
		});
		it('should be error ATTACK_CARD_NOT_IN_HAND', () => {
			assert.throws(() => {
				this.game.attack(['S:6', 'H:6']);
			}, new Error('ATTACK_CARD_NOT_IN_HAND'));
		});
		it('should be error ATTACK_PROTECTION_PLAYER_HAVE_LESS_CARD', () => {
			this.game.players[1].hand = [
				Card.getByString('H:6'),
			];
			assert.throws(() => {
				this.game.attack(['S:6', 'H:6']);
			}, new Error('ATTACK_PROTECTION_PLAYER_HAVE_LESS_CARD'));
		});
		it('should be error WRONG_NAME_PLAYER', () => {
			assert.throws(() => {
				new Player({});
			}, new Error('WRONG_NAME_PLAYER'));
		});
		it('should be success step', () => {
			this.game.attack(['D:6', 'H:6'], () => {
			});
			assert.strictEqual(this.game.currentPlayer.state, State.Throw);
			assert.deepStrictEqual(this.game.field.attack, [
				Card.getByString('D:6'),
				Card.getByString('H:6'),
			]);
			// Карты выложенные на стол должны уйти из руки игрока.
			assert.deepStrictEqual(this.game.players[0].hand, []);
		});
	});
	describe('#hit', () => {
		beforeEach(() => {
			this.game = new Fool(['Player1', 'Player2']);
			this.game.players[0].trump = 'C';
			this.game.field.attack = [
				Card.getByString('D:6'),
				Card.getByString('H:6'),
			]
			this.game.players[0].hand = [
				Card.getByString('D:7'),
				Card.getByString('H:7'),
				Card.getByString('S:6'),
				Card.getByString('C:6'),
			];
		});
		it('should be error HIT_UNAVAILABLE', () => {
			this.game.field.attack = [];
			assert.throws(() => this.game.hit(['D:7', 'H:6'], () => {
			}), new Error('HIT_UNAVAILABLE'));
		});
		it('should be error HIT_NO_CARD', () => {
			assert.throws(() => this.game.hit(undefined, () => {
			}), new Error('HIT_NO_CARD'));
		});
		it('should be error HIT_CARD_COUNT_NOT_EQUAL_FIELD_COUNT', () => {
			assert.throws(() => this.game.hit(['D:7'], () => {
			}), new Error('HIT_CARD_COUNT_NOT_EQUAL_FIELD_COUNT'));
		});
		it('should be error HIT_CARD_NOT_IN_HAND', () => {
			this.game.field.attack = [Card.getByString('D:6')]
			this.game.players[0].hand = [Card.getByString('D:7')];
			assert.throws(() => this.game.hit(['D:8'], () => {
			}), new Error('HIT_CARD_NOT_IN_HAND'));
		});
		it('should be error HIT_CANT_FIGHT #1', () => {
			this.game.players[0].trump = 'C';
			this.game.field.attack = [Card.getByString('D:7')]
			this.game.players[0].hand = [Card.getByString('D:6')];
			assert.throws(() => this.game.hit(['D:6'], () => {
			}), new Error('HIT_CANT_FIGHT'));
		});
		it('should be error HIT_CANT_FIGHT #2', () => {
			this.game.deck.trump = 'C';
			this.game.field.attack = [Card.getByString('C:7')];
			this.game.players[0].hand = [Card.getByString('D:6')];
			assert.throws(() => this.game.hit(['D:6'], () => {
			}), new Error('HIT_CANT_FIGHT'));
		});
		it('should be error because wrong sort protection card', () => {
			this.game.players[0].trump = 'D';
			this.game.field.attack = [
				Card.getByString('D:6'),
				Card.getByString('H:6'),
				Card.getByString('S:6'),
			];
			this.game.players[0].hand = [
				Card.getByString('D:7'),
				Card.getByString('H:7'),
				Card.getByString('S:7'),

			];
			assert.throws(() => this.game.hit(['D:7', 'S:7', 'H:7'], () => {
			}), new Error('HIT_CANT_FIGHT'));
		});
		it('should be success', () => {
			this.game.deck.trump = 'D';
			this.game.players[0].state = State.Protection;
			this.game.field.attack = [Card.getByString('C:A')];
			this.game.players[0].hand = [Card.getByString('D:6')];
			this.game.hit(['D:6']);
			assert.deepStrictEqual(this.game.field.protection, [
				Card.getByString('D:6'),
			]);
			assert.strictEqual(this.game.players[0].state, State.Wait);
			// Карты выложенные на стол должны уйти из руки игрока.
			assert.deepStrictEqual(this.game.players[0].hand, []);
		});
	});
	describe('#pass', () => {
		beforeEach(() => {

		});
		afterEach(() => {

		});
		it('should be ', () => {

		});
	});
	describe('Fool.load', () => {
		beforeEach(() => {
		    this.game = new Fool(['Player1', 'Player2', 'Player3'], 36);
		})
		it('should be success because Fool correct load', () => {
			const res = Fool.load(JSON.parse(JSON.stringify(this.game)));
			const game = this.game;
			assert.deepStrictEqual(JSON.stringify(res), game.log());
		});
	});
});

const gameSteps = [
	['attack', ['D:8', 'H:8']],
	['hit', ['D:K', 'H:10']],
];

/**
 * Вспомогательная функция для инициализации игры на том или ином этапе.
 * @param game {Fool} - Экземпляр игры
 * @param index {Number} - Индекс массива gameSteps lо которого нужно проинициализировать игровое состояние
 */
function gotoGameStep(game, index) {
	for (let i = 0; i < index; i++) {
		const [fn, ...args] = gameSteps[i];
		game[fn](...args);
	}
}

describe('game process 36', () => {
	beforeEach(() => {
		this.game = Fool.load(game36);
	});
	it('Player3 /attack Player1 D:8 H:8 => State.Throw', () => {
		assert.strictEqual(this.game.currentPlayer.name, 'Player3');
		assert.strictEqual(this.game.attackPlayer.name, 'Player3');
		assert.strictEqual(this.game.protectionPlayer.name, 'Player1');
		this.game.attack(['D:8', 'H:8']);
		// Карты появились на столе:
		assert.deepStrictEqual(this.game.field.attack, [
			Card.getByString('D:8'),
			Card.getByString('H:8'),
		]);
		// Пропали из руки игрока.
		assert.deepStrictEqual(this.game.attackPlayer.hand, [
			Card.getByString('C:J'),
			Card.getByString('C:Q'),
			Card.getByString('S:6'),
			Card.getByString('C:7'),
		]);
		// Статус атакующего игрока перешел в Throw
		assert.strictEqual(this.game.attackPlayer.state, State.Throw);
	});
	it('Player1 /hit Player3 D:K H:10 => State.Wait', () => {
		gotoGameStep(this.game, 1);
		//
		assert.strictEqual(this.game.currentPlayer.name, 'Player1');
		assert.strictEqual(this.game.attackPlayer.name, 'Player3');
		assert.strictEqual(this.game.protectionPlayer.name, 'Player1');
		this.game.hit(['D:K', 'H:10']);
		// Карты появились на столе:
		assert.deepStrictEqual(this.game.field.attack, [
			Card.getByString('D:8'),
			Card.getByString('H:8'),
		]);
		assert.deepStrictEqual(this.game.field.protection, [
			Card.getByString('D:K'),
			Card.getByString('H:10'),
		]);
		// Пропали из руки игрока.
		assert.deepStrictEqual(this.game.protectionPlayer.hand, [
			Card.getByString('S:10'),
			Card.getByString('S:9'),
			Card.getByString('C:A'),
			Card.getByString('S:Q'),
		]);
		// Статус атакующего игрока перешел в Throw
		assert.strictEqual(this.game.protectionPlayer.state, State.Wait);
		// TODO НА ЭТОМ ЭТАПЕ ИГРОК Player1 отбился игра должна автоматически расчитать это. раздать недостающие карты по определенным правилам, сначала тому кто ходил первый и только потом всем остальным.
		// Проверить на этом этапе что игрокам пришли соответствующие карты
	});
	it('Player2 /throw Player1 D:K H:10 => State.Wait', () => {
		gotoGameStep(this.game, 2);
		//
		assert.strictEqual(this.game.currentPlayer.name, 'Player2');
		assert.strictEqual(this.game.attackPlayer.name, 'Player3');
		assert.strictEqual(this.game.protectionPlayer.name, 'Player1');
		this.game.throw(['D:10']);

		// Карты появились на столе:
		assert.deepStrictEqual(this.game.field.attack, [
			Card.getByString('D:8'),
			Card.getByString('H:8'),
			Card.getByString('D:10'),
		]);
		assert.deepStrictEqual(this.game.field.protection, [
			Card.getByString('D:K'),
			Card.getByString('H:10'),
		]);
		// Пропали из руки игрока. Ушедшие на поле.
		assert.deepStrictEqual(this.game.players.find(p => p.name === 'Player2').hand, [
			Card.getByString('H:9'),
			Card.getByString('C:9'),
			Card.getByString('D:9'),
			Card.getByString('D:Q'),
			Card.getByString('S:7'),
		]);
		// Пропали из руки игрока.
		assert.deepStrictEqual(this.game.protectionPlayer.hand, [
			Card.getByString('S:10'),
			Card.getByString('S:9'),
			Card.getByString('C:A'),
			Card.getByString('S:Q'),
		]);
		// Статус подкидывающего игрока Wait
		assert.strictEqual(this.game.protectionPlayer.state, State.Wait);
	});
	// TODO: Нужен тест на ситуацию когда у игрока есть возможность подкинуть карту но он решает закончить свой ход.
	it('Player3 /pass TODO', () => {
		gotoGameStep(this.game, 2);
		//
		assert.strictEqual(this.game.currentPlayer.name, 'Player2');
		assert.strictEqual(this.game.attackPlayer.name, 'Player3');
		assert.strictEqual(this.game.protectionPlayer.name, 'Player1');
		this.game.throw(['D:K', 'H:10']);
		// Карты появились на столе:
		assert.deepStrictEqual(this.game.field.attack, [
			Card.getByString('D:8'),
			Card.getByString('H:8'),
		]);
		assert.deepStrictEqual(this.game.field.protection, [
			Card.getByString('D:K'),
			Card.getByString('H:10'),
		]);
		// Пропали из руки игрока. Ушедшие на поле.
		assert.deepStrictEqual(this.game.protectionPlayer.hand, [
			Card.getByString('S:10'),
			Card.getByString('S:9'),
			Card.getByString('C:A'),
			Card.getByString('S:Q'),
		]);
		// Пропали из руки игрока.
		assert.deepStrictEqual(this.game.protectionPlayer.hand, [
			Card.getByString('S:10'),
			Card.getByString('S:9'),
			Card.getByString('C:A'),
			Card.getByString('S:Q'),
		]);
		// Статус атакующего игрока перешел в Throw
		assert.strictEqual(this.game.protectionPlayer.state, State.Wait);
		console.log(this.game.log())
	});
});
