class Message {
	constructor(type, data) {
		if(!Object.keys(Message.TYPES).includes(type)){
			throw new Error('MESSAGE_UNAVAILABLE');
		}
		this.type = type;
		this.data = data;
	}

	static ROOM_STATE(data) {
		return new Message(Message.TYPES.ROOM_STATE, data);
	}

	static ROOM_JOINED(data) {
		return new Message(Message.TYPES.ROOM_JOINED, data);
	}

	static ROOM_WAIT(data) {
		return new Message(Message.TYPES.ROOM_WAIT, data);
	}

	static ERROR(data) {
		return new Message(Message.TYPES.ERROR, data);
	}

	static get TYPES() {
		return {
			ROOM_STATE: 'ROOM_STATE', // Текущее игровое состояние в комнате
			ROOM_JOINED: 'ROOM_JOINED', // Присоединился к комнате
			ROOM_WAIT: 'ROOM_WAIT', // Ожидание других игроков
			ERROR: 'ERROR', // Ошибка
		}
	}
}

module.exports = Message;
