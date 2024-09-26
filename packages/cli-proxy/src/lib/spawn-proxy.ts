import { ChildProcessWithoutNullStreams } from 'child_process';

export class SpawnProxy {
  protected onStdout(data: Uint8Array | string) {
    process.stdout.write(data);
  }
  protected onStderr(data: Uint8Array | string) {
    process.stdout.write(data);
  }
  protected onClose(code?: number) {
    process.exit(code);
  }

  registerChild(child: ChildProcessWithoutNullStreams) {
    child.stdout.on('data', this.onStdout);
    child.stderr.on('data', this.onStderr);
    child.on('close', this.onClose);
  }
}
