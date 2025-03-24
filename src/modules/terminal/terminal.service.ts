import { OllamaService } from '../ollama/ollama.service';

export class TerminalService {
  constructor(private readonly ollamaService: OllamaService) {}

  createTerminal(model: string) {
    this.ollamaService.runModel(model);
  }
}
