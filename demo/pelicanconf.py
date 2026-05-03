from pathlib import Path

AUTHOR = 'Theme Demo'
SITENAME = 'Pelican Pico Theme Demo'
SITEURL = ''
PATH = 'content'
TIMEZONE = 'UTC'
DEFAULT_LANG = 'en'

THEME = str((Path(__file__).resolve().parent.parent))

PAGE_PATHS = ['pages']
ARTICLE_PATHS = ['articles']

HOME_HIDE_TAGS = True

SEO = {}
CALL_TO_ACTION = [
    {'name': 'GitHub', 'url': 'https://github.com/', 'button_class': 'secondary'},
]

STATIC_PATHS = ['images']
