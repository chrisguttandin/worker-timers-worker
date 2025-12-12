import { beforeEach, describe, expect, it } from 'vitest';
import { spy, stub } from 'sinon';
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
        performance = { now: stub(), timeOrigin: Math.floor(Math.random() * 1000) };
        setTimeout = stub();
        setTimeoutCallback = spy();
        timeoutId = Math.floor(Math.random() * 1000);

        setTimer = createSetTimer(identifiersAndResolvers, performance, setTimeout, setTimeoutCallback);

        performance.now.returns(1 + Math.floor(Math.random() * 1000));
        setTimeout.returns(timeoutId);
    });

    describe('setTimer()', () => {
        let delay;
        let nowAndOrigin;
        let then;
        let timerId;

        beforeEach(() => {
            delay = 1000 + Math.floor(Math.random() * 1000);
            nowAndOrigin = 1000 + Math.floor(Math.random() * 1000);
            then = spy();
            timerId = Math.floor(Math.random() * 1000);
        });

        it('should call setTimeout() with setTimeoutCallback(), the delay, and the expected parameters', () => {
            setTimer(delay, nowAndOrigin, timerId);

            expect(setTimeout).to.have.been.calledOnceWithExactly(
                setTimeoutCallback,
                delay + nowAndOrigin - performance.timeOrigin - performance.now(),
                delay + nowAndOrigin - performance.timeOrigin,
                identifiersAndResolvers,
                identifiersAndResolvers.get(timerId)[1],
                timerId
            );
        });

        it('should add an entry with the given timerId', () => {
            setTimer(delay, nowAndOrigin, timerId);

            const identifiersAndResolver = identifiersAndResolvers.get(timerId);
            const [, resolveSetResponseResultPromise] = identifiersAndResolver;

            expect(resolveSetResponseResultPromise).to.be.a('function');
            expect(identifiersAndResolver).to.deep.equal([timeoutId, resolveSetResponseResultPromise]);
        });

        it('should return an unresolved promise', () => {
            const { promise, resolve } = Promise.withResolvers();

            setTimer(delay, nowAndOrigin, timerId).then(then);

            // eslint-disable-next-line no-undef
            globalThis.setTimeout(() => {
                expect(then).to.have.not.been.called;

                resolve();
            }, 100);

            return promise;
        });

        it('should resolve the returned promise when calling resolveSetResponseResultPromise()', async () => {
            setTimer(delay, nowAndOrigin, timerId).then(then);

            const [, resolveSetResponseResultPromise] = identifiersAndResolvers.get(timerId);
            const value = 'a fake value';

            resolveSetResponseResultPromise(value);

            expect(then).to.have.not.been.called;

            await Promise.resolve();

            expect(then).to.have.been.calledOnceWithExactly(value);
        });
    });
});
