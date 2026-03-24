from .inline_sections import (
    load_featured_sections,
    render_inline_sections,
    resolve_content_by_slug,
    resolve_featured_section,
)


def theme_jinja_globals():
    return {
        "render_inline_sections": render_inline_sections,
        "resolve_content_by_slug": resolve_content_by_slug,
        "resolve_featured_section": resolve_featured_section,
    }
