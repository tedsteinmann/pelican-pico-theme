# Contributing to Pelican Pico Theme

Thank you for your interest in contributing to the Pelican Pico Theme! This document provides guidelines for contributing to this project.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/pelican-pico-theme.git
   cd pelican-pico-theme
   ```
3. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

1. Set up a test Pelican site to test your changes:
   ```bash
   mkdir test-site
   cd test-site
   pip install pelican markdown
   pelican-quickstart
   ```

2. Link your theme to the test site:
   ```bash
   ln -s /path/to/pelican-pico-theme themes/pico
   ```

3. Update your `pelicanconf.py` to use the theme:
   ```python
   THEME = 'themes/pico'
   ```

## Making Changes

### Code Style

- Use semantic HTML5 elements where possible
- Follow CSS best practices and maintain consistency with existing styles
- Keep JavaScript minimal and ensure it's accessible
- Test your changes in multiple browsers

### Templates

- Use Jinja2 template syntax correctly
- Maintain backward compatibility with existing template variables
- Document any new template variables or features
- Ensure templates are accessible (proper ARIA labels, semantic markup)

### CSS

- Maintain consistency with Pico CSS conventions
- Use CSS custom properties (variables) for theming
- Ensure responsive design works across all devices
- Test both light and dark modes

## Testing Your Changes

Before submitting a pull request, please:

1. Test your changes with a sample Pelican site
2. Verify the theme works with different content types (articles, pages, etc.)
3. Check responsiveness on different screen sizes
4. Test both light and dark mode (if applicable)
5. Validate HTML and CSS
6. Test accessibility with screen readers or accessibility tools

## Submitting Changes

1. Commit your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "Add responsive navigation menu"
   ```

2. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

3. Create a pull request on GitHub with:
   - A clear title describing the change
   - A detailed description of what was changed and why
   - Screenshots if the change affects the visual appearance
   - Any breaking changes noted

## Types of Contributions

We welcome several types of contributions:

### Bug Fixes
- Fix display issues
- Resolve accessibility problems
- Correct template errors

### Features
- New template layouts
- Enhanced functionality
- Improved accessibility
- Better responsive design

### Documentation
- Improve README
- Add code comments
- Create usage examples
- Write tutorials

### Performance
- Optimize CSS
- Reduce file sizes
- Improve loading times

## Guidelines

### Do
- Keep changes focused and atomic
- Write clear commit messages
- Test your changes thoroughly
- Update documentation as needed
- Follow existing code patterns
- Be respectful in discussions

### Don't
- Make breaking changes without discussion
- Add unnecessary dependencies
- Include personal or project-specific content
- Submit large, unfocused changes

## Questions?

If you have questions about contributing, please:

1. Check existing issues and pull requests
2. Open a new issue for discussion
3. Contact the maintainer: [@tedsteinmann](https://github.com/tedsteinmann)

Thank you for contributing to make this theme better for everyone!
