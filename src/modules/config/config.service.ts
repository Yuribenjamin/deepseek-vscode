import { Injectable } from '@nestjs/common';
import * as vscode from 'vscode';

@Injectable()
export class ConfigService {
  getTemperature(): number {
    return (
      vscode.workspace
        .getConfiguration('deepseekCoder')
        .get<number>('temperature') ?? 0.7
    );
  }

  getMaxTokens(): number {
    return (
      vscode.workspace
        .getConfiguration('deepseekCoder')
        .get<number>('maxTokens') ?? 256
    );
  }

  getTopP(): number {
    return (
      vscode.workspace.getConfiguration('deepseekCoder').get<number>('topP') ??
      1.0
    );
  }
}
