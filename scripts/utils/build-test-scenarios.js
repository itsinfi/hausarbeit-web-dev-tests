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

            scenarios[`${port}_test_${route.replace('/', '')}`] = {
                executor: config.testExecutor,
                exec: 'exec_test',
                vus: config.testVus,
                duration: config.testDuration,
                startTime: secondsToTimeString(startTime),
                gracefulStop: config.testGracefulStop,
                tags: { test_phase: route },
                env: {
                    ENDPOINT: `${url}${route}`,
                    CURRENT_ROUTE: route.replace('/', ''),
                },
            };

            startTime += timeStringToSeconds(config.testDuration) + timeStringToSeconds(config.testGracefulStop);

            scenarios[`${port}_pause_${i}`] = {
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