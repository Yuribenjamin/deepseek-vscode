import { Module } from '@nestjs/common';
import { TerminalService } from './terminal.service';

@Module({
  providers: [TerminalService],
  exports: [TerminalService],
})
export class TerminalModule {}
