import * as vscode from 'vscode';
import { OllamaService } from '../ollama/ollama.service';
import { LoggingService } from '../logging/logging.service';

export class CompletionProvider implements vscode.CompletionItemProvider {
  constructor(
    private readonly ollamaService: OllamaService,
    private readonly loggingService: LoggingService,
  ) { }
  async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
  ): Promise<vscode.CompletionItem[]> {
    console.log('[Extension] AI Completion Triggered for:', document.fileName, position);

    const lineText = document.lineAt(position).text.trim();
    console.log('[Extension] User input:', lineText);

    if (!lineText) return [];

    const model: string | null = await this.ollamaService.getDefaultModel();
    if (!model) {
      console.log('[Extension] No active AI model found');
      return [];
    }

    console.log('[Extension] Fetching AI completion for model:', model);
    const aiSuggestion = await this.fetchAISuggestion(lineText, model);

    if (!aiSuggestion) {
      console.log('[Extension] AI returned no suggestion');
      return [];
    }

    console.log('[Extension] AI Suggestion:', aiSuggestion);
    return [
      new vscode.CompletionItem(aiSuggestion, vscode.CompletionItemKind.Text),
    ];
  }

  private async fetchAISuggestion(
    input: string,
    model: string,
  ): Promise<string | null> {
    try {
      const response: unknown = await this.ollamaService.getCompletion(input, model);
      console.log('[Extension] Completion response:', response);
      if (typeof response === 'string') {
        return response;
      }
      throw new Error('Invalid response format');
    } catch (error: unknown) {
      console.error('[Extension] Error fetching AI suggestion:', error instanceof Error ? error.message : 'Unknown error');
      this.loggingService.logError(error);
      return null;
    }
  }
}