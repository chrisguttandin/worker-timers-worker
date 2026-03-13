import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createClearTimer } from '../../../src/factories/clear-timer';

describe('createClearTimer()', () => {
    let clearTimer;
    let clearTimeout;
    let identifiersAndResolvers;

    beforeEach(() => {
        clearTimeout = vi.fn();
        identifiersAndResolvers = new Map();

        clearTimer = createClearTimer(clearTimeout, identifiersAndResolvers);
    });

    describe('clearTimer()', () => {
        let timerId;

        beforeEach(() => {
            timerId = Math.floor(Math.random() * 1000);
        });

        describe('with a running timer', () => {
            let resolveSetResponseResultPromise;
            let timeoutId;

            beforeEach(() => {
                resolveSetResponseResultPromise = vi.fn();
                timeoutId = Math.floor(Math.random() * 1000);

                identifiersAndResolvers.set(timerId, [timeoutId, resolveSetResponseResultPromise]);
            });

            it('should call clearTimeout() with the given timeoutId', async () => {
                await clearTimer(timerId);

                expect(clearTimeout).to.have.been.calledOnceWith(timeoutId);
            });

            it('should delete the entry with the given timerId', async () => {
                await clearTimer(timerId);

                expect(identifiersAndResolvers.has(timerId)).to.be.false;
            });

            it('should call resolveSetResponseResultPromise() with true', async () => {
                await clearTimer(timerId);

                expect(resolveSetResponseResultPromise).to.have.been.calledOnceWith(false);
            });

            it('should resolve to true', async () => {
                expect(await clearTimer(timerId)).to.be.true;
            });
        });

        describe('without a running timer', () => {
            it('should not call clearTimeout()', async () => {
                await clearTimer(timerId);

                expect(clearTimeout).to.have.not.been.called;
            });

            it('should resolve to false', async () => {
                expect(await clearTimer(timerId)).to.be.false;
            });
        });
    });
});
