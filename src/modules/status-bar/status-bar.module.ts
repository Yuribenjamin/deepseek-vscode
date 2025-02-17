import { Module } from '@nestjs/common';
import { StatusBarService } from './status-bar.service';

@Module({
  providers: [StatusBarService],
  exports: [StatusBarService],
})
export class StatusBarModule {}
