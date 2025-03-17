import http from 'k6/http';
import { check, sleep } from 'k6';

const appHost = __ENV.APP_HOST || 'localhost';
const port = __ENV.PORT || 3000;
const vus = Number(__ENV.VUS) || 10;
const duration = __ENV.DURATION || '10s';
const amount = Number(__ENV.AMOUNT) || 10;

export let options = {
    scenarios: {
        requests_per_minute: {
            executor: 'constant-arrival-rate',
            rate: 30, // 60 requests per minute (1 RPS)
            timeUnit: '1m',
            duration: '1m', // Run for 5 minutes
            preAllocatedVUs: 10, // Pre-allocate 10 VUs
            maxVUs: 20, // Allow scaling up to 20 VUs if needed
        },
    },
};

export default function () {
    const payload = JSON.stringify({ password: 'Ahadhsoaihsdpoahs oh' });
    const params = { headers: { 'Content-Type': 'application/json' } };

    const res = http.post(
        `http://${appHost}:${port}/api/14`,
        payload,
        params
    );

    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    
    sleep(1);
}
