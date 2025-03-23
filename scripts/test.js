import buildTestScenarios from './utils/build-test-scenarios.js';
import loadBodyDefinitions from './utils/load-body-definitions.js';
import http from 'k6/http';
import { check, sleep } from 'k6';

const scenarios = buildTestScenarios();

const bodyDefinitions = loadBodyDefinitions();

export const options = {
    scenarios
}

export function exec_pause() { }

export function exec_test() {
    const payload = JSON.stringify(bodyDefinitions[__ENV.CURRENT_ROUTE]);
    const params = { headers: { 'Content-Type': 'application/json' } };

    const res = http.post(
        __ENV.ENDPOINT,
        payload,
        params
    );

    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    
    sleep(2);
}