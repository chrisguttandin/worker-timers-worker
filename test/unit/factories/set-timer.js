import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSetTimer } from '../../../src/factories/set-timer';

describe('createSetTimer()', () => {
    let identifiersAndResolvers;
    let performance;
    let setTimeout;
    let setTimeoutCallback;
    let setTimer;
    let timeoutId;

    beforeEach(() => {
        identifiersAndResolvers = new Map();
        performance = { now: vi.fn() };
        setTimeout = vi.fn();
        setTimeoutCallback = vi.fn();
        timeoutId = Math.floor(Math.random() * 1000);

        setTimer = createSetTimer(identifiersAndResolvers, performance, setTimeout, setTimeoutCallback);

        performance.now.mockReturnValue(1 + Math.floor(Math.random() * 1000));
        setTimeout.mockReturnValue(timeoutId);
    });

    describe('setTimer()', () => {
        let delay;
        let then;
        let timerId;

        beforeEach(() => {
            delay = 1000 + Math.floor(Math.random() * 1000);
            then = vi.fn();
            timerId = Math.floor(Math.random() * 1000);
        });

        it('should call setTimeout() with setTimeoutCallback(), the delay, and the expected parameters', () => {
            setTimer(delay, timerId);

            expect(setTimeout).to.have.been.calledOnceWith(
                setTimeoutCallback,
                delay,
                performance.now() + delay,
                identifiersAndResolvers,
                identifiersAndResolvers.get(timerId)[1],
                timerId
            );
        });

        it('should derive the expected time from the clock of the worker only', () => {
            performance.now.mockReturnValue(5000);

            setTimer(delay, timerId);

            expect(setTimeout.mock.calls[0][2]).to.equal(5000 + delay);
        });

        for (const [description, invalidDelay] of [
            ['Infinity', Number.POSITIVE_INFINITY],
            ['-Infinity', Number.NEGATIVE_INFINITY],
            ['NaN', Number.NaN],
            ['a negative number', -1 - Math.floor(Math.random() * 1000)]
        ]) {
            it(`should schedule a timer with a delay of 0 when the delay is ${description}`, () => {
                setTimer(invalidDelay, timerId);

                expect(setTimeout).to.have.been.calledOnceWith(
                    setTimeoutCallback,
                    0,
                    performance.now(),
                    identifiersAndResolvers,
                    identifiersAndResolvers.get(timerId)[1],
                    timerId
                );
            });
        }

        it('should clamp the delay passed to setTimeout() to the maximum supported by the native implementation', () => {
            const hugeDelay = 2147483647 + 1000;

            setTimer(hugeDelay, timerId);

            expect(setTimeout).to.have.been.calledOnceWith(
                setTimeoutCallback,
                2147483647,
                performance.now() + hugeDelay,
                identifiersAndResolvers,
                identifiersAndResolvers.get(timerId)[1],
                timerId
            );
        });

        it('should add an entry with the given timerId', () => {
            setTimer(delay, timerId);

            const identifiersAndResolver = identifiersAndResolvers.get(timerId);
            const [, resolvSetResponseResultPromise] = identifiersAndResolver;

            expect(resolvSetResponseResultPromise).to.be.a('function');
            expect(identifiersAndResolver).to.deep.equal([timeoutId, resolvSetResponseResultPromise]);
        });

        it('should return an unresolved promise', () => {
            const { promise, resolve } = Promise.withResolvers();

            setTimer(delay, timerId).then(then);

            globalThis.setTimeout(() => {
                expect(then).to.have.not.been.called;

                resolve();
            }, 100);

            return promise;
        });

        it('should resolve the returned promise when calling resolvSetResponseResultPromise()', async () => {
            setTimer(delay, timerId).then(then);

            const [, resolvSetResponseResultPromise] = identifiersAndResolvers.get(timerId);
            const value = 'a fake value';

            resolvSetResponseResultPromise(value);

            expect(then).to.have.not.been.called;

            await Promise.resolve();

            expect(then).to.have.been.calledOnceWith(value);
        });
    });
});
