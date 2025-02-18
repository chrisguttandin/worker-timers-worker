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

            it('should resolve to true', async () => {
                expect(await clearTimer(timerId)).to.be.true;
            });
        });

        describe('without a running timer', () => {
            let timerId;

            beforeEach(() => {
                timerId = 21;
            });

            it('should resolve to false', async () => {
                expect(await clearTimer(timerId)).to.be.false;
            });
        });
    });
});
