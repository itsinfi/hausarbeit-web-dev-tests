export const config = {
    appProtocol: String(__ENV.APP_PROTOCOL ?? 'http'),
    appHost: String(__ENV.APP_HOST ?? 'localhost'),
    appPorts: __ENV.APP_PORTS?.split('|') ?? ['3000'],
    appRoutePrefix: String(__ENV.APP_ROUTE_PREFIX ?? ''),

    testRoutes: __ENV.TEST_ROUTES?.split('|') ?? ['/01'],
    testRate: Number(__ENV.TEST_RATE ?? 10),
    testTimeUnit: String(__ENV.TEST_TIME_UNIT ?? '1s'),
    testPreAllocatedVus: Number(__ENV.TEST_PRE_ALLOCATED_VUS ?? 100),
    testMaxVus: Number(__ENV.TEST_MAX_VUS ?? 200),
    testDuration: String(__ENV.TEST_DURATION ?? '50s'),
    testGracefulStop: String(__ENV.TEST_GRACEFUL_STOP ?? '10s'),

    pauseDuration: String(__ENV.PAUSE_DURATION ?? '30s'),
};