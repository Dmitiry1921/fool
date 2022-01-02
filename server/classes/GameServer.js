'use strict';

const Room = require('./Room');

class GameServer {
	constructor() {
		this.rooms = new Map();
	}

	/**
	 * Возвращает доступную комнату
	 * @return {Room | undefined}
	 */
	findFreeRoom() {
		return [...this.rooms.values()].find(room => room.isFree && room.status === 'Wait');
	}

	/**
	 * Создаёт новую комнату случайного размера
	 * Добавляем ее в игровой сервер
	 * @return {Room}
	 */
	getNewRoom() {
		const room = Room.getNewRoom();
		this.rooms.set(room.id, room);
		return room;
	}

	/**
	 * Добавляем клиента в комнату.
	 * @param client {Client}
	 */
	addClient(client) {
		// Выполняем поиск пустых комнат
		let room = this.findFreeRoom();
		// Если не нашли создаем новую комнату
		if(!room) {
			room = this.getNewRoom();
		}
		// Указываем id комнаты в которой находится клиент чтобы в будущем транслировать события клиента только в эту комнату.
		client.setRoom(room.id);
		// Добавляем игрока в комнату
		room.add(client);

		console.log(`${client.id} ===> ${room.id}`);
	}

	removeClient(client) {
		console.log('TODO!!!')
	}

	onMessage(client, message) {
		switch (message.type) {
			case 'command':
				this.rooms.get(client.room).onCommand(client, message.data);
				break;
		}
	}
}

module.exports = new GameServer();
