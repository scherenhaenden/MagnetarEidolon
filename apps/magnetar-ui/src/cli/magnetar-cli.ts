#!/usr/bin/env node
import { ProjectContextService } from '../app/core/services/project-context.service.js';

class MagnetarCli {
  private readonly projectContextService = new ProjectContextService();

  public run(argv: string[]): void {
    const command = argv[2] ?? 'about';

    if (command === 'about') {
      console.log(this.projectContextService.getDescriptor().describe());
      return;
    }

    if (command === '-h' || command === '--help') {
      this.printHelp();
      return;
    }

    console.error(`Unknown command: ${command}`);
    this.printHelp();
    process.exit(1);
  }

  private printHelp(): void {
    console.log('Usage: magnetar-cli <command>');
    console.log('Commands:');
    console.log('  about             Describe the application focus.');
  }
}

new MagnetarCli().run(process.argv);
