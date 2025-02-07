import { computeDelayAndExpectedCallbackTime } from '../../../src/functions/compute-delay-and-expected-callback-time';
import { createClearScheduledTimeout } from '../../../src/factories/clear-scheduled-timeout';
import { createScheduleTimeout } from '../../../src/factories/schedule-timeout';
import { setTimeoutCallback } from '../../../src/functions/set-timeout-callback';

describe('createClearScheduledTimeout()', () => {
    let clearScheduledTimeout;
    let scheduleTimeout;

    beforeEach(() => {
        const scheduledTimeoutIdentifiers = new Map();

        clearScheduledTimeout = createClearScheduledTimeout(scheduledTimeoutIdentifiers);
        scheduleTimeout = createScheduleTimeout(computeDelayAndExpectedCallbackTime, scheduledTimeoutIdentifiers, setTimeoutCallback);
    });

    describe('clearScheduledTimeout()', () => {
        describe('with a scheduled timeout', () => {
            let now;
            let timerId;

            beforeEach(() => {
                now = 1000000;
                timerId = 17;

                scheduleTimeout(1000, timerId, 'timeout', now);
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
});
