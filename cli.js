'use strict';

const START_COMMAND = '/';
const [, , ...players] = process.argv;
const Fool = require('./classes/Fool');
const Card = require('./classes/Card');
const {State} = require('./classes/PlayerState');

process.stdin.resume();
process.stdin.setEncoding('utf-8');


const commands = {
	'help': {
		description: `Отображает доступные команды игры`,
		example: '\x1b[32m/help\x1b[0m'
	},
	// Ход. Перечисляет какими картами ходит.
	'attack': {
		description: `Пойти с перечисленных карт`,
		example: '\x1b[32m/attack \x1b[34mC:10 C:6 C:A\x1b[0m'
	},
	// Бью. Перечисляет карты которыми собирается бить
	'hit': {
		description: `Отбиться перечисленными картами`,
		example: '\x1b[32m/hit \x1b[34mD:A D:7 S:A\x1b[0m'
	},
	// Закончить свой ход. Отказаться от подкидывания карты
	'end': {
		description: `Отказаться от подкидывания карт в атакующую сторону поля. Ход переходит следующему игроку`,
		example: '\x1b[32m/end\x1b[0m'
	},
	// Подкидываю. Подкидывает карту из руки в зону атакующих карт
	'throw': {
		description: `Подкинуть карту значение которой уже есть на поле`,
		example: '\x1b[32m/throw \x1b[34mD:A D:7 S:A\x1b[0m'
	},
	// Пропуск. (не чем бить или тактический ход)
	'pass': {
		description: `Пропуск хода, забрать карты с кона`,
		example: '\x1b[32m/pass\x1b[0m'
	},
	// Отображается вся игровая информация о текущей игре.
	'debug': {
		description: `Для разработчиков`,
		example: '\x1b[32m/debug\x1b[0m'
	},
};
const errors = {
	WRONG_SUIT_TYPE_CARD: `Неверно передана масть карты. Доступны: ${Object.keys(Card.suits)}`,
	ATTACK_NO_CARD: `Передайте карты в формате: ${commands.attack.example}`,
	ATTACK_SUIT_NOT_EQUALS: `В свой ход можно пойти только картами одной масти`,
	ATTACK_CARD_NOT_IN_HAND: `Указанной карты нет в вашей руке`,
	ATTACK_UNAVAILABLE: `Используйте команду \x1b[32m/hit\x1b[33m чтобы отбится или \x1b[32m/pass\x1b[33m чтобы пропустить ход\x1b[0m`,
	ATTACK_PROTECTION_PLAYER_HAVE_LESS_CARD: 'Нельзя атаковать большим кол-вом карт чем есть у защищающегося игрока в руке',
	HIT_UNAVAILABLE: 'Нельзя атаковать сейчас',
	HIT_NO_CARD: 'Положите карты которыми хотите побить карты на поле',
	HIT_CARD_COUNT_NOT_EQUAL_FIELD_COUNT: 'Кол-во переданных карт не равно кол-ву карт на поле',
	HIT_CANT_FIGHT: 'Переданными картами нельзя побить карты на поле',
	HIT_CARD_NOT_IN_HAND: `Указанной карты нет в вашей руке`,
	THROW_UNAVAILABLE: `Сейчас нельзя подкидывать карты`,
	THROW_ALL_ATTACK_CARDS_SHOULD_BE_PROTECTION: `Все карты на поле должны быть побиты`,
	THROW_UNAVAILABLE_VALUE_CARD: `Нельзя подкинуть карту значение которой нет на поле`,
	THROW_CARD_LIMIT_EXCEEDED: `Нельзя подкинуть больше карт чем у игрока защиты в руке`,
	THROW_MAX_ALLOWABLE_CARDS_ON_FILED: `Число подкидываемых карт и карт на столе не может превышать 6`,
	GAME_OVER: `Игра окончена`
};

