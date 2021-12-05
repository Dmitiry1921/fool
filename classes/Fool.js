'use strict';

const Field = require("./Field");
const {State} = require("./PlayerState");
const Player = require('./Player');
const Deck = require('./Deck');
const Card = require('./Card');

class Fool {
	constructor(players, deckSize = 36) {
		this.minPlayers = 2;
		this.maxPlayers = 8;
		if(players.length < this.minPlayers) {
			throw new Error('WRONG_MIN_PLAYERS');
		}
		if(players.length > this.maxPlayers) {
			throw new Error('WRONG_MAX_PLAYERS');
		}
		this.deck = new Deck(deckSize); // Колода карт
		this.field = new Field(); // Игровое поле.
		// Один раунд длится до тех пор пока игрок или не отобьется от всех карт или не возьмет карты с поля в руку.
		this.round = 0; // Счетчик раундов.

		this.players = players.map(name => new Player({name})); // Массив игроков

		//Раздаём начальное кол-во карт всем игрокам.
		this.distribution();
		// Определяем первых игроков
		this.players = this.firstSortPlayers(this.players);
		// Создаем переменные очередей и статусов
		this._firstAttackInRound = this.players[0].id; // Первый атакующий игрок. Он же первый берёт карты в конце раунда.
		this._currentPlayerId = this.players[0].id; // Активный игрок.
		this._attackPlayerId = this.players[0].id; // Атакующий игрок
		this._protectionPlayerId = this.players[1].id; // Защищающийся игрок.
	}

	static load(data) {
		const game = new Fool(data.players.map(({name}) => name), data.deck.cards.size);
		game._attackPlayerId = data._attackPlayerId;
		game._protectionPlayerId = data._protectionPlayerId;
		game._currentPlayerId = data._currentPlayerId;
		game.players = data.players.map(player => new Player(player));
		game.deck = new Deck(data.deck);
		game.field = Field.load(data.field);
		return game;
	}

	/**
	 * Получить слепок игры.
	 * @return {string}
	 */
	log() {
		return JSON.stringify(this);
	}

	/**
	 * Раздаём всем игрокам по 6 карт.
	 */
	distribution() {
		this.players.forEach((player) => {
		    if(player.hand.length < 6) {
		    	player.hand.push(this.deck.cards.shift());
		    	this.distribution();
			}
		})
	}

	markCard(marker) {
		return (card) => ({...card, ...marker});
	}

