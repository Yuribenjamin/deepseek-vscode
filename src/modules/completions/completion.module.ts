import { Module } from '@nestjs/common';
import { CompletionProvider } from './completion.provider';
import { OllamaService } from '../ollama/ollama.service';

@Module({
  providers: [CompletionProvider, OllamaService],
  exports: [CompletionProvider],
})
export class CompletionModule {}
