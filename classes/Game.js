'use strict';
const Player = require("./Player");


class Game {
	constructor(players) {
		this._debug = false;
		this.players = players.map(name => new Player({name})); // Массив игроков

		this._firstAttackInRound = null; // Первый атакующий игрок. Он же первый берёт карты в конце раунда.
		this._currentPlayerId = null; // Активный игрок.
		this._attackPlayerId = null; // Атакующий игрок
		this._protectionPlayerId = null; // Защищающийся игрок.
	}

	log(...args) {
		if(this._debug) {
			console.log(...args);
		}
	}


	/**
	 * Возвращает активного игрока.
	 * @return {*}
	 */
	get currentPlayer() {
		return this.players.find(player => player.id === this._currentPlayerId);
	}
	set currentPlayer(player) {
		this._currentPlayerId = this.getNextPlayer(player).id;
	}

	get firstAttackInRound() {
		return  this.players.find(player => player.id === this._firstAttackInRound);
	}
	set firstAttackInRound(player) {
		this._firstAttackInRound = player.id;
	}

	/**
	 * Возвращает игрока который отбивается
	 * @return {*}
	 */
	get protectionPlayer () {
		return this.players.find(player => player.id === this._protectionPlayerId);
	}
	set protectionPlayer (player) {
		return this._protectionPlayerId = player.id;
	}

	/**
	 * Возвращает игрока который отбивается
	 * @return {*}
	 */
	get attackPlayer () {
		return this.players.find(player => player.id === this._attackPlayerId);
	}
	set attackPlayer (player) {
		this._attackPlayerId = player.id;
	}

	static load() {
		throw new Error('NOT_IMPLEMENT_FUNCTION');
	}

}


module.exports = Game;