	/**
	 * Получаем первого игрока
	 * "Тот у кого меньший козырь" или игрок с младшей картой
	 */
	firstSortPlayers(players) {
		// Обрываем ссылки чтобы ничего не мутировать.
		const clone = JSON.parse(JSON.stringify(players));
		//new resolve
		let cardArray = clone.reduce((acc, player) => {
			// Подписываем все карты id'шкой игрока.
			const cards = player.hand.map(this.markCard({playerId: player.id}));
			// Кладём только козырные карты
			acc.push(...cards.filter(({suit}) => suit === this.deck.trump));
			return acc;
		}, []);
		// Если вдруг так случилось что козырей нет ни у кого тогда ходит первый игрок в массиве второй защищается.
		if(!cardArray.length) {
			cardArray = clone.reduce((acc, player) => {
				acc.push(...player.hand.map(this.markCard({playerId: player.id})));
				return acc;
			}, []);
		}
		// Сортируем карты по старшинству
		cardArray.sort(Card.sortBySeniority());
		const [firstCard] = cardArray

		let first = players.find(player => player.id === firstCard.playerId);
		const other = players.filter(player => player.id !== first.id);
		first = new Player(first);
		first.state = State.Attack;
		other[0].state = State.Protection;
		return [first, ...other];
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

	/**
	 * Возвращает игрока который отбивается
	 * @return {*}
	 */
	get protectionPlayer () {
		return this.players.find(player => player.id === this._protectionPlayerId);
	}

	/**
	 * Возвращает игрока который отбивается
	 * @return {*}
	 */
	get attackPlayer () {
		return this.players.find(player => player.id === this._attackPlayerId);
	}

	/**
	 * Записывает id игрока.
	 * @param player {Player}
	 */
	set attackPlayer (player) {
		this._attackPlayerId = player.id;
	}

	/**
	 * Возвращает id следующего игрока.
	 * @param player {Player}
	 */
	getNextPlayer(player) {
		switch (player.state) {
			case State.Wait:

				break;
			// Этот игрок должен начать подкидывать но может ли он это сделать ?
			// Проверяем карты в руке игрока и карты которые уже лежат на поле
			// Если в руке игрока нет карты значение которой есть у него в руке ход переходит другому игроку.
			case State.Throw:
				const uniqValuesOnField = new Set();
				this.field.getAllInOne().forEach(card => uniqValuesOnField.add(card.value));
				if(player.hand.some(card => [...uniqValuesOnField].includes(card.value))) {
					// Есть допустимые карты для того чтобы их подкинуть.
					console.error(`Игрок ${player.name} перешел в статус Throw`);
					return player;
				}
				// Пытаемся найти следующего игрока
				const nextPlayer = this.players.find(player => ![this.protectionPlayer.id, this.attackPlayer.id].includes(player.id));
				if(nextPlayer) {
					player.setState(State.Wait);
					nextPlayer.setState(State.Throw); // Задаём следующему игроку статус "Подбрасывает карты"
					return this.getNextPlayer(nextPlayer);
				}

				console.log(this.field)
				console.log(player)
				throw new Error('!!!TODO!!!');
				return  '12312312312312;'
				break;
			case State.Attack:

				break;
			case State.Protection:

				break;
			case State.End:

				break;
		}

		return player;
	}

	/**
	 * Ход игрока, игрок выкладывает карты на поле.
	 */
	attack(data = []) {
		if(this.field.attack.length) {
			throw new Error('ATTACK_UNAVAILABLE')
		}
		const cards = data.map(item => Card.getByString(item));
		if(!cards.length) {
			throw new Error('ATTACK_NO_CARD');
		}
		// Кол-во переданных карт не может превышать чисто карт в руке у защиты.
		if(cards.length > this.protectionPlayer.hand.length) {
			throw new Error('ATTACK_PROTECTION_PLAYER_HAVE_LESS_CARD')
		}
		// Все карты должны быть одного значения
		if(cards.some(card => card.value !== cards[0].value)) {
			throw new Error('ATTACK_SUIT_NOT_EQUALS');
		}
		//Указанные карты должны быть в руке у игрока.
		if(!Player.cardsInHand(this.currentPlayer, cards)) {
			throw new Error('ATTACK_CARD_NOT_IN_HAND');
		}
		// Кладём карты на стол.
		this.field.putAttack(this.currentPlayer, cards);
		// Передаём ход другому игроку
		this.currentPlayer.setState(State.Throw);
		// Передаем ход стороне защиты.
		this.currentPlayer = this.protectionPlayer;
	}

	/**
	 * Бьёт текущие карты на поле
	 */
	hit(data) {
		if(!this.field.attack.length) {
			throw new Error('HIT_UNAVAILABLE');
		}
		if(!data || !data.length) {
			throw new Error('HIT_NO_CARD');
		}
		const cards = data.map(item => Card.getByString(item));
		// кол-во переданных карт должно быть равно кол-ву карт на столе
		if(cards.length !== this.field.attack.length) {
			throw new Error('HIT_CARD_COUNT_NOT_EQUAL_FIELD_COUNT');
		}
		// Переданные карты должны находится у игрока в руке.
		if(!Player.cardsInHand(this.currentPlayer, cards)) {
			throw new Error('HIT_CARD_NOT_IN_HAND');
		}
		// Карты могут быть побиты в том случае если все переданные карты той же масти но старше по значению или могут быть побиты козырем.
		cards.forEach((card, index) => {
			if(!Card.isOlderCard(this.field.attack[index], card, this.deck.trump)) {
				throw new Error('HIT_CANT_FIGHT');
			}
		});
		this.field.putProtection(this.currentPlayer, cards);
		this.currentPlayer.setState(State.Wait);
		// Передаем ход атакующей стороне.
		this.currentPlayer = this.attackPlayer;
	}

	/**
	 * Игрок пасует, пропускает ход, берёт карты.
	 */
	pass() {
		console.log('pass')
	}

	/**
	 * Игрок подкидывает карты на поле
	 * Подкидывать можно до 6 карт
	 */
	throw(data) {
		const allCardsOnField = this.field.getAllInOne();
		if(!allCardsOnField.length) {
			throw new Error('THROW_UNAVAILABLE');
		}
		if(this.field.attack.length !== this.field.protection.length) {
			throw new Error('THROW_ALL_ATTACK_CARDS_SHOULD_BE_PROTECTION')
		}
		const cards = data.map(item => Card.getByString(item));
		const values = this.field.getValuesCards();
		//Указанные карты должны быть в руке у игрока.
		if(!Player.cardsInHand(this.currentPlayer, cards)) {
			throw new Error('ATTACK_CARD_NOT_IN_HAND');
		}
		if(cards.some(card => !values.includes(card.value))) {
			throw new Error('THROW_UNAVAILABLE_VALUE_CARD');
		}
		// Сумма подкинутых карты и карт на столе не должны быть больше 6ти
		// TODO: в первый ход вообще 5.
		if(this.field.attack.length + cards.length > 6) {
			throw new Error('THROW_MAX_ALLOWABLE_CARDS_ON_FILED')
		}
		// Кладём карты на стол.
		this.field.putAttack(this.currentPlayer, cards);
		// Передаём ход другому игроку
		this.currentPlayer.setState(State.Wait);
		// Передаем ход стороне защиты.
		this.currentPlayer = this.protectionPlayer;
	}

	/**
	 * Закончить свой ход. Передаёт право подкидывать другому игроку.
	 * Игрок пасует, пропускает ход, берёт карты.
	 */
	end() {

	}
}

module.exports = Fool;
