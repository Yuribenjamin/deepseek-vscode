# DeepSeek VS Code Extension

## Overview
DeepSeek is a VS Code extension that integrates AI-powered code completions and interactions using DeepSeek models. It enhances the developer experience by providing intelligent suggestions and model-based assistance.

## Features
- AI-powered code completions
- Customizable AI model selection
- Terminal-based AI interaction
- Status bar integration for model tracking
- Logging for AI interactions

## Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Yuribenjamin/deepseek-vscode.git
   cd deepseek-vscode
   ```
2. Install dependencies:
   ```sh
   yarn install
   ```
3. Build the extension:
   ```sh
   yarn build
   ```
4. Run the extension in VS Code:
   ```sh
   yarn start:dev
   ```

## Usage
1. Open VS Code and activate the extension.
2. Use the command palette (`Cmd+Shift+P` / `Ctrl+Shift+P`) and select `DeepSeek: Run Model`.
3. Choose a model and start using AI-powered suggestions.

## Configuration
Modify the extension settings in VS Code:
- `deepseekCoder.enableLogging`: Enable/Disable logging for AI interactions.
- `deepseekCoder.temperature`: Adjust the AI response randomness.
- `deepseekCoder.maxTokens`: Define the maximum token limit for responses.

## Development
### Running Tests
Run unit tests with:
```sh
yarn test
```

Run end-to-end tests with:
```sh
yarn test:e2e
```

### Packaging & Publishing
To package the extension:
```sh
yarn package
```
To publish:
```sh
yarn publish
```

## Contribution
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License
This project is licensed under [MIT License](LICENSE).