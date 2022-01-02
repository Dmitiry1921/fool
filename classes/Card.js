'use strict';

const {cardSeniority} = require('../utils/index');

class Card {
	constructor(suit, value) {
		if(!Object.keys(Card.suits).includes(suit.toString().toUpperCase())) {
			throw new Error('WRONG_SUIT_TYPE_CARD');
		}
		if(!Card.values.includes(value)) {
			throw new Error('WRONG_VALUE_CARD');
		}
		this.suit = String(suit); // масть
		this.value = String(value); // значение

		this.seniority = cardSeniority.get(String(value));
	}
	/**
	 * Карту -> Строка
	 * @return {string}
	 */
	toString() {
		return [this.suit, this.value].join(Card.separator);
	}



	static get separator() {
		return ':';
	}

	/**
	 * Строку - Карту
	 * @param string
	 * @return {Card}
	 */
	static getByString(string) {
		const [suit, value] = string.split(Card.separator);
		return new Card(suit, value);
	}

	/**
	 * Допустимые значение Карты
	 * @return {string[]}
	 */
	static get values () {
		return ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
	}

	/**
	 * Масти
	 * @return {{C: string, S: string, D: string, H: string}}
	 */
	static get suits () {
		return {
			C: '&#9827;', // clubs
			D: '&#9830;', // diamonds
			H: '&#9829;', // hearts
			S: '&#9824;', // spades
		}
	}

	static equalCard(card1, card2) {
		return card1.suit === card2.suit && card1.value === card2.value;
	}


	/**
	 * Возвращает истинное значение в случае если карта старше
	 * @param younger {Card} - Карта младше
	 * @param older {Card} - Карта старше
	 * @param trump {String} - Козырь текущей игры.
	 */
	static isOlderCard(younger, older, trump) {
		const bool = younger.seniority < older.seniority;
		const yTrump = younger.suit === trump;
		const oTrump = older.suit === trump;
		if(younger.suit === older.suit || (yTrump && oTrump)) {
			return bool;
		}

		return !yTrump && oTrump; // Бьем козырем ?
	}

	static sortBySeniority() {
		return (lh, rh) => lh.seniority - rh.seniority
	}

}

module.exports = Card;
