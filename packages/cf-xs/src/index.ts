import { CliProxy, SpawnProxy } from 'cli-proxy';

class OauthTokenSpawnProxy extends SpawnProxy {
  override onStdout(data: unknown) {
    const dataString = (data?.toString() || '')
      .split('\n')
      .filter((data) => data.match(/^bearer .*$/))
      .join('\n');

    super.onStdout(Buffer.from(dataString));
  }
}

class XSproxy extends CliProxy {
  constructor() {
    super('xs');
    this.subcommand('oauth-token', this.oauth_token.bind(this));
  }
  private oauth_token(commandArgs: string[]) {
    // Spawn the original CLI command
    this.spawn(commandArgs, new OauthTokenSpawnProxy());
  }
}

new XSproxy().run();
