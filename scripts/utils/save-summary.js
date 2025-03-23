export function saveSummary(data) {
    let scenarioStats = {};

    for (const [metricName, metricData] of Object.entries(data.metrics)) {
        
        for (const scenarioInfo of Object.values(data.root_group.groups)) {
            const scenarioKey = scenarioInfo.checks[0].path.split('::')[1].split(':')[2];

            if (!scenarioStats[scenarioKey]) {
                scenarioStats[scenarioKey] = {};
            }

            if (!scenarioStats[scenarioKey][metricName]) {
                scenarioStats[scenarioKey][metricName] = {};
            }

            scenarioStats[scenarioKey][metricName].push(metricData);
        }
    }

    return {
        "/results/scenarios.json": JSON.stringify(scenarioStats, null, 2),
        "/results/summary.json": JSON.stringify(data, null, 2),
    };
}