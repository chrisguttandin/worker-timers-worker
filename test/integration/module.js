describe('module', () => {
    let timerId;
    let worker;

    beforeEach(() => {
        timerId = 0;
        worker = new Worker('base/src/module.js');
    });

    describe('clearInterval()', () => {
        let timerType;

        beforeEach(() => {
            timerType = 'interval';
        });

        it('should not call the function after clearing the interval', function (done) {
            this.timeout(4000);

            let isCleared = false;

            worker.addEventListener('message', ({ data }) => {
                if (!isCleared) {
                    if (data.id === 82) {
                        expect(data).to.deep.equal({ id: 82, result: true });

                        isCleared = true;

                        // Wait 200ms to be sure the function never gets called.
                        setTimeout(done, 200);
                    } else {
                        expect(data).to.deep.equal({
                            id: null,
                            method: 'call',
                            params: { timerId, timerType }
                        });
                    }
                } else {
                    done(new Error('This should never be called.'));
                }
            });

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

            worker.postMessage({
                id: 82,
                method: 'clear',
                params: { timerId, timerType }
            });
        });

        it('should not allow clearing the interval after the callback', function (done) {
            this.timeout(4000);

            let hasBeenCalledOnce = false;

            worker.addEventListener('message', ({ data }) => {
                if (!hasBeenCalledOnce && data.method === 'call') {
                    expect(data).to.deep.equal({
                        id: null,
                        method: 'call',
                        params: { timerId, timerType }
                    });

                    hasBeenCalledOnce = true;

                    worker.postMessage({
                        id: 82,
                        method: 'clear',
                        params: { timerId, timerType }
                    });
                } else if (data.id === 82) {
                    expect(data).to.deep.equal({ id: 82, result: false });

                    // Wait 200ms to be sure the function never gets called.
                    setTimeout(done, 200);
                } else {
                    done(new Error('This should never be called.'));
                }
            });

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

    describe('clearTimeout()', () => {
        let timerType;

        beforeEach(() => {
            timerType = 'timeout';
        });

        it('should not call the function after clearing the timeout', function (done) {
            this.timeout(4000);

            let isCleared = false;

            worker.addEventListener('message', ({ data }) => {
                if (!isCleared) {
                    if (data.id === 82) {
                        expect(data).to.deep.equal({ id: 82, result: true });

                        isCleared = true;

                        // Wait 200ms to be sure the function never gets called.
                        setTimeout(done, 200);
                    } else {
                        expect(data).to.deep.equal({
                            id: null,
                            method: 'call',
                            params: { timerId, timerType }
                        });
                    }
                } else {
                    done(new Error('This should never be called.'));
                }
            });

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

            worker.postMessage({
                id: 82,
                method: 'clear',
                params: { timerId, timerType }
            });
        });

        it('should not allow clearing the timeout after the callback', function (done) {
            this.timeout(4000);

            let hasBeenCalledOnce = false;

            worker.addEventListener('message', ({ data }) => {
                if (!hasBeenCalledOnce && data.method === 'call') {
                    expect(data).to.deep.equal({
                        id: null,
                        method: 'call',
                        params: { timerId, timerType }
                    });

                    hasBeenCalledOnce = true;

                    worker.postMessage({
                        id: 82,
                        method: 'clear',
                        params: { timerId, timerType }
                    });
                } else if (data.id === 82) {
                    expect(data).to.deep.equal({ id: 82, result: false });

                    // Wait 200ms to be sure the function never gets called.
                    setTimeout(done, 200);
                } else {
                    done(new Error('This should never be called.'));
                }
            });

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

    describe('setInterval()', () => {
        let timerType;

        beforeEach(() => {
            timerType = 'interval';
        });

        it('should postpone a function for the given delay', (done) => {
            const before = performance.now();
            const onMessage = ({ data }) => {
                worker.removeEventListener('message', onMessage);

                expect(data).to.deep.equal({
                    id: null,
                    method: 'call',
                    params: { timerId, timerType }
                });

                const elapsed = performance.now() - before;

                expect(elapsed).to.be.at.least(100);

                done();
            };

            worker.addEventListener('message', onMessage);

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
            const onMessage = ({ data }) => {
                worker.removeEventListener('message', onMessage);

                expect(data).to.deep.equal({
                    id: null,
                    method: 'call',
                    params: { timerId, timerType }
                });

                const elapsed = performance.now() - before;

                expect(elapsed).to.be.at.least(100);

                done();
            };

            worker.addEventListener('message', onMessage);

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