// process.stdin.on('end', _ => {
// 	inputString = inputString.trim().split('\n').map(string => {
// 		return string.trim();
// 	});
// 	console.log('end: ', inputStdin);
// });

// console.log({players})

const debug = [];

const game = new Fool(players);
// const game = Fool.load(require(`./tests/data/rounds/0/31`).before); // FROM TEST

function showView() {
	console.log(game.log());
	console.clear();
	console.log('\x1b[34mХод: \x1b[0m', game.currentPlayer.name);
	console.log('\x1b[34mКозырь: \x1b[0m', game.deck.trump);
	console.log('\x1b[34mКарты атаки: \x1b[0m', game.field.attack.map(card => card.toString()));
	console.log('\x1b[34mКарты защиты: \x1b[0m', game.field.protection.map(card => card.toString()));
	console.log('\x1b[34mКол-во карт у игрока защиты: \x1b[0m', game.protectionPlayer.hand.length);
	console.log('\x1b[34mКарты в руке: \x1b[0m', game.currentPlayer.hand.sort(Card.sortBySeniority()).map(card => card.toString()));
	switch (game.currentPlayer.state) {
		case State.Throw:
			console.log('Чтобы сделать ход: \x1b[32m/throw \x1b[34m<Card> <Card> ... или закончите свой ход: \x1b[32m/end');
			break;
		case State.Attack:
			console.log('Чтобы сделать ход: \x1b[32m/attack \x1b[34m<Card> <Card> ...');
			break;
		case State.Protection:
			console.log('Чтобы сделать ход: \x1b[32m/hit \x1b[34m<Card> <Card> ... или чтобы сдаться \x1b[32m/pass');
			break;
		default:
			console.error('default');
			break;
	}
	console.log('\x1b[0m') //Color - reset;
}

function showHelp(keys = Object.keys(commands)) {
	keys.forEach(key => {
		console.log(`${`\x1b[32m/${key}\x1b[0m`.padEnd(18)}${` - ${commands[key].description}.`.padEnd(40)}\x1b[33m Пример: ${commands[key].example}\x1b[0m`);
	})
}

process.stdin.on('data', inputStdin => {
	const comKeys = Object.keys(commands);
	try {
		const executed = comKeys.some((command, i) => {
			const fullComm = `${START_COMMAND}${command}`;
			if (!inputStdin.startsWith(fullComm)) {
				return false;
			}
			// Отрезаем из строки команду и достаём только переданные аргументы.
			const data = inputStdin
				.replace(`${fullComm} `, '')
				.replace('\n', '')
				.split(' ')
				.filter(Boolean)
				.map(val => val.toString().toUpperCase());
			switch (command) {
				case 'help':
					showHelp(Object.keys(commands));
					break;
				case 'attack':
				case 'hit':
				case 'pass':
				case 'throw':
				case 'end':
					const arr = [];
					arr.push(game.zip());
					arr.push({
						command,
						"args": [data],
					});

					game[command](data);

					arr.push(game.zip());
					debug.push(arr);
					break;
				case 'debug':
					console.log(JSON.stringify(debug));
					return true;
					break;
			}
			showView();
			return true;
		});

		if (!executed) {
			showView();
			console.log('\x1b[31mERROR:\x1b[33m Неизвестная команда. Используйте \x1b[32m/help \x1b[33mдля помощи\x1b[0m');
		}
	} catch (err) {
		if(err.message === 'GAME_OVER') {
			console.log(`\x1b[31m${errors.GAME_OVER}! Игрок:\x1b[33m ${game.players.find(pl => pl.hand.length).name}\x1b[31m проиграл!\x1b[0m`);
			process.exit(0);
			return;
		}
		if (errors[err.message]) {
			showView();
			console.log(`\x1b[31mERROR:\x1b[33m ${errors[err.message]}\x1b[0m`);
			return false;
		}
		console.log(err);
	}
	// process.exit(0);
});

showView();

