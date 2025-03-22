import http from 'k6/http';
import { check, sleep } from 'k6';
import buildTestScenarios from './utils/build-test-scenarios.js';

export const options = buildTestScenarios();

export default function () {
    // const payload = JSON.stringify({ password: 'Ahadhsoaihsdpoahs oh' });
    // const params = { headers: { 'Content-Type': 'application/json' } };

    // const res = http.post(
    //     `http://${appHost}:${port}/api/14`,
    //     payload,
    //     params
    // );

    // check(res, {
    //     'is status 200': (r) => r.status === 200,
    // });
    
    // sleep(1);
}



