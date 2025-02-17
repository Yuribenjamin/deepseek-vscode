import { Injectable } from '@nestjs/common';
import { spawn, execSync } from 'child_process';
import * as vscode from 'vscode';
import { ConfigService } from '../config/config.service';

interface OllamaListResponse {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}

@Injectable()
export class OllamaService {
  constructor(private readonly configService: ConfigService) {}

  async listModels(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const process = spawn('ollama', ['list', '--json']);
      let output = '';

      process.stdout.on('data', (data: Buffer) => {
        output += data.toString();
      });

      process.on('close', (code) => {
        if (code !== 0) {
          reject(new Error('Ollama command failed'));
          return;
        }
        try {
          const parsedData: unknown = JSON.parse(output);
          if (!Array.isArray(parsedData)) {
            reject(new Error('Unexpected JSON format'));
            return;
          }

          const models = (parsedData as OllamaListResponse[])
            .filter((item: OllamaListResponse) => typeof item.name === 'string')
            .map((item) => item.name)
            .filter((name) => name.includes('deepseek'));

          resolve(models);
        } catch (error) {
          reject(
            new Error(
              `Failed to parse model list: ${error instanceof Error ? error.message : 'Unknown error'}`,
            ),
          );
        }
      });
    });
  }

  isInstalled(): boolean {
    try {
      execSync('ollama --version');
      return true;
    } catch {
      return false;
    }
  }

  runModel(model: string): void {
    const temperature: number = this.configService.getTemperature();
    const maxTokens: number = this.configService.getMaxTokens();
    const topP: number = this.configService.getTopP();

    try {
      const terminal: vscode.Terminal = vscode.window.createTerminal(
        `DeepSeek Coder - ${model}`,
      );
      terminal.show();
      terminal.sendText(
        `ollama run ${model} --temperature ${temperature} --max-tokens ${maxTokens} --top-p ${topP}`,
      );
    } catch (error: unknown) {
      vscode.window.showErrorMessage(
        `Failed to start terminal: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getDefaultModel(): Promise<string | null> {
    try {
      const models = await this.listModels();
      return models.length > 0 ? models[0] : null;
    } catch (error) {
      console.error('Error fetching default model:', error);
      return null;
    }
  }

  async getCompletion(input: string, model: string): Promise<string | null> {
    try {
      const process = spawn('ollama', ['run', model, input]);
      let output = '';

      return new Promise((resolve, reject) => {
        process.stdout.on('data', (data: Buffer) => {
          output += data.toString();
        });

        process.on('close', (code) => {
          if (code !== 0) {
            reject(new Error('Ollama command failed'));
            return;
          }
          resolve(output.trim());
        });
      });
    } catch (error: unknown) {
      console.error(
        `Error fetching completion: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
      return null;
    }
  }
}
