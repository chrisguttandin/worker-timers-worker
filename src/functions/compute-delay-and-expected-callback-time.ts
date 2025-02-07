export const computeDelayAndExpectedCallbackTime = (delay: number, nowAndTimeOrigin: number) => {
    const now = performance.now();
    const remainingDelay = delay + nowAndTimeOrigin - now - performance.timeOrigin;
    const expected = now + remainingDelay;

    return { expected, remainingDelay };
};
