'use strict';

const {v4: uuidv4} = require('uuid');
const {random} = require('../../utils');
const Fool = require('../../classes/Fool');
const Message = require('../classes/Message');
const {Command, State} = require('../../classes/PlayerState');

const sec = 1000;
const TIME_WAIT = 5 *  sec;
const TIMER_STEP = 100;

class Room {
	/**
	 * @param size {Number} - Максимальный размер комнаты
	 */
	constructor(size) {
		this.id = `Room:${uuidv4()}`;
		this.clients = [];
		this.size = size;
		this.status = 'Wait';
		this.time = 0;
		this.game = undefined; // Когда в комнате начнется игра тут, появится объект игры.

		process.nextTick(() => {
			this.interval = setInterval(() => {
				this.waitOtherClients();
			}, TIMER_STEP);
		});
	}

	waitOtherClients() {
		const time = TIME_WAIT - this.time;
		this.time += TIMER_STEP;
		if(time < 0) {
			console.log('Stop: ', this.clients);
			this.stopWait();
		}
		// Время ожидания еще есть.
		console.log({time})
		if(time > 0 && this.clients.length === this.size) {
			this.startGame();
			return;
		} else if (time <= 0 && this.clients.length >= Room.minSize){
			this.startGame();
			return;
		}
		this.broadcast((client) => Message.ROOM_WAIT(time));
	}

	stopWait() {
		this.status = 'Closed';
		clearInterval(this.interval);
	}

	static get minSize() {
		return 2;
	}
	static get maxSize() {
		return 4;
	}

	get isFree() {
		return this.size > this.clients.length;
	}

	/**
	 * Добавляем игрока в комнату
	 * @param client {Client} - Игрок
	 */
	add(client) {
		if(!this.isFree) {
			throw new Error('MAX_LIMIT_EXCEEDED');
		}
		this.clients.push(client);
		this.broadcast((cl) => Message.ROOM_JOINED({
			room: this.getPublicInfo(),
			clients: this.clients.filter(c => c.id !== cl.id).map(client => client.getPublicInfo())
		}));
	}

	startGame() {
		this.stopWait();
		console.log('Start Game;', this.id);
		this.game = new Fool(this.clients.map(client => client.id));

		this.status = 'InGame';
		this.sendState();
	}

	static getNewRoom(size = random(Room.minSize, Room.maxSize)) {
		return new Room(size);
	}

	getPlayerByClient(client) {
		return this.game.players.find(player => player.name === client.id);
	}

	getPublicGameInfo(client) {
		const player = this.getPlayerByClient(client);
		const isCardOnField = Boolean(this.game.field.getAllInOne().length) || player.state === State.Attack;
		return {
			room: this.getPublicInfo(),
			field: {
				attack: this.game.field.attack,
				protection: this.game.field.protection,
			},
			game: {
				trump: this.game.deck.trump,
				players: this.game.players.filter(pl => player.id !== pl.id).map(player => player.getPublicInfo()),
			},
			player,
			command: {
				available: isCardOnField ? Command.getAvailable(player.state) : [],
				canDo: this.game.currentPlayer.id === player.id,
			}
		}
	}

	/**
	 * Отправляем всем игрокам текущее состояние игры
	 * относительно игрока которому отправляем.
	 */
	sendState() {
		this.clients.forEach(client => {
			client.send(Message.ROOM_STATE(this.getPublicGameInfo(client)));
		});
	}

	broadcast(fn) {
		this.clients.forEach(client => {
			const message = fn(client);
			client.send(message)
		});
	}

	onCommand(client, {command, cards}) {
		const player = this.getPlayerByClient(client);
		try {
			if(!Command.getAvailable(player.state).includes(command)){
				throw new Error('UNAVAILABLE_COMMAND');
			}
			this.game[command](cards);
		} catch(err) {
			client.send(Message.ERROR({error: err.message}));
		}
		// Отправляем новое состояние игры всем
		this.sendState();
	}

	getPublicInfo() {
		return {
			id: this.id,
			size: this.size,
			status: this.status,
		};
	}
}

module.exports = Room;
