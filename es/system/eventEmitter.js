/**
 * @description 事件发布器
 * @author Dizzy L
 */
class EventEmitter {
	constructor() {
		this.subs = {};
	}
	on(event, cb) {
		(this.subs[event] || (this.subs[event] = [])).push(cb);
	}
	once(event, onceCb) {
		let cb = (...args) => {
			onceCb(...args);
			this.off(event, onceCb);
		};
		this.on(event, cb);
	}
	off(event, offCb) {
		if (this.subs[event]) {
			let index = this.subs[event].findIndex(cb => cb === offCb);
			if (index !== -1) this.subs[event].splice(index, 1);
			if (!this.subs[event].length) delete this.subs[event];
		}
	}
}
const eventEmitter = new EventEmitter();
module.exports = eventEmitter;
