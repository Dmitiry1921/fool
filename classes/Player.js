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
			Object.assign(this, {
				...params,
				hand: params.hand.map(Card.getByString),
			})
			return;
		}
		this.id = this.getId();
		this.name = params.name; // Имя игрока
		this.hand = []; // Конечно же у игрока есть "Рука", только 1 ахаха аха
	}

	zip() {
		return {
			...this,
			hand: this.hand.map(card => card.toString()),
		}
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
	 * Проверяем все ли карты есть у игрока в руке.
	 * @param player {Player} - Игрок у которого хотим проверить карты в руке.
	 * @param cards {Array<Card>} - Массив карт
	 */
	static cardsInHand(player, cards) {
		return cards.every(card => player.hand.some(handCard => Card.equalCard(card, handCard)))
	}
}


module.exports = Player;
