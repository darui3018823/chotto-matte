# Contributing to Chotto Matte! Generator

> [日本語版はこちら / Japanese version](./japanese/CONTRIBUTING.md)

Thank you for your interest in contributing to Chotto Matte! Generator! This document provides guidelines for contributing to the project.

## Table of Contents
- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Coding Guidelines](#coding-guidelines)
- [Pull Request Process](#pull-request-process)
- [License](#license)

## Code of Conduct

Please be respectful and constructive in all interactions. We aim to maintain a welcoming and inclusive community.

## How to Contribute

### Reporting Bugs
- Check if the issue has already been reported
- Use the GitHub issue tracker
- Provide detailed information:
  - Browser version and OS
  - Steps to reproduce
  - Expected vs actual behavior
  - Screenshots if applicable

### Suggesting Enhancements
- Use the GitHub issue tracker
- Clearly describe the feature and its benefits
- Consider backward compatibility

### Code Contributions
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly
5. Commit with clear messages
6. Push to your fork
7. Open a Pull Request

## Development Setup

```bash
# Clone the repository
git clone https://github.com/darui3018823/chotto-matte.git
cd chotto-matte

# Install dependencies (for Tailwind CSS)
npm install

# Build Tailwind CSS (if needed)
npx tailwindcss -i input.css -o css/tailwind.css

# Run the server
go run server.go

# Access at http://localhost:8080
```

## Coding Guidelines

### JavaScript
- Use modern ES6+ syntax
- Follow existing code style
- Add comments for complex logic
- Avoid global variables when possible

### HTML/CSS
- Use semantic HTML
- Follow Tailwind CSS conventions
- Maintain responsive design
- Support dark/light themes

### Go
- Follow standard Go formatting (`go fmt`)
- Keep server code simple and focused

### Commit Messages
- Use clear, descriptive messages
- Start with a verb in imperative mood (e.g., "Add", "Fix", "Update")
- Reference issue numbers when applicable

Example:
```
Fix vertical text alignment in canvas rendering

- Align column tops consistently
- Match preview display behavior
- Fixes #123
```

## Pull Request Process

1. **Update Documentation**: If your changes affect usage, update the README
2. **Test Thoroughly**: Verify in Chrome, Firefox, and Edge
3. **Maintain Compatibility**: Ensure existing features still work
4. **Clear Description**: Explain what, why, and how
5. **Screenshots**: Include before/after images for UI changes
6. **License**: Ensure your contributions are compatible with BSD-2-Clause

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] Comments added for complex code
- [ ] Documentation updated if needed
- [ ] Tested in multiple browsers
- [ ] No console errors or warnings
- [ ] Commit messages are clear

## Important Notes

### Image Assets
The bundled image (`assets/chotto-matte.png`) is copyrighted and used with permission. Do not:
- Replace or modify the original image
- Add new copyrighted images without proper authorization
- Change image licensing terms

See [License.md](./License.md) for details.

### Font Licensing
All fonts used must be properly licensed. When adding fonts:
- Ensure they are open source or have appropriate licenses
- Update [Notice.md](./Notice.md) with license information
- Include license files in the `fonts/` directory

## Questions?

Feel free to open an issue for questions or clarifications about contributing.

---

**Thank you for contributing!**
