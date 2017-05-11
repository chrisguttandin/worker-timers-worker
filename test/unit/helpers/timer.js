import { clearScheduledInterval, clearScheduledTimeout, scheduleInterval, scheduleTimeout } from '../../../src/helpers/timer';

describe('timer', () => {

    describe('clearScheduledInterval()', () => {

        describe('with a scheduled interval', () => {

            let now;
            let timerId;

            beforeEach(() => {
                now = 1000000;
                timerId = 17;

                scheduleInterval(1000, timerId, now);
            });

            it('should clear the interval', () => {
                clearScheduledInterval(timerId);
            });

        });

        describe('without a scheduled interval', () => {

            let timerId;

            beforeEach(() => {
                timerId = 21;
            });

            it('should throw an error', () => {
                expect(() => clearScheduledInterval(timerId)).to.throw(Error, `There is no interval scheduled with the given id "${ timerId }".`);
            });

        });

    });

    describe('clearScheduledTimeout()', () => {

        describe('with a scheduled timeout', () => {

            let now;
            let timerId;

            beforeEach(() => {
                now = 1000000;
                timerId = 17;

                scheduleTimeout(1000, timerId, now);
            });

            it('should clear the timeout', () => {
                clearScheduledTimeout(timerId);
            });

        });

        describe('without a scheduled timeout', () => {

            let timerId;

            beforeEach(() => {
                timerId = 21;
            });

            it('should throw an error', () => {
                expect(() => clearScheduledTimeout(timerId)).to.throw(Error, `There is no timeout scheduled with the given id "${ timerId }".`);
            });

        });

    });

    describe('scheduleInterval()', () => {

        // @todo

    });

    describe('scheduleTimeout()', () => {

        // @todo

    });

});
