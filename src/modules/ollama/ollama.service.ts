import { Injectable } from '@nestjs/common';
import { spawn, execSync } from 'child_process';
import * as vscode from 'vscode';
import { ConfigService } from '../config/config.service';
import { AxiosResponse } from 'axios';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';

interface OllamaListResponse {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
}


@Injectable()
export class OllamaService {
  private readonly apiUrl = 'http://localhost:11434/api/generate';
  private selectedModel: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async listModels(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      const process = spawn('ollama', ['list']);
      let output = '';

      process.stdout.on('data', (data: Buffer) => {
        output += data.toString();
      });

      process.stderr.on('data', (data: Buffer) => {
        console.error('[Ollama Error] stderr:', data.toString());
      });

      process.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(`Ollama list command failed with code ${code}`));
          return;
        }
        try {
          const parsedData = this.parseOllamaListOutput(output);
          const models = parsedData
            .filter((item) => typeof item.name === 'string')
            .map((item) => item.name)
            .filter((name) => name.includes('deepseek'));
          resolve(models);
        } catch (error) {
          reject(new Error(`Failed to parse model list: ${error.message}`));
        }
      });

      process.on('error', (error) => {
        reject(new Error(`Failed to spawn ollama list: ${error.message}`));
      });
    });
  }

  isInstalled(): boolean {
    try {
      execSync('ollama --version', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }

  runModel(model: string): void {
    try {
      const terminal = vscode.window.createTerminal(`DeepSeek Coder - ${model}`);
      this.selectedModel = model;
      terminal.show();
      terminal.sendText(`ollama run ${model}`);
    } catch (error) {
      vscode.window.showErrorMessage(
        `Failed to start terminal: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async getDefaultModel(): Promise<string | null> {
    try {
      if (this.selectedModel) return this.selectedModel
      const models = await this.listModels();
      return models.length > 0 ? models[0] : null;
    } catch (error) {
      console.error('Error fetching default model:', error);
      return null;
    }
  }

  async getCompletion(input: string, model: string): Promise<string> {
    const temperature = this.configService.getTemperature()
    const maxTokens = this.configService.getMaxTokens();
    const topP = this.configService.getTopP()

    const payload = {
      model,
      prompt: input,
      options: {
        temperature,
        num_ctx: maxTokens,
        top_p: topP,
      },
      stream: false,
    };

    console.log('Request Payload:', JSON.stringify(payload));

    return this.httpService
      .post(this.apiUrl, payload, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((response: AxiosResponse) => {
          const data = response.data;
          console.log(data.response)
          if (!data.response) {
            throw new Error('No response field in Ollama API response');
          }
          return data.response.trim();
        }),
        catchError((error) => {
          console.error('[Ollama API Error]', error.response?.data || error.message);
          return throwError(
            new Error(
              `Failed to fetch completion: ${
                error.response?.data?.message || error.message || 'Unknown error'
              }`,
            ),
          );
        }),
      )
      .toPromise();
  }

  private parseOllamaListOutput(output: string): OllamaListResponse[] {
    const lines = output.trim().split('\n');
    if (lines.length < 2) {
      throw new Error('Unexpected output format from ollama list');
    }

    const headers = lines[0]
      .toLowerCase()
      .trim()
      .split(/\s{2,}/)
      .map((h) => h.replace(/\s+/g, '_'));
    return lines.slice(1).map((line) => {
      const values = line.split(/\s{2,}/);
      return Object.fromEntries(headers.map((key, i) => [key, values[i] || '']));
    }) as unknown as OllamaListResponse[];
  }
}