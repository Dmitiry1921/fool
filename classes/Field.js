'use strict';

const Card = require('./Card');

class Field {
	constructor() {
		this.attack = []; // Карты которые необходимо побить.
		this.protection = []; // Карты которыми отбиваются.
	}

	/**
	 * Кладёт карты на стол.
	 */
	putAttack(player, cards) {
		if(!cards) {
			return;
		}
		player.hand = Field.filteredCard(player, cards);
		this.attack.push(...cards);
	}
	/**
	 * Кладёт карты на стол.
	 * @param player {Player}
	 * @param cards {Array<Card>}
	 */
	putProtection(player, cards) {
		if(!cards) {
			return;
		}
		player.hand = Field.filteredCard(player, cards);
		this.protection.push(...cards);
	}

	/**
	 * Возвращает карты которые есть на столе в виде одного массива.
	 * @return {*[]}
	 */
	getAllInOne() {
		return [...this.attack, ...this.protection];
	}

	/**
	 * Возвращает карты которые есть на столе в виде одного массива.
	 * @return {*[]}
	 */
	getValuesCards() {
		return [...this.getAllInOne().reduce((acc, card) => acc.add(card.value), new Set)];
	}

	static filteredCard(player, cards) {
		return player.hand.filter(card => !cards.some(item => Card.equalCard(card, item)));
	}

	static load(data) {
		const filed = new Field();
		Object.assign(filed, data);
		return filed;
	}
}

module.exports = Field;
