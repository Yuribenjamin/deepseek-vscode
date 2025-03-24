import { Module } from '@nestjs/common';
import { CompletionProvider } from './completion.provider';
import { OllamaModule } from '../ollama/ollama.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  providers: [CompletionProvider],
  exports: [CompletionProvider],
  imports: [OllamaModule, LoggingModule]
})
export class CompletionModule {}
