import { spawn, execSync } from 'child_process';
import * as vscode from 'vscode';
import { ConfigService } from '../config/config.service';

interface OllamaListResponse {
    name: string;
}

export class OllamaService {
    constructor(private readonly configService: ConfigService) {}

    async listModels(): Promise<string[]> {
        return new Promise((resolve, reject) => {
            console.log('Listing Ollama models...');
            const process = spawn('ollama', ['list']);
            let output = '';

            process.stdout.on('data', (data: Buffer) => {
                output += data.toString(); // Use data.toString() directly, not Buffer.from()
                console.log('Ollama output:', output);
            });

            process.on('close', (code) => {
                if (code !== 0) {
                    console.error('Ollama list command failed with code:', code);
                    reject(new Error('Ollama command failed'));
                    return;
                }
                try {
                    const lines = output.split('\n').map(line => line.trim());
                    const models = lines
                        .slice(1) // Skip header
                        .map(line => line.split(/\s+/)[0]) // Extract the first column (model name)
                        .filter(name => name && name.includes('deepseek')); // Filter relevant models

                    console.log('Found models:', models);
                    resolve(models);
                } catch (error) {
                    console.error('Error parsing Ollama response:', error instanceof Error ? error.message : 'Unknown error');
                    resolve([]); // Return empty array instead of rejecting on parse error
                }
            });

            process.on('error', (error) => {
                console.error('Ollama process error:', error instanceof Error ? error.message : 'Unknown error');
                resolve([]); // Return empty array instead of rejecting on process error
            });
        });
    }

    isInstalled(): boolean {
        try {
            execSync('ollama --version');
            return true;
        } catch (error: unknown) {
            console.log('Ollama is not installed:', error instanceof Error ? error.message : 'Unknown error');
            return false;
        }
    }

    runModel(model: string): void {
        try {
            const terminal: vscode.Terminal = vscode.window.createTerminal(`DeepSeek Coder - ${model}`);
            terminal.show();
            terminal.sendText(`ollama run ${model}`); // Simplified to remove unsupported flags
        } catch (error: unknown) {
            console.error('Error running Ollama model:', error instanceof Error ? error.message : 'Unknown error');
            vscode.window.showErrorMessage(`Failed to start terminal: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getDefaultModel(): Promise<string | null> {
        try {
            const models = await this.listModels();
            return models.length > 0 ? models[0] : null;
        } catch (error) {
            console.error('Error fetching default model:', error instanceof Error ? error.message : 'Unknown error');
            return null;
        }
    }

    async getCompletion(input: string, model: string): Promise<string | null> {
      try {
          const process = spawn('ollama', ['run', model, input]);
          let output = '';
  
          return new Promise((resolve) => { // Remove reject to prevent Promise rejection
              process.stdout.on('data', (data: Buffer) => {
                  output += data.toString();
              });
  
              process.on('close', (code) => {
                  if (code !== 0) {
                      console.error('[Extension] Ollama run command failed with code:', code);
                      vscode.window.showWarningMessage(`Ollama run command failed with code ${code}. Returning default suggestion.`);
                      resolve('Suggested code...'); // Default suggestion if ollama fails
                      return;
                  }
                  resolve(output.trim() || 'Suggested code...'); // Default if output is empty
              });
  
              process.on('error', (error) => {
                  console.error('[Extension] Ollama process error:', error instanceof Error ? error.message : 'Unknown error');
                  vscode.window.showWarningMessage(`Ollama process error: ${error instanceof Error ? error.message : 'Unknown error'}. Returning default suggestion.`);
                  resolve('Suggested code...'); // Default suggestion on error
              });
          });
      } catch (error: unknown) {
          console.error('[Extension] Error fetching completion:', error instanceof Error ? error.message : 'Unknown error');
          return 'Suggested code...'; // Default suggestion on catch error
      }
  }
}