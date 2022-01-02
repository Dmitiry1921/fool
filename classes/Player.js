'use strict';

const {v4: uuidv4} = require('uuid');

const Card = require('./Card');
const {PlayerState} = require('./PlayerState');

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
		this.id = `Player:${uuidv4()}`;
		this.name = params.name; // Имя игрока
		this.hand = []; // Конечно же у игрока есть "Рука", только 1 ахаха аха
	}

	zip() {
		return {
			...this,
			hand: this.hand.map(card => card.toString()),
		}
	}

	/**
	 * Возвращает публичную информацию доступную всем игрокам.
	 * @return {{name: string, state, hand: ([]|*)}}
	 */
	getPublicInfo() {
		return {
			id: this.id,
			hand: this.hand.length,
			state: this.state,
		};
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
