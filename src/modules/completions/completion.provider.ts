import * as vscode from 'vscode';
import { Injectable } from '@nestjs/common';
import { OllamaService } from '../ollama/ollama.service';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class CompletionProvider implements vscode.CompletionItemProvider {
  constructor(
    private readonly ollamaService: OllamaService,
    private readonly loggingService: LoggingService,
  ) {}

  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): Promise<vscode.CompletionItem[]> {
    console.log('AI Completion Triggered');

    const lineText = document.lineAt(position).text.trim();
    console.log('User input:', lineText);

    if (!lineText) return [];

    const model: string | null = await this.ollamaService.getDefaultModel();
    if (!model) {
      console.log('No active AI model found');
      return [];
    }

    console.log('Fetching AI completion...');
    const aiSuggestion = await this.fetchAISuggestion(lineText, model);

    if (!aiSuggestion) {
      console.log('AI returned no suggestion');
      return [];
    }

    console.log('AI Suggestion:', aiSuggestion);
    return [
      new vscode.CompletionItem(aiSuggestion, vscode.CompletionItemKind.Text),
    ];
  }

  private async fetchAISuggestion(
    input: string,
    model: string,
  ): Promise<string | null> {
    try {
      const response: unknown = await this.ollamaService.getCompletion(
        input,
        model,
      );
      if (typeof response === 'string') {
        return response;
      }
      throw new Error('Invalid response format');
    } catch (error: unknown) {
      this.loggingService.logError(error);
      return null;
    }
  }
}
