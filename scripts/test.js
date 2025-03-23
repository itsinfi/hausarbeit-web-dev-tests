import http from 'k6/http';
import { check, group, sleep } from 'k6';
import buildTestScenarios from './utils/build-test-scenarios.js';
import loadBodyDefinitions from './utils/load-body-definitions.js';
import { saveSummary } from './utils/save-summary.js';

const scenarios = buildTestScenarios();

const bodyDefinitions = loadBodyDefinitions();

export const options = {
    scenarios
}

export function exec_pause() { }

export function exec_test() {
    group(__ENV.ENDPOINT, () => {
        const payload = JSON.stringify(bodyDefinitions[__ENV.CURRENT_ROUTE]);
        const params = { headers: { 'Content-Type': 'application/json' } };
        
        const res = http.post(__ENV.ENDPOINT, payload, params, {
            tags: { endpoint: __ENV.ENDPOINT }
        });
    
        check(res, { 'is status 200': (r) => r.status === 200 });
        
        sleep(2);
    });
}

export const handleSummary = (data) => saveSummary(data);