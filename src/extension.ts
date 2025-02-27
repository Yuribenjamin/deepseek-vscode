import * as vscode from 'vscode';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { OllamaService } from './modules/ollama/ollama.service';
import { TerminalService } from './modules/terminal/terminal.service';
import { StatusBarService } from './modules/status-bar/status-bar.service';
import { CompletionProvider } from './modules/completions/completion.provider';
import { LoggingService } from './modules/logging/logging.service';
import { INestApplicationContext } from '@nestjs/common';

class Application {
  private app: INestApplicationContext;
  private ollamaService: OllamaService;
  private terminalService: TerminalService;
  private statusBarService: StatusBarService;
  private completionProvider: CompletionProvider;
  private loggingService: LoggingService;

  constructor(private context: vscode.ExtensionContext) {}

  async activate() {
    this.app = await NestFactory.createApplicationContext(AppModule);
    this.ollamaService = this.app.get(OllamaService);
    this.terminalService = this.app.get(TerminalService);
    this.statusBarService = this.app.get(StatusBarService);
    this.completionProvider = this.app.get(CompletionProvider);
    this.loggingService = this.app.get(LoggingService);

    if (!this.ollamaService.isInstalled()) {
      vscode.window.showErrorMessage(
        'Ollama is not installed. Please install it first.',
      );
      return;
    }

    this.registerCommands();
    void this.statusBarService.init();
    void this.registerCompletionProvider();
  }

  private registerCommands() {
    this.context.subscriptions.push(
      vscode.commands.registerCommand('deepseek.runModel', async () => {
        this.loggingService.log("resgiterd command deepseek.runModel")
        try {
          const models = await this.ollamaService.listModels();
          if (!models.length) {
            vscode.window.showErrorMessage('No DeepSeek models found.');
            return;
          }

          const selectedModel = await vscode.window.showQuickPick(models, {
            placeHolder: 'Select a DeepSeek model',
          });

          if (selectedModel) {
            this.loggingService.logTelemetry('Model Selected', {
              model: selectedModel,
            });
            void this.terminalService.createTerminal(selectedModel);
            void this.statusBarService.updateStatus(selectedModel);
          }
        } catch (error) {
          this.loggingService.logError(error);
          vscode.window.showErrorMessage(
            `Failed to execute command : ${error instanceof Error ? error.message : 'Unknown error'}`,
          );
        }
      }),
    );
  }

  private registerCompletionProvider() {
    this.context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        [
          { scheme: 'file', language: 'typescript' },
          { scheme: 'file', language: 'javascript' },
          { scheme: 'file', language: 'python' }, // Add more as needed
        ],
        this.completionProvider,
        '.', '(', // Additional trigger characters
      ),
    );
  }
}

export function activate(context: vscode.ExtensionContext) {
  void new Application(context).activate();
}
