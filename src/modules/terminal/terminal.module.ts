import { Module } from '@nestjs/common';
import { TerminalService } from './terminal.service';
import { OllamaModule } from '../ollama/ollama.module';

@Module({
  providers: [TerminalService],
  exports: [TerminalService],
  imports : [OllamaModule]
})
export class TerminalModule {}
