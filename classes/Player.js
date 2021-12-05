'use strict';

const Card = require('./Card');
const {State} = require('./PlayerState');
const {PlayerState} = require('./PlayerState');
const {getRandomCharFromAlphabet} = require('../utils/index');

class Player extends PlayerState {
	constructor(params) {
		super(params.state);
		if(typeof params.name !== 'string'){
			throw new Error('WRONG_NAME_PLAYER');
		}
		if(params.id) {
			Object.assign(this, params)
			this.initHand();
			return;
		}
		this.id = this.getId();
		this.name = params.name; // Имя игрока
		this.hand = []; // Конечно же у игрока есть "Рука", только 1 ахаха аха
		this.state = State.Wait;
	}

	getId () {
		let id = '';
		const words = 'abcdefghijklmnopqrstuvwxyz1234567890';
		for(let i=0; i<10; i++) {
			id += getRandomCharFromAlphabet(words.split(''));
		}
		return id;
	}

	/**
	 * Преобразует карты игрока из строкового значения в объекты карт
	 */
	initHand() {
		this.hand = this.hand.map(card => new Card(card.suit, card.value));
	}

	/**
	 * Проверяем все ли карты есть у игрока в руке.
	 * @param player {Player} - Игрок у которого хотим проверить карты в руке.
	 * @param cards {Array<Card>} - Массив карт
	 */
	static cardsInHand(player, cards) {
		return cards.every(card => player.hand.some(handCard => Card.equalCard(card, handCard)))
	}
}


module.exports = Player;
