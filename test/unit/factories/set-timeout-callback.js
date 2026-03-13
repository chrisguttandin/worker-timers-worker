import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSetTimeoutCallback } from '../../../src/factories/set-timeout-callback';

describe('createSetTimeoutCallback()', () => {
    let performance;
    let setTimeout;
    let setTimeoutCallback;

    beforeEach(() => {
        performance = { now: vi.fn() };
        setTimeout = vi.fn();

        setTimeoutCallback = createSetTimeoutCallback(performance, setTimeout);

        performance.now.mockReturnValue(1 + Math.floor(Math.random() * 1000));
    });

    describe('setTimeoutCallback()', () => {
        let identifiersAndResolvers;
        let resolveSetResponseResultPromise;
        let timerId;

        beforeEach(() => {
            timerId = Math.floor(Math.random() * 1000);
            identifiersAndResolvers = new Map([[timerId, 'a fake entry']]);
            resolveSetResponseResultPromise = vi.fn();
        });

        describe('with a callback before it was expected', () => {
            let expected;

            beforeEach(() => {
                expected = performance.now() + 1;
            });

            it('should not delete the entry with the given timerId', () => {
                setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId);

                expect(identifiersAndResolvers.has(timerId)).to.be.true;
            });

            it('should not call resolveSetResponseResultPromise()', () => {
                setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId);

                expect(resolveSetResponseResultPromise).to.have.not.been.called;
            });

            it('should call setTimeout() with itself and its parameters', () => {
                setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId);

                expect(setTimeout).to.have.been.calledOnceWith(
                    setTimeoutCallback,
                    expected - performance.now(),
                    expected,
                    identifiersAndResolvers,
                    resolveSetResponseResultPromise,
                    timerId
                );
            });

            it('should return undefined', () => {
                expect(setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId)).to.be.undefined;
            });

            describe('after invoking the callback', () => {
                beforeEach(() => {
                    setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId);

                    performance.now.mockReturnValue(performance.now() + 1);
                    setTimeout.mockClear();
                });

                it('should delete the entry with the given timerId', () => {
                    setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId);

                    expect(identifiersAndResolvers.has(timerId)).to.be.false;
                });

                it('should call resolveSetResponseResultPromise() with true', () => {
                    setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId);

                    expect(resolveSetResponseResultPromise).to.have.been.calledOnceWith(true);
                });

                it('should not call setTimeout()', () => {
                    setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId);

                    expect(setTimeout).to.have.not.been.called;
                });

                it('should return undefined', () => {
                    expect(setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId)).to.be.undefined;
                });
            });
        });

        describe('with a callback when expected', () => {
            let expected;

            beforeEach(() => {
                expected = performance.now();
            });

            it('should delete the entry with the given timerId', () => {
                setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId);

                expect(identifiersAndResolvers.has(timerId)).to.be.false;
            });

            it('should call resolveSetResponseResultPromise() with true', () => {
                setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId);

                expect(resolveSetResponseResultPromise).to.have.been.calledOnceWith(true);
            });

            it('should not call setTimeout()', () => {
                setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId);

                expect(setTimeout).to.have.not.been.called;
            });

            it('should return undefined', () => {
                expect(setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId)).to.be.undefined;
            });
        });

        describe('with a callback after it was expected', () => {
            let expected;

            beforeEach(() => {
                expected = performance.now() - 1;
            });

            it('should delete the entry with the given timerId', () => {
                setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId);

                expect(identifiersAndResolvers.has(timerId)).to.be.false;
            });

            it('should call resolveSetResponseResultPromise() with true', () => {
                setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId);

                expect(resolveSetResponseResultPromise).to.have.been.calledOnceWith(true);
            });

            it('should not call setTimeout()', () => {
                setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId);

                expect(setTimeout).to.have.not.been.called;
            });

            it('should return undefined', () => {
                expect(setTimeoutCallback(expected, identifiersAndResolvers, resolveSetResponseResultPromise, timerId)).to.be.undefined;
            });
        });
    });
});
