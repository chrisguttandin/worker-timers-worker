describe('module', () => {

    let id;

    let worker;

    beforeEach(() => {
        id = 0;
        worker = new Worker('base/src/module.ts');
    });

    describe('clearInterval()', () => {

        let type;

        beforeEach(() => {
            type = 'interval';
        });

        it('should not call the function after clearing the interval', (done) => {
            worker.addEventListener('message', () => {
                throw 'this should never be called';
            });

            worker.postMessage({
                action: 'set',
                delay: 100,
                id,
                now: performance.now(),
                type
            });

            worker.postMessage({
                action: 'clear',
                id,
                type
            });

            // Wait 200ms to be sure the function never gets called.
            setTimeout(done, 200);
        });

        it('should not call the function anymore after clearing the interval after the first callback', (done) => {
            let hasBeenCalledOnce = false;

            worker.addEventListener('message', () => {
                if (hasBeenCalledOnce) {
                    throw 'this should never be called';
                }

                hasBeenCalledOnce = true;

                worker.postMessage({
                    action: 'clear',
                    id,
                    type
                });
            });

            worker.postMessage({
                action: 'set',
                delay: 50,
                id,
                now: performance.now(),
                type
            });

            // Wait 200ms to be sure the function gets not called anymore.
            setTimeout(done, 200);
        });

    });

    describe('clearTimeout()', () => {

        let type;

        beforeEach(() => {
            type = 'timeout';
        });

        it('should not call the function after clearing the timeout', (done) => {
            worker.addEventListener('message', () => {
                throw 'this should never be called';
            });

            worker.postMessage({
                action: 'set',
                delay: 100,
                id,
                now: performance.now(),
                type
            });

            worker.postMessage({
                action: 'clear',
                id,
                type
            });

            // Wait 200ms to be sure the function never gets called.
            setTimeout(done, 200);
        });

    });

    describe('setInterval()', () => {

        let type;

        afterEach(() => {
            worker.postMessage({
                action: 'clear',
                id,
                type
            });
        });

        beforeEach(() => {
            type = 'interval';
        });

        it('should postpone a function for the given delay', (done) => {
            const before = performance.now();

            worker.addEventListener('message', () => {
                const elapsed = performance.now() - before;

                expect(elapsed).to.be.at.least(100);

                done();
            });

            worker.postMessage({
                action: 'set',
                delay: 100,
                id,
                now: performance.now(),
                type
            });
        });

    });

    describe('setTimeout()', () => {

        let type;

        afterEach(() => {
            worker.postMessage({
                action: 'clear',
                id,
                type
            });
        });

        beforeEach(() => {
            type = 'timeout';
        });

        it('should postpone a function for the given delay', (done) => {
            const before = performance.now();

            worker.addEventListener('message', () => {
                const elapsed = performance.now() - before;

                expect(elapsed).to.be.at.least(100);

                done();
            });

            worker.postMessage({
                action: 'set',
                delay: 100,
                id,
                now: performance.now(),
                type
            });
        });

    });

});
