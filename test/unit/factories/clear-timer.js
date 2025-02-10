import { createClearTimer } from '../../../src/factories/clear-timer';

describe('createClearTimer()', () => {
    let clearTimer;
    let identifiersAndResolvers;

    beforeEach(() => {
        identifiersAndResolvers = new Map();

        clearTimer = createClearTimer(identifiersAndResolvers);
    });

    describe('clearTimer()', () => {
        describe('with a running timer', () => {
            let timerId;

            beforeEach(() => {
                timerId = 17;

                identifiersAndResolvers.set(timerId, [1, () => {}]);
            });

            it('should return true', () => {
                expect(clearTimer(timerId)).to.be.true;
            });
        });

        describe('without a running timer', () => {
            let timerId;

            beforeEach(() => {
                timerId = 21;
            });

            it('should return false', () => {
                expect(clearTimer(timerId)).to.be.false;
            });
        });
    });
});
