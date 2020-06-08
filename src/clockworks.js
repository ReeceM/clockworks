import {
	version
} from "../package.json";
import workerFile from './worker';

/**
 * Creates and manage web worker timer section.
 *
 * @author ReeceM
 * @see https://github.com/reecem/clockworks
 * @version 0.1.1
 */
export default class ClockWorks {
	version = version
	/**
	 * Create a new list of timers
	 * @param {Array} timers the list of timers to install
	 */
	constructor(_timers = []) {
		this.timers = _timers;

		if (window.Worker) {
			this.startWorker();
		} else {
			this.spawnLocalTimers(_timers);
		}

		Array.prototype.hasTimer = function (name) {
			return this.findIndex(timer => { return timer.name == name });
		}

		Object.defineProperty(Array.prototype, 'hasTimer', {
			configurable: false,
		})

		return this;
	}

	/**
	 * Add timers to the list.
	 *
	 * @param {Object} timer
	 * @param {String} timer.name
	 * @param {Number} timer.time
	 * @param {Function} timer.callback
	 *
	 * @return {Number} the index of the timer on the stack
	 */
	push(timer) {
		var index = this.timers.push(timer);

		if (!this.timers.hasTimer(timer.name)) {
			throw new Error('Timer does exists already');
		}

		this.worker.postMessage({
			type: 'TIMER',
			timer: {
				name: timer.name,
				time: timer.time,
				index: index - 1
			}
		});

		return index;
	}

	/**
	 * Remove timer from the stack
	 *
	 * @param {String} timer this is the timer name
	 */
	pull(timer) {
		if (!this.timers.hasTimer(timer)) {
			throw new Error('Timer Does not exist');
		}

		this.worker.postMessage({
			type: 'REMOVE',
			timer: {
				name: timer
			},
		})

		this.timers = this.timers.filter((timersTimer, index) => {
			console.log(timersTimer);
			return timersTimer.name != timer;
		});
	}

	/**
	 * The timers to start in the external workers
	 *
	 * @param {Array} timers list of timers
	 */
	startWorker() {
		var blob = new Blob([`(${workerFile.toString()})();`], { type: 'text/javascript' });
		this.worker = new Worker(window.URL.createObjectURL(blob));

		// this.worker = new Worker('../dist/worker.js');
		this.worker.onmessage = this.handleWorkerMessages.bind(this);

		if (this.timers.length >= 1) {
			var newTimers = this.timers.reduce((taggedTimers, curr, index) => {
				taggedTimers.push({
					name: curr.name,
					time: curr.time,
					index: index
				});
				return taggedTimers;
			}, [])

			this.worker.postMessage({
				type: 'LIST',
				timers: newTimers
			});
		}

	}

	handleWorkerMessages(message) {
		if (!message.data) {
			console.debug('Worker sending blank messages...');
			return;
		}

		switch (message.data.type) {
			case 'STATUS':
				console.log(message.data.message)
				break;
			case 'TIMER':
				const index = message.data.timer.index;
				try {
					this.timers[index].callback(message.data);
				} catch (error) {
					console.error(error);
				}
				break;
			default:
				console.debug(message.data);
				break;
		}
	}

	/**
	 * Starts the local system timers
	 */
	spawnLocalTimers(timers) {
		// timers.forEach((timer, index) => {
		// 	const intervalName = `${timer.name}-${index}`;
		// 	console.info(intervalName);
		// 	clearInterval(this.timers[intervalName]);
		// 	this.timers[intervalName] = setInterval(() => { timer.callback('internal') }, timer.time);
		// 	console.log(this.timers[intervalName])
		// });
	}
}
