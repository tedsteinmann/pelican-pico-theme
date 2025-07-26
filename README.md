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

# Simplified Navigation Configuration

Navigation is automatically generated based on your content structure:

1. **Root Pages**: Any `.md` file in the content root directory (like `about.md`) 
2. **Content Folders**: Any top-level folder containing articles (like `work/`, `blog/`)

## Configuration

Only one configuration setting is needed:

```python
# Folders to ignore in auto-navigation
IGNORE_FOLDERS = ['.obsidian', 'static', 'templates', 'drafts']
```

- **IGNORE_FOLDERS**: List of folder names to exclude from automatic navigation
- Default folders are ignored: `.obsidian`, `static`, `templates`, `drafts`

## Content Structure

```
content/
├── about.md              # Root page → "About" in navigation
├── work.md               # Content list page → "Presentations" in navigation
├── blog.md               # Content list page → "Blog Posts" in navigation  
├── work/                 # Content folder
│   ├── project1.md
│   └── project2.md
├── blog/                 # Content folder
│   ├── post1.md
│   └── post2.md
└── static/              # Ignored folder
```

## Content List Pages

For content folders (like `work/`, `blog/`), create corresponding pages in the content root to control how they're displayed:

**work.md:**
```markdown
---
title: Presentations
template: content_list
section_name: work
group_by_category: true
---
```

**blog.md:**
```markdown
---
title: Blog Posts  
template: content_list
section_name: blog
group_by_category: false
---
```

### Content List Options

- **section_name**: Which folder to display content from
- **group_by_category**: `true` to group by category, `false` for chronological list

## Templates

This theme includes the following templates:

- `base.html` - Base template with common layout
- `index.html` - Homepage template
- `article.html` - Individual article/post template
- `page.html` - Static page template
- `content_list.html` - Flexible content listing template for any content section
- `category.html` - Category archive
- `tag.html` - Tag archive
- `author.html` - Author archive

### Content List Template

The `content_list.html` template displays content from any folder. To use it, create a page with the following metadata:

```markdown
---
title: Your Section Title
template: content_list
section_name: your_folder_name
group_by_category: true  # or false
---
```

The template will automatically:
- Use the page title as the display name
- Filter content from the specified folder
- Group by category or list chronologically based on the `group_by_category` setting

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