import { computeDelayAndExpectedCallbackTime } from '../../../src/functions/compute-delay-and-expected-callback-time';
import { createClearScheduledInterval } from '../../../src/factories/clear-scheduled-interval';
import { createScheduleInterval } from '../../../src/factories/schedule-interval';
import { setTimeoutCallback } from '../../../src/functions/set-timeout-callback';

describe('createClearScheduledInterval()', () => {
    let clearScheduledInterval;
    let scheduleInterval;

    beforeEach(() => {
        const scheduledIntervalIdentifiers = new Map();

        clearScheduledInterval = createClearScheduledInterval(scheduledIntervalIdentifiers);
        scheduleInterval = createScheduleInterval(computeDelayAndExpectedCallbackTime, scheduledIntervalIdentifiers, setTimeoutCallback);
    });

    describe('clearScheduledInterval()', () => {
        describe('with a scheduled interval', () => {
            let now;
            let timerId;

            beforeEach(() => {
                now = 1000000;
                timerId = 17;

                scheduleInterval(1000, timerId, now);
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
});
