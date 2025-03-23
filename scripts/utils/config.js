export const config = {
    appProtocol: String(__ENV.APP_PROTOCOL ?? 'http'),
    appHost: String(__ENV.APP_HOST ?? 'localhost'),
    appPorts: __ENV.APP_PORTS?.split('|') ?? ['3000'],
    appRoutePrefix: String(__ENV.APP_ROUTE_PREFIX ?? ''),

    testRoutes: __ENV.TEST_ROUTES?.split('|') ?? ['/01'],
    testExecutor: String(__ENV.TEST_EXECUTOR ?? 'constant-vus'),
    testVus: Number(__ENV.TEST_VUS ?? 10),
    testDuration: String(__ENV.TEST_DURATION ?? '50s'),
    testGracefulStop: String(__ENV.TEST_GRACEFUL_STOP ?? '10s'),

    pauseDuration: String(__ENV.PAUSE_DURATION ?? '30s'),
};