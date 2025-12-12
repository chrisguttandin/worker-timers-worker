import { beforeEach, describe, expect, it } from 'vitest';
import { stub } from 'sinon';

describe('module', () => {
    let timerId;
    let worker;

    beforeEach(() => {
        timerId = 0;
        worker = new Worker(new URL('../../src/module', import.meta.url), { type: 'module' });
    });

    describe('clearInterval()', () => {
        let onMessage;
        let timerType;

        beforeEach(() => {
            onMessage = stub();
            timerType = 'interval';
        });

        it('should send a response with the result set to true when clearing the interval before the callback', () => {
            const { promise, resolve } = Promise.withResolvers();

            worker.addEventListener('message', ({ data }) => onMessage(data));
            worker.postMessage({
                id: 18,
                method: 'set',
                params: {
                    delay: 4000,
                    now: performance.timeOrigin + performance.now(),
                    timerId,
                    timerType
                }
            });
            worker.postMessage({
                id: 82,
                method: 'clear',
                params: { timerId, timerType }
            });

            setTimeout(() => {
                expect(onMessage).to.have.been.calledTwice;
                expect(onMessage.getCall(0).args).to.deep.equal([{ id: 18, result: false }]);
                expect(onMessage.getCall(1).args).to.deep.equal([{ id: 82, result: true }]);

                resolve();
            }, 2000);

            return promise;
        });

        it('should send a response with the result set to false when clearing the interval after the callback', () => {
            const { promise, resolve } = Promise.withResolvers();

            onMessage.onFirstCall().callsFake(() => {
                worker.postMessage({
                    id: 82,
                    method: 'clear',
                    params: { timerId, timerType }
                });
            });

            worker.addEventListener('message', ({ data }) => onMessage(data));
            worker.postMessage({
                id: 18,
                method: 'set',
                params: {
                    delay: 2000,
                    now: performance.timeOrigin + performance.now(),
                    timerId,
                    timerType
                }
            });

            setTimeout(() => {
                expect(onMessage).to.have.been.calledTwice;
                expect(onMessage.getCall(0).args).to.deep.equal([{ id: 18, result: true }]);
                expect(onMessage.getCall(1).args).to.deep.equal([{ id: 82, result: false }]);

                resolve();
            }, 4000);

            return promise;
        });
    });

    describe('clearTimeout()', () => {
        let onMessage;
        let timerType;

        beforeEach(() => {
            onMessage = stub();
            timerType = 'timeout';
        });

        it('should send a response with the result set to true when clearing the interval before the timeout', () => {
            const { promise, resolve } = Promise.withResolvers();

            worker.addEventListener('message', ({ data }) => onMessage(data));
            worker.postMessage({
                id: 18,
                method: 'set',
                params: {
                    delay: 4000,
                    now: performance.timeOrigin + performance.now(),
                    timerId,
                    timerType
                }
            });
            worker.postMessage({
                id: 82,
                method: 'clear',
                params: { timerId, timerType }
            });

            setTimeout(() => {
                expect(onMessage).to.have.been.calledTwice;
                expect(onMessage.getCall(0).args).to.deep.equal([{ id: 18, result: false }]);
                expect(onMessage.getCall(1).args).to.deep.equal([{ id: 82, result: true }]);

                resolve();
            }, 2000);

            return promise;
        });

        it('should send a response with the result set to false when clearing the timeout after the callback', () => {
            const { promise, resolve } = Promise.withResolvers();

            onMessage.onFirstCall().callsFake(() => {
                worker.postMessage({
                    id: 82,
                    method: 'clear',
                    params: { timerId, timerType }
                });
            });

            worker.addEventListener('message', ({ data }) => onMessage(data));
            worker.postMessage({
                id: 18,
                method: 'set',
                params: {
                    delay: 2000,
                    now: performance.timeOrigin + performance.now(),
                    timerId,
                    timerType
                }
            });

            setTimeout(() => {
                expect(onMessage).to.have.been.calledTwice;
                expect(onMessage.getCall(0).args).to.deep.equal([{ id: 18, result: true }]);
                expect(onMessage.getCall(1).args).to.deep.equal([{ id: 82, result: false }]);

                resolve();
            }, 4000);

            return promise;
        });
    });

    describe('setInterval()', () => {
        let timerType;

        beforeEach(() => {
            timerType = 'interval';
        });

        it('should postpone a function for the given delay', () => {
            const { promise, resolve } = Promise.withResolvers();
            const before = performance.now();

            worker.addEventListener(
                'message',
                ({ data }) => {
                    expect(data).to.deep.equal({
                        id: 18,
                        result: true
                    });

                    const elapsed = performance.now() - before;

                    expect(elapsed).to.be.at.least(100);

                    resolve();
                },
                { once: true }
            );
            worker.postMessage({
                id: 18,
                method: 'set',
                params: {
                    delay: 100,
                    now: performance.timeOrigin + performance.now(),
                    timerId,
                    timerType
                }
            });

            return promise;
        });
    });

    describe('setTimeout()', () => {
        let timerType;

        beforeEach(() => {
            timerType = 'timeout';
        });

        it('should postpone a function for the given delay', () => {
            const { promise, resolve } = Promise.withResolvers();
            const before = performance.now();

            worker.addEventListener(
                'message',
                ({ data }) => {
                    expect(data).to.deep.equal({
                        id: 18,
                        result: true
                    });

                    const elapsed = performance.now() - before;

                    expect(elapsed).to.be.at.least(100);

                    resolve();
                },
                { once: true }
            );
            worker.postMessage({
                id: 18,
                method: 'set',
                params: {
                    delay: 100,
                    now: performance.timeOrigin + performance.now(),
                    timerId,
                    timerType
                }
            });

            return promise;
        });
    });
});
