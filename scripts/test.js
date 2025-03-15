import http from 'k6/http';
import { check, sleep } from 'k6';

const appHost = __ENV.APP_HOST || 'localhost';
const port = __ENV.PORT || 3000;
const vus = Number(__ENV.VUS) || 10;
const duration = __ENV.DURATION || '10s';
const amount = Number(__ENV.AMOUNT) || 10;

export let options = {
    vus,
    duration,
};

export default function () {
    const payload = JSON.stringify({ amount });
    const params = { headers: { 'Content-Type': 'application/json' } };

    const res = http.post(
        `http://${appHost}:${port}/app/api/rest`,
        payload,
        params
    );

    check(res, {
        'is status 200': (r) => r.status === 200,
    });
    
    sleep(1);
}
