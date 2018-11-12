'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = true;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = new Map();

    return {

        /**
         * Подписаться на событие
         * @param {String} eventName
         * @param {Object} context
         * @param {Function} handler
         * @param {Function} additional
         * @returns {Object}
         */
        on: function (eventName, context, handler, additional = { times: 0, frequency: 0 }) {
            if (!events.has(eventName)) {
                events.set(eventName, []);
            }
            const eventValue = events.get(eventName);
            eventValue.push({
                context: context,
                handler: handler,
                times: additional.times,
                frequency: additional.frequency,
                callsCount: 0
            });
            events.set(eventName, eventValue);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            Array.from(events.keys()).filter(eventName =>
                eventName.startsWith(event + '.') || eventName === event)
                .forEach(
                    nameEvent => {
                        let currentsEvents = events.get(nameEvent);
                        currentsEvents = currentsEvents.filter(
                            (existedEvent) => context !== existedEvent.context
                        );
                        events.set(nameEvent, currentsEvents);
                    }
                );

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Object}
         */
        emit: function (event) {
            const allEventsNames = [];
            let prevEventName = '';
            for (let partEventName of event.split('.')) {
                if (prevEventName !== '') {
                    prevEventName += '.';
                }
                prevEventName += partEventName;
                allEventsNames.unshift(prevEventName);
            }
            allEventsNames.filter(nameEvent => events.get(nameEvent))
                .forEach(eventName => {
                    events.get(eventName).forEach(
                        ({ context, handler, times, frequency, callsCount }, index) => {
                            if ((times === 0 || callsCount < times) &&
                                (frequency === 0 || callsCount % frequency === 0)) {
                                handler.call(context);
                            }
                            events.get(eventName)[index].callsCount ++;
                        });
                });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} times – сколько раз получить уведомление
         * @returns {Object}
         */
        several: function (event, context, handler, times) {
            this.on(event, context, handler, { times, frequency: 0 });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         * @returns {Object}
         */
        through: function (event, context, handler, frequency) {
            this.on(event, context, handler, { times: 0, frequency });

            return this;
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
