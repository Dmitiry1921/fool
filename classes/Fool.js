'use strict';

const Game = require("./Game");
const Field = require("./Field");
const {State} = require("./PlayerState");
const Player = require('./Player');
const Deck = require('./Deck');
const Card = require('./Card');

class Fool extends Game {
	constructor(players, deckSize = 36) {
		super(players);
		this.minPlayers = 2;
		this.maxPlayers = 8;
		this.maxAttackCards = 6;
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

	/**
	 * @param data
	 * @param debug
	 * @return {Fool}
	 */
	static load(data, debug = true) {
		const game = new Fool(data.players.map(({name}) => name), data.deck.cards.size);
		game._attackPlayerId = data._attackPlayerId;
		game._protectionPlayerId = data._protectionPlayerId;
		game._currentPlayerId = data._currentPlayerId;
		game.players = data.players.map(player => new Player(player));
		game._firstAttackInRound = data._firstAttackInRound;
		game.deck = Deck.load(data.deck);
		game.field = Field.load(data.field);
		game.round = data.round;
		game._debug = debug;
		return game;
	}

	zip() {
		return {
			...this,
			_debug: undefined,
			players: this.players.map(player => ({...player, hand: player.hand.map(card => card.toString())})),
			deck: this.deck.zip(),
			field: this.field.zip(),
		}
	}

	/**
	 * Получить слепок игры.
	 * @return {string}
	 */
	log(...args) {
		if(this._debug){
			console.log(...args, JSON.stringify(this.zip()));
		}

	}

	/**
	 * Раздаём всем игрокам по 6 карт.
	 */
	distribution(players = this.players) {
		players.forEach((player) => {
		    if(player.hand.length < 6) {
		    	const card = this.deck.cards.shift();
		    	if(!card) {
		    		// Карты кончились к колоде, проверяем нет ли игрока без единой карты в руке.
		    		this.gameOver();
					return;
				}
				player.hand.push(card);
				this.distribution(players);
			}
		})
	}

	gameOver() {
		// В колоде нет карт, и у одного из игроков в руке нет карт игрок без карт победил.
		if(!this.deck.cards.length && this.players.some(player => player.hand.length === 0)) {
			throw Error('!!!! GAME OVER !!!')
		}
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
		first = new Player(first.zip());
		first.state = State.Attack;
		other[0].state = State.Protection;
		return [first, ...other];
	}

	getPlayerByName(name) {
		return this.players.find(player => player.name === name);
	}

	getThrowPlayer(startPlayer) {
		let player;
		if(startPlayer){
			player = startPlayer;
		} else {
			// Ищем игрока который не "Защищается" и не в статусе End
			player = this.players.find(player => (this.protectionPlayer.id !== player.id && player.state !== State.End));
		}

		if(!player) {
			return;
		}
		const uniqValuesOnField = new Set();
		this.field.getAllInOne().forEach(card => uniqValuesOnField.add(card.value));
		if(!player.hand.some(card => uniqValuesOnField.has(card.value))) {
			// Есть допустимые карты для того чтобы их подкинуть.
			console.error(`У игрока ${player.name} нет карт чтобы подкидывать => End.`);
			player.setState(State.End);
			return this.getThrowPlayer();
		}
		player.setState(State.Throw);
		return player;
	}

	/**
	 * @deprecated
	 * Возвращает id следующего игрока.
	 * @param player {Player}
	 */
	getNextPlayer(player) {

		// switch (player.state) {
		// 	// case State.Wait:
		// 	// 	console.log({player});
		// 	// 	this.field.getAllInOne().forEach(card => uniqValuesOnField.add(card.value));
		// 	// 	if(player.hand.some(card => uniqValuesOnField.has(card.value))) {
		// 	// 		// Есть допустимые карты для того чтобы их подкинуть.
		// 	// 		console.error(`Игрок ${player.name} перешел в статус Throw`);
		// 	// 		return player;
		// 	// 	}
		// 	// 	this.log('getNextPlayer.Wait')
		// 	// 	break;
		// 	// Этот игрок должен начать подкидывать но может ли он это сделать ?
		// 	// Проверяем карты в руке игрока и карты которые уже лежат на поле
		// 	// Если в руке игрока нет карты значение которой есть у него в руке ход переходит другому игроку.
		// 	// case State.Throw:
		// 	// 	this.field.getAllInOne().forEach(card => uniqValuesOnField.add(card.value));
		// 	// 	if(player.hand.some(card => uniqValuesOnField.has(card.value))) {
		// 	// 		// Есть допустимые карты для того чтобы их подкинуть.
		// 	// 		console.error(`Игрок ${player.name} перешел в статус Throw`);
		// 	// 		return player;
		// 	// 	}
		// 	// 	player.setState(State.End);
		// 	// 	// Пытаемся найти следующего игрока
		// 	// 	const nextPlayer = this.players.find(player => ![this.protectionPlayer.id, this.attackPlayer.id].includes(player.id) && player.state !== State.End);
		// 	// 	this.log({nextPlayer});
		// 	// 	if(nextPlayer) {
		// 	// 		nextPlayer.setState(State.Throw); // Задаём следующему игроку статус "Подбрасывает карты"
		// 	// 		this.log('===================================================================')
		// 	// 		const next = this.getNextPlayer(nextPlayer);
		// 	// 		this.log({next})
		// 	// 		return next;
		// 	// 	}
		// 	//
		// 	// 	this.log(this.field)
		// 	// 	this.log(player)
		// 	// 	throw new Error('!!!TODO!!!');
		// 	// 	return  '12312312312312;'
		// 	// 	break;
		// 	// case State.Attack:
		// 	// 	this.log('getNextPlayer.Attack')
		// 	// 	break;
		// 	// case State.Protection:
		// 	// 	this.log('getNextPlayer.Protection')
		// 	// 	break;
		// 	// case State.End:
		// 	// 	this.log('getNextPlayer.End')
		// 	// 	break;
		// }
		return player;
	}

	/**
	 * Ход игрока, игрок выкладывает карты на поле.
	 */
	attack(data = []) {
		if(this.field.attack.length) {
			throw new Error('ATTACK_UNAVAILABLE');
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
		// Проверяем окончание игры
		this.gameOver();
	}

	/**
	 * Бьёт текущие карты на поле
	 */
	hit(data) {
		if(!this.field.attack.length) {
			throw new Error('HIT_UNAVAILABLE');
		}
		if(this.field.attack.length === this.field.protection.length) {
			throw new Error('HIT_UNAVAILABLE');
		}
		if(!data || !data.length) {
			throw new Error('HIT_NO_CARD');
		}
		const cards = data.map(item => Card.getByString(item));
		// кол-во переданных карт должно быть равно кол-ву карт на столе
		if(cards.length !== (this.field.attack.length - this.field.protection.length)) {
			throw new Error('HIT_CARD_COUNT_NOT_EQUAL_FIELD_COUNT');
		}
		// Переданные карты должны находится у игрока в руке.
		if(!Player.cardsInHand(this.currentPlayer, cards)) {
			throw new Error('HIT_CARD_NOT_IN_HAND');
		}
		// Карты могут быть побиты в том случае если все переданные карты той же масти но старше по значению или могут быть побиты козырем.
		[...this.field.protection, ...cards].forEach((card, index) => {
			if(!Card.isOlderCard(this.field.attack[index], card, this.deck.trump)) {
				throw new Error('HIT_CANT_FIGHT');
			}
		});
		this.field.putProtection(this.currentPlayer, cards);
		if(this.field.isStrike(this.maxAttackCards)){
			this.strike();
			return;
		}
		this.currentPlayer.setState(State.Wait);
		const thrower = this.getThrowPlayer(this.attackPlayer);
		if(!thrower) {
			// Некому подкидывать, БИТО!
			this.strike();
			return;
		}
		// Передаем ход атакующей стороне.
		this.currentPlayer = thrower;
	}

	/**
	 * Игрок пасует, пропускает ход, берёт карты.
	 */
	pass() {
		if(!this.field.attack.length) {
			throw new Error('PASS_UNAVAILABLE')
		}
		// Игрок который не смог побить карты забирает все карты с поля в руку.
		this.currentPlayer.hand.push(...this.field.getAllInOne());
		this.field.clear(); // Очищаем игровое поле
		const other = this.players.filter(player => ![this.protectionPlayer.id, this.attackPlayer.id].includes(player.id))

		let attack;
		let protection;
		// Если 2 игрока
		if(this.players.length > 2) {
			attack = other[0];
			protection = this.players.find(player => this.protectionPlayer.id !== player.id);
		} else {
			attack = this.attackPlayer;
			protection = this.protectionPlayer;
		}
		this.distribution([this.firstAttackInRound, ...this.players.filter(plr => plr.id !== this.firstAttackInRound.id)]);
		this.nextRoundPlayers(attack, protection);
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
		if(!data || !data.length) {
			throw new Error('THROW_WRONG_CARD');
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
		// Переводим защищающегося игрока в статус Pro
		this.currentPlayer.setState(State.Protection);
	}

	/**
	 * Закончить свой ход. Передаёт право подкидывать другому игроку.
	 * Игрок пасует, пропускает ход, берёт карты.
	 */
	end() {
		this.currentPlayer.setState(State.End); // Игрок сообщает о том что он закончил свой ход.
		// Получаем первого игрока который ждем возможности пойти и не является игроком защиты в данный момент.
		const filtered = this.players.filter(player => player.state === State.Wait && this.protectionPlayer.id !== player.id);
		if(!filtered.length) {
			this.strike(); // БИТО!
			return;
		}
		this.currentPlayer = filtered[0];
		this.currentPlayer.setState(State.Throw);
	}

	/**
	 * Бито!
	 */
	strike() {
		this.field.strike();
		// Получаем игрока который первым ходил в этом раунде.
		const other = this.players.filter(player => player.id !== this.firstAttackInRound.id);
		let next;
		if(other.length > 1) {
			// выбираем следующего игрока из но не того который защищался.
			[next] = other.filter(player => player.id !== this.protectionPlayer.id);
		} else {
			// Если никого не осталось выбираем игрока который атаковал.
			next = this.attackPlayer;
		}

		this.distribution([this.firstAttackInRound, ...other]);
		this.nextRoundPlayers(this.protectionPlayer, next);
		this.log('STRIIIIKE !')
	}

	/**
	 * Задаёт пару игроков которые будут учавствовать в след игровом раунде.
	 * @param attackPlayer
	 * @param protectionPlayer
	 */
	nextRoundPlayers(attackPlayer, protectionPlayer) {
		this.attackPlayer = attackPlayer; 	// Атакующая сторона.
		this.attackPlayer.state = State.Attack; // Игрок атакует
		this.currentPlayer = this.attackPlayer; // Передаём ход игроку который отбивался.
		this.firstAttackInRound = this.currentPlayer; // Сохраняем его id как игрока который ходит первый в этом кругу.
		this.protectionPlayer = protectionPlayer;
		this.protectionPlayer.state = State.Protection;
		// Оставшиеся игроки ждут своей ход.
		const filtered = this.players.filter(player => ![this.protectionPlayer.id, this.attackPlayer.id].includes(player.id)).map(({id}) => (id));
		filtered.forEach(pId => {
			const player = this.players.find(player => pId === player.id);
			player.state = State.Wait;
		});
		this.round++;
	}
}

module.exports = Fool;
