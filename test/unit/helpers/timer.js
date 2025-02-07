import { clearScheduledInterval, clearScheduledTimeout, scheduleInterval, scheduleTimeout } from '../../../src/helpers/timer';

describe('timer', () => {
    describe('clearScheduledInterval()', () => {
        describe('with a scheduled interval', () => {
            let now;
            let timerId;

            beforeEach(() => {
                now = 1000000;
                timerId = 17;

                scheduleInterval(1000, 18, timerId, now);
            });

            it('should return true', () => {
                expect(clearScheduledInterval(timerId)).to.be.true;
            });
        });

        describe('without a scheduled interval', () => {
            let timerId;

            beforeEach(() => {
                timerId = 21;
            });

            it('should return false', () => {
                expect(clearScheduledInterval(timerId)).to.be.false;
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

                scheduleTimeout(1000, 18, timerId, now);
            });

            it('should return true', () => {
                expect(clearScheduledTimeout(timerId)).to.be.true;
            });
        });

        describe('without a scheduled timeout', () => {
            let timerId;

            beforeEach(() => {
                timerId = 21;
            });

            it('should return false', () => {
                expect(clearScheduledTimeout(timerId)).to.be.false;
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
