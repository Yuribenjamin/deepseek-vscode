import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class LoggingService {
  private logFilePath: string;

  constructor() {
    const logDir = path.join(
      vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || '',
      '.deepseek-logs',
    );
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    this.logFilePath = path.join(logDir, 'deepseek.log');
  }

  private isLoggingEnabled(): boolean {
    return (
      vscode.workspace
        .getConfiguration('deepseekCoder')
        .get<boolean>('enableLogging') ?? true
    );
  }

  log(message: string): void {
    if (!this.isLoggingEnabled()) return;

    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;

    fs.appendFileSync(this.logFilePath, logMessage);
    console.log(logMessage);
  }

  logTelemetry(event: string, properties?: Record<string, string>): void {
    if (!this.isLoggingEnabled()) return;
    vscode.commands.executeCommand('workbench.action.output.toggleOutput');
    console.log(`[Telemetry] Event: ${event}`, properties);
  }

  logError(error: unknown): void {
    if (!this.isLoggingEnabled()) return;

    const message = error instanceof Error ? error.message : 'Unknown error';
    this.log(`ERROR: ${message}`);
  }
}
