'use strict';

const Card = require("./Card");
const {random} = require('../utils/index');

class Deck {
	constructor(data) {
		if (!Object.keys(Deck.sizes).includes(data.toString())) {
			throw new Error('WRONG_DECK_SIZE');
		}
		this.cards = this.make(data);
		this.size = Number(this.cards.length);
		this.trump = this.getTrump();
	}

	/**
	 * Создаёт колоду указанного размера
	 */
	make(size) {
		if (!this.cards) {
			this.cards = [];
		}
		if (this.cards.length) {
			return this.cards;
		}
		const cards = [];
		Deck.sizes[size].forEach((value) => {
			Object.keys(Card.suits).map((suits) => {
				return cards.push(new Card(suits, value));
			});
		});

		return this.shuffle(cards);
	}

	shuffle(array) {
		for (let i = 0; i < random(array.length * 4, array.length * 8); i++) {
			array.sort(() => 0.5 - Math.random());
		}
		return array;
	}

	/**
	 * Достаём козыря из колоды
	 * @return {*}
	 */
	getTrump() {
		if (this.trump) return this.trump;
		return this.cards[random(0, this.size - 1)].suit;
	}

	zip() {
		return {
			...this,
			cards: this.cards.map(card => card.toString()),
		}
	}

	static load(data) {
		const deck = new Deck(Object.keys(Deck.sizes)[0]); // Размер колоды тут не важен все равно перезапишем.
		Object.assign(deck, {
			...data,
			cards: data.cards.map(Card.getByString),
		});
		return deck;
	}

	static get sizes() {
		return {
			// 52 карты (полная колода, от двоек до тузов)
			52: ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
			// 36 карт (сокращённая колода, от шестёрок до тузов)
			36: ['A', '6', '7', '8', '9', '10', 'J', 'Q', 'K'],
			// 32 карты (малая колода, от семёрок до тузов)
			32: ['A', '7', '8', '9', '10', 'J', 'Q', 'K'],
			// 24 карты (от девяток до тузов)
			24: ['A', '10', 'J', 'Q', 'K'],
		}
	}
}

module.exports = Deck;
