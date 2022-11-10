import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {BackendApplication} from '../..';

export async function setupApplication(): Promise<AppWithClient> {
  const app = new BackendApplication({
    rest: givenHttpServerConfig(),
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export interface AppWithClient {
  app: BackendApplication;
  client: Client;
}
