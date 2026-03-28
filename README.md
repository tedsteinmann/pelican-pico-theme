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
- **NLWeb Chat Widget**: Custom chat interface for Cloudflare NLWeb with streaming SSE responses

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
  og_image: og-image.jpg
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
- `SITEURL` – canonical site URL for links
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

## NLWeb Chat Integration

This theme includes a custom, Pico-native chat widget that integrates with Cloudflare's NLWeb (Natural Language Web Search) Workers. The implementation is built from scratch to avoid external dependencies and maintain consistent styling with the theme.

### Features

- **Custom UI**: Pure JavaScript implementation with no external widget dependencies
- **Pico-Native Styling**: Uses only Pico CSS variables for automatic dark/light mode support
- **Server-Sent Events (SSE)**: Streaming responses for real-time interaction
- **Conversation Persistence**: Saves chat history to localStorage
- **Result Filtering**: Automatically cleans URLs and metadata from descriptions
- **Semantic HTML**: Accessible markup with ARIA attributes
- **Responsive Design**: Mobile-first with optimized layouts

### Architecture

The chat widget consists of three main components:

1. **nlweb-chat.js** (558 lines) - Custom NLWebChat class with SSE streaming
2. **nlweb-chat.css** (361 lines) - Pico-native styling using CSS variables
3. **nlweb_chat.html** (49 lines) - Semantic HTML template with data attributes

### Configuration

Add these settings to your `pelicanconf.py`:

```python
# NLWeb Chat Configuration
NLWEB_CHAT_ENABLED = True
NLWEB_CHAT_ENDPOINT = "https://your-worker.workers.dev"
NLWEB_CHAT_SITE = "your-site-url"
NLWEB_CHAT_PLACEHOLDER = "Ask a question about this site..."
NLWEB_CHAT_HISTORY_KEY = "nlweb_conversations"  # localStorage key
NLWEB_CHAT_AI_MODE = True  # Enable AI-generated responses
NLWEB_CHAT_AI_BINDING = "AI"  # Name of your Workers AI binding
```

**Configuration Variables:**

- **NLWEB_CHAT_ENABLED** - Toggle chat widget on/off (boolean)
- **NLWEB_CHAT_ENDPOINT** - Your Cloudflare Worker URL (must end without trailing slash)
- **NLWEB_CHAT_SITE** - The site domain being indexed/searched
- **NLWEB_CHAT_PLACEHOLDER** - Input field placeholder text
- **NLWEB_CHAT_HISTORY_KEY** - localStorage key for conversation persistence
- **NLWEB_CHAT_AI_MODE** - Enable AI-generated responses (default: False)
- **NLWEB_CHAT_AI_BINDING** - Name of Workers AI binding in your Worker (default: "AI")

### Template Integration

The chat widget is included in templates via:

```jinja2
{% include 'nlweb_chat.html' %}
```

This automatically renders when `NLWEB_CHAT_ENABLED = True`. The widget initializes on DOM ready using data attributes from the configuration.

### Cloudflare Worker Setup

The chat widget requires a Cloudflare Worker with NLWeb capabilities:

1. **Create a Worker** in your Cloudflare dashboard
2. **Enable NLWeb** (Natural Language Web Search) for the Worker
3. **Configure the /ask endpoint** to accept POST requests with:
   ```json
   {
     "query": "user question",
     "site": "your-domain",
     "mode": "answer"
   }
   ```

4. **Enable CORS** for your site domain:
   ```javascript
   headers: {
     'Access-Control-Allow-Origin': 'https://your-site.com',
     'Access-Control-Allow-Methods': 'POST, OPTIONS',
     'Access-Control-Allow-Headers': 'Content-Type',
   }
   ```

### API Message Types

The widget handles these SSE message types from the `/ask` endpoint:

- **api_version** - API metadata (logged, no UI action)
- **data_retention** - Data retention notice (logged, no UI action)
- **sites** - Sites being searched (optionally displayed)
- **result_batch** / **results** - Search results with URLs, titles, descriptions
- **answer** / **content** - Streaming answer text (if implemented)
- **complete** / **done** - End of stream signal

### Result Filtering

The widget automatically cleans result descriptions:

- **Removes YAML frontmatter** (---, description:, title:, etc.)
- **Strips all URLs** (including AWS S3 signed URLs with access keys)
- **Removes file paths** (.html, .pdf references)
- **Truncates to 200 chars** with smart sentence/word boundary detection
- **Filters short descriptions** (under 20 chars are hidden)

### CSS Customization

The widget uses Pico CSS variables exclusively, so it automatically inherits your theme:

```css
/* Automatic from Pico variables: */
--pico-primary           /* User message background */
--pico-card-background-color  /* Assistant message background */
--pico-muted-border-color     /* Container borders */
--pico-muted-color            /* Placeholder and muted text */
--pico-background-color       /* Messages container background */
```

**Custom CSS Variables (optional):**

```css
:root {
  /* Override chat-specific styles */
  --nlweb-max-height: 60vh;
  --nlweb-min-height: 200px;
  --nlweb-message-max-width: 85%;
}
```

### JavaScript API

The `NLWebChat` class is initialized automatically via:

```javascript
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('nlweb-chat-container');
  if (container && container.dataset.endpoint) {
    new NLWebChat({
      containerId: 'nlweb-chat-container',
      endpoint: container.dataset.endpoint,
      site: container.dataset.site,
      placeholder: container.dataset.placeholder,
      storageKey: container.dataset.storageKey
    });
  }
});
```

**Methods:**

