from pathlib import Path
import yaml

BASE_DIR = Path(__file__).parent
site_file = BASE_DIR / 'site.yml'
data = {}
if site_file.exists():
    with open(site_file, 'r', encoding='utf-8') as f:
        data = yaml.safe_load(f) or {}

site = data.get('site', {})
SITENAME = site.get('title', '')
AUTHOR = site.get('author', '')
SITEURL = site.get('url', '')
DESCRIPTION = site.get('description', '')
SITE_IMAGE = site.get('image', '')

HOMEPAGE = data.get('homepage', {})
SEO = data.get('seo', {})
SOCIAL = data.get('social', [])

RELATIVE_URLS = False
