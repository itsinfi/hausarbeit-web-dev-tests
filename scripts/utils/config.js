export const appProtocol = String(__ENV.APP_PROTOCOL ?? 'http');
export const appHost = String(__ENV.APP_HOST ?? 'localhost');
export const appPorts = __ENV.APP_PORTS?.split('|') ?? ['3000'];
export const appRoutePrefix = String(__ENV.APP_ROUTE_PREFIX ?? '');

export const testRoutes = __ENV.TEST_ROUTES?.split('|') ?? ['/01'];
export const testExecutor = String(__ENV.TEST_EXECUTOR ?? 'constant-vus');
export const testVus = Number(__ENV.TEST_VUS ?? 10);
export const testDuration = String(__ENV.TEST_DURATION ?? '50s');
export const testGracefulStop = String(__ENV.TEST_GRACEFUL_STOP ?? '10s');

export const pauseDuration = String(__ENV.PAUSE_DURATION ?? '30s');