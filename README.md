# Pelican Pico Theme

A modern, responsive Pelican theme built with [Pico CSS](https://picocss.com/) - a minimal CSS framework for semantic HTML.

## Features

- **Lightweight & Fast**: Minimal CSS and JavaScript for optimal performance
- **Responsive Design**: Mobile-first approach with clean layouts
- **Semantic HTML**: Built with accessible, semantic markup
- **Dark/Light Mode**: Automatic theme switching based on user preference
- **Dynamic Navigation**: Automatically generates navigation from pages and article categories
- **Portfolio Support**: Designed for showcasing work and projects
- **Clean Typography**: Beautiful, readable fonts and spacing
- **SEO Optimized**: Proper meta tags and structured data
- **Category Organization**: Automatic category pages for organizing content
- **Social Share Integration**: Built-in support for automatic social card generation

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

Site metadata can be defined in a `site.yml` file placed next to your Pelican configuration:

```yaml
site:
  title: Your Site Name
  author: Your Name
  url: https://example.com
  description: Your site description for SEO and social sharing
  image: static/portrait.webp

homepage:
  title: Your Name
  subtitle: Developer
  summary: Building things
  image: static/portrait.webp

seo:
  og_image: static/social-card.jpg
  twitter_username: yourhandle

social:
  - name: LinkedIn
    url: https://www.linkedin.com/in/yourusername/
  - name: GitHub
    url: https://github.com/yourusername
```

These values populate Pelican configuration variables used throughout the templates:

- `SITENAME` – site name shown in navigation and metadata
- `AUTHOR` – author meta tag and homepage fallback
- `SITEURL` – canonical site URL for links and social cards
- `DESCRIPTION` – default description for meta and social tags
- `SITE_IMAGE` – fallback portrait image for the homepage
- `HOMEPAGE` – mapping with `title`, `subtitle`, `summary`, `image`
- `SEO` – mapping with `og_image` and `twitter_username`
- `CALL_TO_ACTION` – list of homepage links (`name`, `url`, optional `button_class`)
- `DEFAULT_LANG` – language code used in the `<html>` tag (defaults to `en`)

If you do not use `site.yml`, define these variables manually in `pelicanconf.py` or `publishconf.py`.

Add the following to your `pelicanconf.py`:

```python
THEME = 'themes/pico'

# Content paths
PATH = 'content'                      # Your content directory
PAGE_PATHS = ['']                     # Pages in content root
ARTICLE_PATHS = ['articles']          # Articles in subdirectory

```

You can explicitly control the top-level navigation using `MENUITEMS`. This is useful when you want a specific order or labels that differ from page filenames. `MENUITEMS` should be a list of (title, url) tuples.

Example `pelicanconf.py` additions:

```python
# Explicit menu items (title, link)
MENUITEMS = [
  ('About', '/about.html'),
  ('Projects', '/category/projects.html'),
  ('Downloads', '/category/downloads.html'),
]

# When present, MENUITEMS is rendered by the theme's navbar.
# Statically configured MENUITEMS works together with the automatic
# page/category menus controlled by DISPLAY_PAGES_ON_MENU and
# DISPLAY_CATEGORIES_ON_MENU — use whichever combination fits your site.
```

## Social Share Cards

This theme includes built-in support for automatic social media card generation using the [pelican-social-share](https://github.com/tedsteinmann/pelican-social-share) plugin.

### Setup

1. **Install the plugin**:
   ```bash
   # Add as submodule
   git submodule add https://github.com/tedsteinmann/pelican-social-share.git plugins/pelican-social-share
   
   # Install Playwright for screenshot generation
   pip install playwright
   playwright install chromium
   ```

2. **Configure in `pelicanconf.py`**:
   ```python
   PLUGINS = [
       'social_share',  # Add to your existing plugins
       # ... other plugins
   ]

   # Social Share Plugin Settings
   SOCIAL_TEMPLATE_NAME = "social_card.html"
   SOCIAL_PORTRAIT_PATH = "content/static/images/portrait.jpg"
   SOCIAL_SCOPE = "articles"  # "articles", "pages", or "both"
   
   # Optional performance settings
   SOCIAL_HASH_SKIP = True  # Skip unchanged content
   SOCIAL_DISABLE_SCREENSHOT = False  # Set True for faster dev builds
   ```

3. **Add taglines to your content**:
   ```markdown
   ---
   title: My Amazing Article
   date: 2025-01-01
   category: blog
   tagline: This compelling tagline will appear on social cards
   ---
   
   Your article content here...
   ```

### How It Works

The plugin automatically:
1. **Generates HTML cards** using the theme's `social_card.html` template for any content with a `tagline` field
2. **Creates PNG images** (1200×675) via browser screenshot for social sharing
3. **Sets metadata** so the theme automatically uses generated images in Open Graph and Twitter meta tags
4. **Provides fallbacks** to your existing SEO images when no tagline is present

### Social Card Template

The theme includes a `social_card.html` template that creates beautiful, branded social cards using your existing theme styles:

- **Left side**: Large, bold tagline text using theme typography
- **Right side**: Portrait image (configurable via `SOCIAL_PORTRAIT_PATH`)
- **Footer**: Site name for branding
- **Consistent styling**: Uses Pico CSS variables for colors and spacing

### Generated Files

For each article with a `tagline`, the plugin creates:
- `content/social/{slug}.html` - The social card HTML (versioned with your content)
- `content/static/images/social/{slug}.png` - The final social share image

### Development Workflow

**For theme development** (faster builds):
```python
SOCIAL_DISABLE_SCREENSHOT = True  # Skip PNG generation
```

**For content development** (automatic regeneration):
```python
SOCIAL_HASH_SKIP = True  # Only regenerate when taglines change
```

### Metadata Priority

The theme's `base.html` uses this priority for social images:
1. **Plugin-generated images** (`article.metadata.social_image`) - 1200×675 PNG
2. **Manual article images** (`article.og_image`) - Your existing setup
3. **Global fallback** (`SEO.og_image`) - Site-wide default

This ensures a smooth transition where you can add taglines gradually while keeping existing social images working.

## Quick Start

1. Install the theme
2. Create `site.yml` and update your `pelicanconf.py` with the configuration above
3. Create content structure:
   ```
   content/
   ├── index.md          # Provides homepage content (not in navigation)
   ├── about.md          # Will appear as "About" in navigation
   └── articles/
       └── first-post.md # category: blog → "Blog" in navigation
   ```
4. Build your site: `pelican content`

## Navigation

Navigation is automatically generated using standard Pelican functionality:

1. **Pages**: Any `.md` file in the content root directory appears as individual navigation items
2. **Categories**: Article categories automatically appear as navigation items when articles are published

### Configuration

```python
# Standard Pelican settings for navigation
DISPLAY_PAGES_ON_MENU = True          # Show pages in navigation
DISPLAY_CATEGORIES_ON_MENU = True     # Show categories in navigation

# Content organization
PAGE_PATHS = ['']                     # Root directory for pages
ARTICLE_PATHS = ['articles']          # Subdirectory for articles
ARTICLE_EXCLUDES = ['drafts', 'templates', 'static']  # Exclude from articles
```

### Navigation Structure

- **Pages** (individual nav items): Content in the root directory with `title` metadata
- **Categories** (grouped nav items): Automatically generated from `category` metadata in published articles

## Content Structure

```
content/
├── index.md              # Homepage content (hidden from navigation)
├── about.md              # Page → "About" in navigation
├── contact.md            # Page → "Contact" in navigation
├── articles/             # Articles folder
│   ├── blog-post-1.md   # category: blog → "Blog" in navigation
│   ├── blog-post-2.md   # category: blog
│   ├── presentation-1.md # category: presentation → "Presentation" in navigation
│   └── presentation-2.md # category: presentation
├── social/               # Generated social card HTML (auto-created)
└── static/              
    ├── images/
    │   ├── portrait.jpg  # Your portrait for social cards
    │   └── social/       # Generated social share PNGs (auto-created)
    └── ...               # Other static files
```

### Article Metadata

Articles should include category metadata to appear in navigation:

```markdown
---
title: My Blog Post
date: 2025-01-01
status: published
category: blog
tagline: Compelling social media description  # Optional: generates social card
tags:
  - example
summary: Brief description
---
```

**Important**: Only articles with `status: published` will appear in category navigation.

## Templates

This theme includes the following standard Pelican templates:

- `base.html` - Base template with common layout and navigation
- `index.html` - Homepage template
- `article.html` - Individual article/post template  
- `page.html` - Static page template
- `category.html` - Category listing template (automatically generated)
- `tag.html` - Tag archive template
- `author.html` - Author archive template
- `social_card.html` - Social media card template (for pelican-social-share plugin)

### Navigation Template

The navigation is defined in `navbar.html` and automatically includes:
- All pages from the content root directory
- All categories from published articles

## Category Pages

Category pages are automatically generated by Pelican when you have published articles with category metadata. Each category gets its own page at `/category/{category-name}.html` listing all articles in that category.

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
Consider using the [pelican-webp-images](https://github.com/tedsteinmann/pelican-webp-images) plugin to automatically generate multiple sizes. The homepage template (`index.html`) now renders the image defined in `index.md` using a `<picture>` tag so responsive WebP sources are served when available.

## Troubleshooting

### Categories Not Appearing in Navigation

If your article categories aren't showing up in navigation, check:

1. **Article Status**: Only articles with `status: published` appear in navigation
   ```markdown
   ---
   title: My Article
   status: published  # Not 'draft'
   category: blog
   ---
   ```

2. **Category Metadata**: Articles must have a `category` field
3. **Configuration**: Ensure `DISPLAY_CATEGORIES_ON_MENU = True` in your config

### Pages Not Appearing

If pages aren't showing in navigation:

1. **Location**: Pages must be in your content root directory (defined by `PAGE_PATHS`)
2. **Metadata**: Pages need a `title` field
3. **Configuration**: Ensure `DISPLAY_PAGES_ON_MENU = True`

### Social Cards Not Generating

If social cards aren't being created:

1. **Tagline Required**: Articles must have a `tagline` field in metadata
2. **Plugin Installation**: Ensure pelican-social-share is installed and in `PLUGINS`
3. **Playwright Setup**: Run `playwright install chromium` after installing
4. **Template Exists**: Verify `social_card.html` template exists in your theme
5. **Portrait Path**: Check that `SOCIAL_PORTRAIT_PATH` points to an existing image

## Portfolio Usage

This theme is optimized for portfolio sites. Structure your content as:

```
content/
├── index.md              # Homepage content (hidden from navigation)
├── about.md              # Page for "About" navigation
├── articles/             # Articles organized by category
│   ├── blog-post-1.md    # category: blog
│   ├── presentation-1.md # category: presentation  
│   └── project-1.md      # category: portfolio
└── static/               # Images, files, etc.
```

### Example Article Structure

**Blog Post:**
```markdown
---
title: My Latest Thoughts
date: 2025-01-01
status: published
category: blog
tagline: Insightful thoughts on the latest trends
tags:
  - thoughts
  - update
summary: A brief summary of the post
---

Your blog content here.
```

**Portfolio Item:**
```markdown
---
title: Amazing Project
date: 2025-01-01
status: published
category: portfolio
tagline: Innovative solution built with modern technology
tags:
  - web-development
  - design
summary: Description of the project
image: images/project-thumbnail.webp
---

Project description and details.
```

## Requirements

- Pelican 4.0+
- Python 3.6+
- Playwright (for social card generation)

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