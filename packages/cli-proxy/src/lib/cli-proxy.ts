import { spawn } from 'node:child_process';
import { SpawnProxy } from './spawn-proxy';

type Subcommand = (args: string[]) => void;

export class CliProxy {
  command: string;
  private subcommands: Map<string, Subcommand>;

  constructor(command: string) {
    this.command = command;
    this.subcommands = new Map();
  }
  protected subcommand(name: string, fn: Subcommand): void {
    this.subcommands.set(name, fn);
  }
  run(args = process.argv) {
    // Get the command and its arguments
    const commandArgs = args.slice(2);

    const subcommand = commandArgs[0];
    if (subcommand && this.subcommands.has(subcommand)) {
      const subcommandFn = this.subcommands.get(subcommand);
      if (subcommandFn) {
        subcommandFn(commandArgs);
        return;
      }
    }

    // Spawn the original CLI command
    this.spawn(commandArgs);
  }
  protected spawn(args: string[], handler = new SpawnProxy()) {
    const child = spawn(this.command, args, { stdio: 'pipe' });
    handler.registerChild(child);
  }
}

export { SpawnProxy };
