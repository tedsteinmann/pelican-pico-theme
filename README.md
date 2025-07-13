# Pelican Pico Theme

A modern, responsive Pelican theme built with [Pico CSS](https://picocss.com/) - a minimal CSS framework for semantic HTML.

## Features

- **Lightweight & Fast**: Minimal CSS and JavaScript for optimal performance
- **Responsive Design**: Mobile-first approach with clean layouts
- **Semantic HTML**: Built with accessible, semantic markup
- **Dark/Light Mode**: Automatic theme switching based on user preference
- **Portfolio Support**: Designed for showcasing work and projects
- **Clean Typography**: Beautiful, readable fonts and spacing
- **SEO Optimized**: Proper meta tags and structured data

## Installation

### As a Git Submodule (Recommended)

```bash
git submodule add https://github.com/tedsteinmann/pelican-pico-theme.git themes/pico
```

### Manual Installation

```bash
git clone https://github.com/tedsteinmann/pelican-pico-theme.git themes/pico
```

## Configuration

Add the following to your `pelicanconf.py`:

```python
THEME = 'themes/pico'

# Theme-specific settings
HANDLE = 'yourusername'  # Social media handle
DESCRIPTION = 'Your site description for SEO and social sharing'

# Optional: Customize navigation
DISPLAY_CATEGORIES_ON_MENU = False
DISPLAY_PAGES_ON_MENU = True

# Social links (optional)
SOCIAL = (
    ('LinkedIn', 'https://linkedin.com/in/yourprofile'),
    ('Twitter', 'https://twitter.com/yourhandle'),
    ('GitHub', 'https://github.com/yourusername'),
)
```

## Templates

This theme includes the following templates:

- `base.html` - Base template with common layout
- `index.html` - Homepage template
- `article.html` - Individual article/post template
- `page.html` - Static page template
- `blog_list.html` - Blog post listing
- `work_list.html` - Portfolio work listing
- `category.html` - Category archive
- `tag.html` - Tag archive
- `author.html` - Author archive

## Customization

### Static Files

The theme includes:
- `static/css/pico.min.css` - Pico CSS framework
- `static/css/style.css` - Custom theme styles
- `static/images/favicon.ico` - Default favicon

### Custom Styles

To customize the appearance, modify `static/css/style.css` or add your own CSS files.

### Images

For optimal performance, use WebP images when possible. The theme works well with responsive images.

## Portfolio Usage

This theme is optimized for portfolio sites. Structure your content as:

```
content/
├── pages/
│   └── about.md
└── work/
    ├── project1.md
    └── project2.md
```

## Requirements

- Pelican 4.0+
- Python 3.6+

## Browser Support

This theme supports all modern browsers:
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This theme is released under the MIT License. See [LICENSE](LICENSE) for details.

## Credits

- Built with [Pico CSS](https://picocss.com/)
- Designed for [Pelican](https://getpelican.com/)

## Author

**Ted Steinmann**
- Website: [ted.steinmann.me](https://ted.steinmann.me)
- GitHub: [@tedsteinmann](https://github.com/tedsteinmann)
- X: [tedsteinmann](https://x.com/tedsteinmann)