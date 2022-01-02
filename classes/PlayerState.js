const {firstCharUp} = require('../utils/index');

class State {
	constructor(value = State.Wait) {
		if(typeof value !== 'string') {
			throw new Error('WRONG_TYPE_STATE');
		}
		const state = State[firstCharUp(value)]
		if(!state) {
			throw new Error('WRONG_STATE');
		}
		this.state = state;
	}
	static get Attack () {
		return 'attack';
	}
	static get Throw () {
		return 'throw';
	}
	static get Protection () {
		return 'protection';
	}
	static get Wait () {
		return 'wait';
	}
	static get End () {
		return 'end';
	}
}

class Command {
	static get Attack() {
		return 'attack';
	}

	static get Hit() {
		return 'hit';
	}

	static get End() {
		return 'end';
	}

	static get Throw() {
		return 'throw';
	}

	static get Pass() {
		return 'pass';
	}

	static get commands() {
		return [Command.Attack, Command.Hit, Command.End, Command.Throw, Command.Pass];
	}


	static get available() {
		return {
			[State.Attack]: [Command.Attack],					// Игрок выкладывает карты на поле
			[State.Throw]: [Command.Throw, Command.End], 		// Подкидывает отбивающемуся игроку карты на поле
			[State.Protection]: [Command.Hit, Command.Pass], 	// Игрок обивается от карт лежащих на столе.
			[State.Wait]: [],
			[State.End]: [],
		};
	}

	static getAvailable(state) {
		return Command.available[state];
	}
}

class PlayerState extends State {
	constructor(value) {
		super(value);
	}

	setState(newState) {
		Object.assign(this, new PlayerState(newState));
	}

	static get flow () {
		return {
			// Атакующий
			[State.Attack]: [State.Throw],					// Игрок выкладывает карты на поле
			[State.Throw]: [State.Wait, State.End], 		// Подкидывает отбивающемуся игроку карты на поле
			// Защищающийся
			[State.Protection]: [State.Wait, State.End], 	// Игрок обивается от карт лежащих на столе.
			[State.Wait]: [									// Игрок ждёт пока ему подкинут карты если такие есть.
				State.Protection,
				State.Throw,
				State.End
			],
			// Игровой шаг.
			[State.End]: [State.Attack] 					// Игра раздаёт карты, первый получает карты тот кто первый нападал. (Attack)
		}
	}
}

module.exports = {
	State,
	Command,
	PlayerState,
};
