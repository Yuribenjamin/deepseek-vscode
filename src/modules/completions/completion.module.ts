import { Module } from '@nestjs/common';
import { CompletionProvider } from './completion.provider';
import { OllamaService } from '../ollama/ollama.service';
import { OllamaModule } from 'src/modules/ollama/ollama.module';
import { LoggingModule } from 'src/modules/logging/logging.module';

@Module({
  providers: [CompletionProvider],
  exports: [CompletionProvider],
  imports: [OllamaModule, LoggingModule]
})
export class CompletionModule {}
