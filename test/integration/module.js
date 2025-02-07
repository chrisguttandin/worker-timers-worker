import { stub } from 'sinon';

describe('module', () => {
    let timerId;
    let worker;

    beforeEach(() => {
        timerId = 0;
        worker = new Worker('base/src/module.js');
    });

    describe('clearInterval()', () => {
        let onMessage;
        let timerType;

        beforeEach(() => {
            onMessage = stub();
            timerType = 'interval';
        });

        it('should send a response with the result set to true when clearing the interval before the callback', (done) => {
            worker.addEventListener('message', ({ data }) => onMessage(data));
            worker.postMessage({
                id: 18,
                method: 'set',
                params: {
                    delay: 1000,
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
                expect(onMessage).to.have.been.calledWithExactly({ id: 18, result: null });
                expect(onMessage).to.have.been.calledWithExactly({ id: 82, result: true });

                done();
            }, 500);
        });

        it('should send a response with the result set to false when clearing the interval after the callback', (done) => {
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
                    delay: 100,
                    now: performance.timeOrigin + performance.now(),
                    timerId,
                    timerType
                }
            });

            setTimeout(() => {
                expect(onMessage).to.have.been.calledTwice;
                expect(onMessage).to.have.been.calledWithExactly({ id: 18, result: { timerId, timerType } });
                expect(onMessage).to.have.been.calledWithExactly({ id: 82, result: false });

                done();
            }, 300);
        });
    });

    describe('clearTimeout()', () => {
        let onMessage;
        let timerType;

        beforeEach(() => {
            onMessage = stub();
            timerType = 'timeout';
        });

        it('should send a response with the result set to true when clearing the interval before the timeout', (done) => {
            worker.addEventListener('message', ({ data }) => onMessage(data));
            worker.postMessage({
                id: 18,
                method: 'set',
                params: {
                    delay: 1000,
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
                expect(onMessage).to.have.been.calledWithExactly({ id: 18, result: null });
                expect(onMessage).to.have.been.calledWithExactly({ id: 82, result: true });

                done();
            }, 500);
        });

        it('should send a response with the result set to false when clearing the timeout after the callback', (done) => {
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
                    delay: 100,
                    now: performance.timeOrigin + performance.now(),
                    timerId,
                    timerType
                }
            });

            setTimeout(() => {
                expect(onMessage).to.have.been.calledTwice;
                expect(onMessage).to.have.been.calledWithExactly({ id: 18, result: { timerId, timerType } });
                expect(onMessage).to.have.been.calledWithExactly({ id: 82, result: false });

                done();
            }, 300);
        });
    });

    describe('setInterval()', () => {
        let timerType;

        beforeEach(() => {
            timerType = 'interval';
        });

        it('should postpone a function for the given delay', (done) => {
            const before = performance.now();

            worker.addEventListener(
                'message',
                ({ data }) => {
                    expect(data).to.deep.equal({
                        id: 18,
                        result: { timerId, timerType }
                    });

                    const elapsed = performance.now() - before;

                    expect(elapsed).to.be.at.least(100);

                    done();
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
        });
    });

    describe('setTimeout()', () => {
        let timerType;

        beforeEach(() => {
            timerType = 'timeout';
        });

        it('should postpone a function for the given delay', (done) => {
            const before = performance.now();

            worker.addEventListener(
                'message',
                ({ data }) => {
                    expect(data).to.deep.equal({
                        id: 18,
                        result: { timerId, timerType }
                    });

                    const elapsed = performance.now() - before;

                    expect(elapsed).to.be.at.least(100);

                    done();
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
        });
    });
});
