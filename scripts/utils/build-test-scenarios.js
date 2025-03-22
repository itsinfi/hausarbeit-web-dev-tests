const config = require('./config.js');
import secondsToTimeString from "./seconds-to-time-string.js";
import timeStringToSeconds from './time-string-to-seconds.js';

export default function buildTestScenarios() {
    const scenarios = {};
    let startTime = 0;

    for (const port of config.appPorts) {
        const url = `${config.appProtocol}://${config.appHost}:${port}${config.appRoutePrefix}`;

        for (let i = 0; i < config.testRoutes.length; i++) {
            const route = String(config.testRoutes[i]);

            scenarios[`test_${route.replace('/', '')}`] = {
                executor: config.testExecutor,
                exec: `exec_test_${route.replace('/', '')}`,
                vus: config.testVus,
                duration: config.testDuration,
                startTime: secondsToTimeString(startTime),
                gracefulStop: config.testGracefulStop,
                tags: { test_phase: route },
                env: { ENDPOINT: `${url}${route}` },
            };

            startTime += timeStringToSeconds(config.testDuration) + timeStringToSeconds(config.testGracefulStop);

            scenarios[`pause_${i}`] = {
                executor: 'constant-arrival-rate',
                exec: 'noOp',
                rate: 0,
                timeUnit: config.pauseDuration,
                duration: config.pauseDuration,
                startTime: secondsToTimeString(startTime),
                tags: { test_phase: `pause_after_${route}` },
            };

            startTime += timeStringToSeconds(config.pauseDuration);
        }
    }

    console.log('scenarios:', scenarios);
}