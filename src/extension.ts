import * as vscode from 'vscode';
import { OllamaService } from './modules/ollama/ollama.service';
import { TerminalService } from './modules/terminal/terminal.service';
import { StatusBarService } from './modules/status-bar/status-bar.service';
import { CompletionProvider } from './modules/completions/completion.provider';
import { LoggingService } from './modules/logging/logging.service';
import { ConfigService } from './modules/config/config.service';

class Application {
    private ollamaService: OllamaService;
    private terminalService: TerminalService;
    private statusBarService: StatusBarService;
    private completionProvider: CompletionProvider;
    private loggingService: LoggingService;
    private configService: ConfigService;

    constructor() {
        console.log('[Extension] Initializing Application...');
        this.configService = new ConfigService();
        this.ollamaService = new OllamaService(this.configService);
        this.terminalService = new TerminalService(this.ollamaService);
        this.statusBarService = new StatusBarService(); // Matches the property name
        this.completionProvider = new CompletionProvider(this.ollamaService, new LoggingService());
        this.loggingService = new LoggingService();
    }

    async activate(context: vscode.ExtensionContext) {
        console.log('[Extension] Extension activated');
        if (!this.ollamaService.isInstalled()) {
            console.log('[Extension] Ollama is not installed, but continuing for testing...');
            vscode.window.showWarningMessage('Ollama is not installed. Some features may not work.');
        } else {
            console.log('[Extension] Ollama is installed and accessible.');
        }

        // Register commands and providers to keep the extension host alive
        this.registerCommands(context);
        this.statusBarService.init(); // Now this will work since statusBarService is defined
        this.registerCompletionProvider(context);
        console.log('[Extension] Extension fully activated and registered.');

        // Add a persistent status bar item
        const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusBarItem.text = 'DeepSeek Active';
        statusBarItem.show();
        context.subscriptions.push(statusBarItem);

        // Add a periodic timer to keep the extension host alive (for testing)
        const timer = setInterval(() => {
            console.log('[Extension] Extension heartbeat at:', new Date().toISOString());
        }, 5000); // Log every 5 seconds
        context.subscriptions.push({
            dispose: () => clearInterval(timer)
        });

        // Test Ollama models, but continue even if it fails
        try {
            const models = await this.ollamaService.listModels();
            console.log('[Extension] Ollama models:', models);
            if (!models.length) {
                vscode.window.showWarningMessage('No DeepSeek models found. Some features may be limited.');
            }
        } catch (error) {
            console.error('[Extension] Error listing Ollama models (non-fatal):', error instanceof Error ? error.message : 'Unknown error');
            vscode.window.showWarningMessage(`Failed to list Ollama models: ${error instanceof Error ? error.message : 'Unknown error'}. Continuing without models.`);
        }
    }

    private registerCommands(context: vscode.ExtensionContext) {
        console.log('[Extension] Registering commands...');
        context.subscriptions.push(
            vscode.commands.registerCommand('deepseek.runModel', async () => {
                try {
                    console.log('[Extension] Running deepseek.runModel command...');
                    const models = await this.ollamaService.listModels();
                    if (!models.length) {
                        vscode.window.showErrorMessage('No DeepSeek models found.');
                        return;
                    }

                    const selectedModel = await vscode.window.showQuickPick(models, {
                        placeHolder: 'Select a DeepSeek model',
                    });

                    if (selectedModel) {
                        this.loggingService.logTelemetry('Model Selected', { model: selectedModel });
                        this.terminalService.createTerminal(selectedModel);
                        this.statusBarService.updateStatus(selectedModel);
                    }
                } catch (error) {
                    console.error('[Extension] Error in deepseek.runModel:', error instanceof Error ? error.message : 'Unknown error');
                    this.loggingService.logError(error);
                    vscode.window.showErrorMessage(`Failed to execute command: ${error instanceof Error ? error.message : 'Unknown error'}`);
                }
            }),
        );
    }

    private registerCompletionProvider(context: vscode.ExtensionContext) {
        console.log('[Extension] Registering completion provider...');
        context.subscriptions.push(
            vscode.languages.registerCompletionItemProvider(
                { scheme: 'file', language: 'javascript' },
                this.completionProvider,
                '.',
            ),
        );
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('[Extension] Activating extension...');
    new Application().activate(context);
}

export function deactivate() {
    console.log('[Extension] Extension deactivated.');
}