export function saveSummary(data) {
    let scenarioStats = {};

    // const filteredMetrics = [
    //     'iterations', 'iteration_duration', 'http_req_connecting',
    //     'group_duration', 'http_req_sending', 'http_req_failed',
    //     'http_req_receiving', 'checks', 'http_req_duration',
    //     'data_sent', 'http_req_blocked', 'http_req_duration_expected_response',
    //     'http_req_waiting', 'vus', 'vus_max', 'tls_handshaking', 'http_reqs'
    // ];

    for (const [metricName, metricData] of Object.entries(data.metrics)) {
        
        for (const [scenarioName, scenarioInfo] of Object.entries(data.root_group.groups)) {
            const scenarioKey = scenarioInfo.checks[0].path.split('::')[1].split(':')[2];

            if (!scenarioStats[scenarioKey]) {
                scenarioStats[scenarioKey] = {};
            }

            // if (filteredMetrics.includes(metricName)) {
                scenarioStats[scenarioKey][metricName] = metricData;
            // }
        }
    }

    return {
        "/results/scenarios.json": JSON.stringify(scenarioStats, null, 2),
        "/results/summary.json": JSON.stringify(data, null, 2), // Keep full summary as well
    };
}