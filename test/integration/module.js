describe('module', () => {

    let timerId;
    let worker;

    beforeEach(() => {
        timerId = 0;
        worker = new Worker('base/src/module.ts');
    });

    describe('clearInterval()', () => {

        let timerType;

        beforeEach(() => {
            timerType = 'interval';
        });

        it('should not send messages after clearing the interval', (done) => {
            let isCleared = false;

            worker.addEventListener('message', ({ data }) => {
                if (!isCleared && data.id === null) {
                    expect(data).to.deep.equal({
                        id: null,
                        method: 'call',
                        params: { timerId, timerType }
                    });
                } else if (!isCleared && data.id === 82) {
                    expect(data).to.deep.equal({ error: null, id: 82 });

                    isCleared = true;

                    // Wait 200ms to be sure the function never gets called.
                    setTimeout(done, 200);
                } else {
                    throw new Error('this should never be called');
                }
            });

            worker.postMessage({
                id: 18,
                method: 'set',
                params: {
                    delay: 100,
                    now: performance.now(),
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

        it('should not send messages after clearing the interval after the first callback', (done) => {
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
                    expect(data).to.deep.equal({ error: null, id: 82 });

                    // Wait 200ms to be sure the function never gets called.
                    setTimeout(done, 200);
                } else {
                    throw new Error('this should never be called');
                }
            });

            worker.postMessage({
                id: 18,
                method: 'set',
                params: {
                    delay: 100,
                    now: performance.now(),
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

        it('should not call the function after clearing the timeout', (done) => {
            let isCleared = false;

            worker.addEventListener('message', ({ data }) => {
                if (!isCleared) {
                    if (data.id === 82) {
                        expect(data).to.deep.equal({ error: null, id: 82 });

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
                    throw new Error('this should never be called');
                }
            });

            worker.postMessage({
                id: 18,
                method: 'set',
                params: {
                    delay: 100,
                    now: performance.now(),
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

    });

    describe('setInterval()', () => {

        let timerType;

        afterEach((done) => {
            worker.addEventListener('message', ({ data }) => {
                if (data.id === 82) {
                    done();
                }
            });

            worker.postMessage({
                id: 82,
                method: 'clear',
                params: { timerId, timerType }
            });
        });

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
                    now: performance.now(),
                    timerId,
                    timerType
                }
            });
        });

    });

    describe('setTimeout()', () => {

        let timerType;

        afterEach((done) => {
            worker.addEventListener('message', ({ data }) => {
                if (data.id === 82) {
                    done();
                }
            });

            worker.postMessage({
                id: 82,
                method: 'clear',
                params: { timerId, timerType }
            });
        });

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
                    now: performance.now(),
                    timerId,
                    timerType
                }
            });
        });

    });

});
