'use strict';

const Card = require('./Card');

class Field {
	constructor() {
		this.attack = []; // Карты которые необходимо побить.
		this.protection = []; // Карты которыми отбиваются.
		this.discharge = []; // Колода сброса.
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

	/**
	 * Сброс карт.
	 */
	strike() {
		// TODO: убрать discharge или оставить только как лог..
		this.discharge.push({
			attack: this.attack.map(card => card.toString()),
			protection: this.protection.map(card => card.toString()),
		});
		this.clear();
	}

	isStrike(count) {
		return this.attack.length === this.protection.length && count === this.protection.length;
	}

	clear() {
		this.attack = [];
		this.protection = [];
	}

	static filteredCard(player, cards) {
		return player.hand.filter(card => !cards.some(item => Card.equalCard(card, item)));
	}

	static load(data) {
		const field = new Field();
		Object.assign(field, {
			...data,
			attack: data.attack.map(Card.getByString),
			protection: data.protection.map(Card.getByString),
		});
		return field;
	}

	zip() {
		return {
			...this,
			attack: this.attack.map(card => card.toString()),
			protection: this.protection.map(card => card.toString()),
		}
	}
}

module.exports = Field;
