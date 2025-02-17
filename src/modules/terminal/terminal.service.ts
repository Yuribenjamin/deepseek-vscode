import { Injectable } from '@nestjs/common';
import { OllamaService } from '../ollama/ollama.service';

@Injectable()
export class TerminalService {
  constructor(private readonly ollamaService: OllamaService) {}

  createTerminal(model: string) {
    this.ollamaService.runModel(model);
  }
}
