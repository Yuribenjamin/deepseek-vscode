import { Module } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { ConfigModule } from 'src/modules/config/config.module';

@Module({
  providers: [OllamaService],
  exports: [OllamaService],
  imports: [ConfigModule]
})
export class OllamaModule {}
