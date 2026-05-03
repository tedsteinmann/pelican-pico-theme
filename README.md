# Pelican Pico Theme

A modern, responsive [Pelican](https://getpelican.com/) theme built with [Pico CSS](https://picocss.com/).

## Features

- Minimal, semantic HTML/CSS
- Responsive layout
- Automatic dark/light mode via Pico CSS
- Homepage hero + call-to-action support
- Article, page, category, author, and tag templates
- SEO/social metadata support (Open Graph + Twitter)

## Install

### As a Git submodule (recommended)

```bash
git submodule add https://github.com/tedsteinmann/pelican-pico-theme.git themes/pico
```

### Clone directly

```bash
git clone https://github.com/tedsteinmann/pelican-pico-theme.git themes/pico
```

## Configure

In your Pelican project config (`pelicanconf.py`):

```python
THEME = 'themes/pico'
PATH = 'content'
PAGE_PATHS = ['pages']
ARTICLE_PATHS = ['articles']
```

Optional site metadata can be provided from `site.yml` (see `site.yml.template` for a complete example), or set directly in config.

## Local Theme Testing (Pelican-friendly workflow)

This repository includes a small demo site in `demo/` for quick visual testing.

### 1) Install dependencies

```bash
python -m venv .venv
source .venv/bin/activate
pip install pelican markdown pyyaml
```

### 2) Build the demo site

```bash
pelican demo/content -s demo/pelicanconf.py -o demo/output
```

### 3) Run a local dev server

```bash
pelican demo/content -s demo/pelicanconf.py -o demo/output --listen
```

Then open `http://localhost:8000`.

## License

MIT. See [LICENSE](LICENSE).
