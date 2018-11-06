'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
const isStar = false;

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    let events = new Map();

    return {

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Object}
         */
        on: function (event, context, handler) {
            if (!events.has(event)) {
                events.set(event, []);
            }
            const eventValue = events.get(event);
            eventValue.push(
                {
                    context: context,
                    handler: handler
                });
            events.set(event, eventValue);

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Object}
         */
        off: function (event, context) {
            [...events.keys()].filter(nameEvent => {
                return nameEvent.startsWith(event + '.') || nameEvent === event;
            })
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
            while (event) {
                allEventsNames.push(event);
                event = event.substring(0, event.lastIndexOf('.'));
            }
            allEventsNames.filter(nameEvent => events.get(nameEvent))
                .forEach(nameEvent => {
                    events.get(nameEvent).forEach(
                        ({ context, handler }) => {
                            handler.call(context);
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
         */
        several: function (event, context, handler, times) {
            console.info(event, context, handler, times);
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @param {Number} frequency – как часто уведомлять
         */
        through: function (event, context, handler, frequency) {
            console.info(event, context, handler, frequency);
        }
    };
}

module.exports = {
    getEmitter,

    isStar
};
