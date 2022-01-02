'use strict';

/**
 * Возвращает псевдослучайное число в указанном промежутке.
 * @param min {Number}
 * @param max {Number}
 * @return {Number}
 */
function random(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}


/**
 * Старшинство карт "Дурак"
 * @return {*}
 */
function cardSeniority() {
	return ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'].reduce((acc, key, value ) => acc.set(key, value), new Map());
}

/**
 * Делает первую букву заглавной
 * @param value {String}
 */
function firstCharUp(value) {
	if(!value) return value;
	return value[0].toUpperCase() + value.slice(1);
}

module.exports = {
	random,
	firstCharUp,
	cardSeniority: cardSeniority(),
};
