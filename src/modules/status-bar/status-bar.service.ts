import { Injectable } from '@nestjs/common';
import * as vscode from 'vscode';

@Injectable()
export class StatusBarService {
  private statusBarItem: vscode.StatusBarItem;

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100,
    );
    this.statusBarItem.text = '$(sync) DeepSeek: Idle';
    this.statusBarItem.show();
  }

  init() {
    this.statusBarItem.show();
  }

  updateStatus(model: string) {
    this.statusBarItem.text = `$(sync) DeepSeek: ${model}`;
  }
}
