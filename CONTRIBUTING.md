# Contributing to DeepSeek VS Code Extension

We welcome contributions from the community! Follow these guidelines to contribute to the project.

## Getting Started

### 1. Fork the Repository
- Go to the [DeepSeek GitHub repository](https://github.com/Yuribenjamin/deepseek-vscode)
- Click on **Fork** to create a copy under your GitHub account.

### 2. Clone Your Fork
```sh
git clone https://github.com/Yuribenjamin/deepseek-vscode.git
cd deepseek-vscode
```

### 3. Install Dependencies
```sh
yarn install
```

### 4. Create a Feature Branch
```sh
git checkout -b feature-branch-name
```

## Development Guidelines
- Follow **TypeScript best practices**.
- Ensure **type safety** and avoid using `any`.
- Run `yarn format` to maintain code style.
- Write **unit tests** for all new features and fixes.
- Keep commits **small and meaningful**.

## Running the Extension Locally
```sh
yarn start:dev
```
This runs the extension in VS Code for testing.

## Testing
Run unit tests:
```sh
yarn test
```
Run end-to-end tests:
```sh
yarn test:e2e
```

## Submitting a Pull Request
1. **Commit your changes** with clear messages.
2. **Push to your fork**:
   ```sh
   git push origin feature-branch-name
   ```
3. Open a **Pull Request** on the original repository.

## Code Review Process
- Your PR will be reviewed by maintainers.
- Maintain high code quality and follow best practices.
- Address feedback before merging.

## Reporting Issues
If you find a bug, create an issue in the GitHub repository with details on:
- Steps to reproduce
- Expected vs. actual behavior
- Logs and screenshots if applicable

## License
By contributing, you agree that your code will be released under the [MIT License](LICENSE).

