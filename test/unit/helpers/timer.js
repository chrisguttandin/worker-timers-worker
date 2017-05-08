import { clearScheduledInterval, clearScheduledTimeout, scheduleInterval, scheduleTimeout } from '../../../src/helpers/timer';

describe('timer', () => {

    describe('clearScheduledInterval()', () => {

        describe('with a scheduled interval', () => {

            let id;
            let now;

            beforeEach(() => {
                id = 17;
                now = 1000000;

                scheduleInterval(1000, id, now);
            });

            it('should clear the interval', () => {
                clearScheduledInterval(id);
            });

        });

        describe('without a scheduled interval', () => {

            let id;

            beforeEach(() => {
                id = 21;
            });

            it('should throw an error', () => {
                expect(() => clearScheduledInterval(id)).to.throw(Error, `There is no interval scheduled with the given id "${ id }".`);
            });

        });

    });

    describe('clearScheduledTimeout()', () => {

        describe('with a scheduled timeout', () => {

            let id;
            let now;

            beforeEach(() => {
                id = 17;
                now = 1000000;

                scheduleTimeout(1000, id, now);
            });

            it('should clear the timeout', () => {
                clearScheduledTimeout(id);
            });

        });

        describe('without a scheduled timeout', () => {

            let id;

            beforeEach(() => {
                id = 21;
            });

            it('should throw an error', () => {
                expect(() => clearScheduledTimeout(id)).to.throw(Error, `There is no timeout scheduled with the given id "${ id }".`);
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
