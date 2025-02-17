import { Module } from '@nestjs/common';
import { OllamaModule } from './modules/ollama/ollama.module';
import { TerminalModule } from './modules/terminal/terminal.module';
import { StatusBarModule } from './modules/status-bar/status-bar.module';
import { ConfigModule } from './modules/config/config.module';
import { CompletionModule } from './modules/completions/completion.module';
import { LoggingModule } from './modules/logging/logging.module';

@Module({
  imports: [
    OllamaModule,
    TerminalModule,
    StatusBarModule,
    ConfigModule,
    CompletionModule,
    LoggingModule,
  ],
})
export class AppModule {}