- `handleSubmit()` - Process user query submission
- `streamQuery(query)` - Fetch and stream SSE response from API
- `handleStreamEvent(data, contentEl, assistantMessage)` - Process message types
- `addMessage(role, content)` - Add user/assistant message to UI
- `scrollToMessage(role)` - Smooth scroll to keep user question visible
- `generateSummaryFromResults(results)` - Create natural language summary
- `extractCleanDescription(rawDescription)` - Filter and clean result descriptions
- `startNewConversation()` - Clear chat and start fresh
- `loadConversations()` / `saveConversations()` - Persist to localStorage

### Conversation Persistence

Chat history is stored in `localStorage` using the configured key (default: `nlweb_conversations`):

```javascript
{
  id: "timestamp-string",
  timestamp: 1234567890,
  title: "First question snippet...",
  messages: [
    { role: "user", content: "Question", timestamp: 1234567890 },
    { role: "assistant", content: "Answer", results: [...], timestamp: 1234567891 }
  ]
}
```

**Features:**
- Auto-generates title from first user message (50 char limit)
- Keeps last 50 conversations
- Survives browser refresh
- Per-site storage (via storage key)

### UI Behavior

**Initial State:**
- Chat messages container is **hidden** until first question
- Only input form is visible
- Send button disabled until text entered

**During Interaction:**
- Messages container reveals on first submit
- Streaming loading animation (3 pulsing dots)
- User question stays at top while answer streams
- Results displayed as clickable cards with titles, descriptions, URLs

**Keyboard Shortcuts:**
- `Enter` - Submit question
- `Shift+Enter` - New line in textarea
- Auto-resize textarea (max 120px height)

### Security Considerations

1. **No API Keys in Client**: All authentication should be handled by Cloudflare Worker
2. **CORS Protection**: Worker should validate origin headers
3. **Rate Limiting**: Implement in Worker to prevent abuse
4. **Content Sanitization**: All user input is escaped via `textContent` (no XSS risk)
5. **URL Filtering**: AWS S3 signed URLs and access keys are stripped from results
6. **No eval()**: Pure DOM manipulation, no code execution

### Troubleshooting

#### Chat Widget Not Appearing

1. **Check configuration**: Verify `NLWEB_CHAT_ENABLED = True` in config
2. **Build site**: Ensure templates are rebuilt after config changes
3. **Browser console**: Look for "NLWeb Chat: Container not found" error
4. **Template inclusion**: Verify `{% include 'nlweb_chat.html' %}` exists in your template

#### No Results Returned

1. **Worker endpoint**: Verify URL is correct (no trailing slash)
2. **CORS headers**: Check browser console for CORS errors
3. **API response**: Open Network tab and inspect `/ask` POST request
4. **Site indexing**: Ensure your site is indexed by NLWeb Worker
5. **Message types**: Check console logs for unknown message types

#### Styling Issues

1. **CSS not loading**: Verify `nlweb-chat.css` is in `static/css/`
2. **Theme conflicts**: Check for CSS specificity issues with custom styles
3. **Dark mode**: Pico variables automatically handle dark mode - check browser preference
4. **Mobile layout**: Test responsive breakpoint at 768px

#### Console Errors

The widget only logs:
- **console.error()** - For legitimate errors (parsing, network, storage)
- **console.warn()** - For unknown message types from API

All debug logging has been removed for production. If you need to debug:
1. Check Network tab for API requests/responses
2. Verify SSE stream format (data: prefix required)
3. Use `JSON.parse()` test on raw responses

### Performance Notes

- **No External Dependencies**: Zero npm packages, CDN calls, or third-party scripts
- **Lazy Initialization**: Widget only initializes when container found
- **Efficient Rendering**: Uses DocumentFragment for batch DOM updates
- **Debounced Scroll**: `requestAnimationFrame` for smooth scrolling
- **Smart Caching**: localStorage limits to 50 conversations
- **Minimal CSS**: 361 lines, ~8KB unminified

### Accessibility

- **ARIA Labels**: All interactive elements properly labeled
- **Keyboard Navigation**: Full keyboard support (no mouse required)
- **Screen Readers**: Live region announces new messages (`aria-live="polite"`)
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Focus Management**: Form elements maintain logical focus order
- **Color Contrast**: Inherits Pico's WCAG AA compliant colors

### Browser Compatibility

Requires modern browser with:
- ES6 JavaScript (class syntax, async/await, arrow functions)
- Fetch API with streaming
- ReadableStream and TextDecoder
- CSS Grid and CSS variables
- localStorage

**Supported:**
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Quick Start

1. Install the theme
2. Create `site.yml` and update your `pelicanconf.py` with the configuration above
3. (Optional) Configure NLWeb Chat by adding required settings to `pelicanconf.py`
5. Create content structure:
   ```
   content/
   ├── index.md          # Provides homepage content (not in navigation)
   ├── about.md          # Will appear as "About" in navigation
   └── articles/
       └── first-post.md # category: blog → "Blog" in navigation
   ```
6. Build your site: `pelican content`

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
└── static/              
    ├── images/
    │   ├── portrait.jpg
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
- `nlweb_chat.html` - NLWeb chat widget template (for Cloudflare NLWeb integration)

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
- `static/css/theme.css` - Custom theme styles
- `static/css/nlweb-chat.css` - NLWeb chat widget styles (Pico-native)
- `static/js/nlweb-chat.js` - NLWeb chat widget functionality
- `static/images/favicon.ico` - Default favicon

### Custom Styles

To customize the appearance, modify `static/css/theme.css` or add your own CSS files.

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
- Cloudflare Worker with NLWeb (optional, for chat widget functionality)

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