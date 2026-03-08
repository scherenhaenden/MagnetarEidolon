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

    if (command === 'canonical-model') {
      console.log('Canonical model: MagnetarEidolon Canonical Project Model');
      console.log('The app uses it as core context, but the product remains workflow-driven.');
      return;
    }

    this.printHelp();
  }

  private printHelp(): void {
    console.log('Usage: magnetar-cli <command>');
    console.log('Commands:');
    console.log('  about             Describe the application focus.');
    console.log('  canonical-model   Explain canonical model usage.');
  }
}

new MagnetarCli().run(process.argv);
