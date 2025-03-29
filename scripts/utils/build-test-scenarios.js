import { config } from './config.js';
import secondsToTimeString from "./seconds-to-time-string.js";
import timeStringToSeconds from './time-string-to-seconds.js';

export default function buildTestScenarios() {
    const scenarios = {};
    let startTime = 0;

    for (const port of config.appPorts) {
        const url = `${config.appProtocol}://${config.appHost}:${port}${config.appRoutePrefix}`;

        for (let i = 0; i < config.testRoutes.length; i++) {
            const route = String(config.testRoutes[i]);

            const testName = `test_${port}_${route.replace('/', '')}`;
            const pauseName = `pause_${port}_${route.replace('/', '')}`;

            scenarios[testName] = {
                executor: 'constant-arrival-rate',
                exec: testName,
                rate: config.testRate,
                timeUnit: config.testTimeUnit,
                duration: config.testDuration,
                preAllocatedVus: config.testPreAllocatedVus,
                maxVUs: config.testMaxVus,
                startTime: secondsToTimeString(startTime),
                gracefulStop: config.testGracefulStop,
                tags: { test_phase: route },
                env: {
                    CURRENT_ROUTE: route.replace('/', ''),
                    ENDPOINT: `${url}${route}`,
                    TEST_NAME: testName,
                },
            };

            startTime += timeStringToSeconds(config.testDuration) + timeStringToSeconds(config.testGracefulStop);

            scenarios[pauseName] = {
                executor: 'constant-arrival-rate',
                exec: 'exec_pause',
                preAllocatedVus: 0,
                rate: 1,
                timeUnit: '1s',
                duration: config.pauseDuration,
                startTime: secondsToTimeString(startTime),
                tags: { test_phase: `pause_after_${route}` },
            };

            startTime += timeStringToSeconds(config.pauseDuration);
        }
    }

    return scenarios;
}