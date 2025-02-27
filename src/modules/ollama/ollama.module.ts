import { Module } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { ConfigModule } from '../config/config.module'
import { HttpModule } from '@nestjs/axios';
@Module({
  providers: [OllamaService],
  exports: [OllamaService],
  imports: [ConfigModule, HttpModule]
})
export class OllamaModule {}
