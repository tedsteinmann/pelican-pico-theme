import html
import re
from copy import deepcopy


INLINE_SECTION_TOKEN_RE = re.compile(
    r"<p>\s*(?:\[\[)?section:([a-z0-9_-]+)(?:\]\])?\s*</p>|\[\[section:([a-z0-9_-]+)\]\]",
    re.IGNORECASE,
)
INLINE_CONTENT_TOKEN_RE = re.compile(
    r"<p>\s*(?:\[\[)?content:([a-z0-9_-]+)(?:\]\])?\s*</p>|\[\[content:([a-z0-9_-]+)\]\]",
    re.IGNORECASE,
)


def _section_context_key(section_slug):
    return f"section_context_{section_slug.replace('-', '_')}"


def _strip_tags(value):
    return re.sub(r"<[^>]+>", "", value or "")


def _content_summary(content):
    summary = getattr(content, "summary", "") or ""
    return html.unescape(_strip_tags(summary)).strip()


def _taxonomy_title(slug):
    return slug.replace("-", " ").title()


def _content_url(content):
    featured_url = getattr(content, "featured_url", None)
    if featured_url:
        return featured_url

    capability_tag = getattr(content, "capability_tag", None)
    if capability_tag:
        return f"/tag/{capability_tag}.html"

    return f"/{content.url}"


def _build_content_lookup(pages=None, articles=None):
    lookup = {}

    for collection in (pages or [], articles or []):
        for content in collection:
            slug = getattr(content, "slug", None)
            if slug and slug not in lookup:
                lookup[slug] = content

    return lookup


def _build_featured_card(reference, lookup, cta_label):
    content = lookup.get(reference)
    if content:
        return {
            "slug": content.slug,
            "title": content.title,
            "url": _content_url(content),
            "description": _content_summary(content),
            "cta_label": cta_label,
        }

    if ":" not in reference:
        return None

    reference_type, slug = reference.split(":", 1)
    slug = slug.strip()
    if not slug:
        return None

    landing_content = lookup.get(slug)
    title = landing_content.title if landing_content else _taxonomy_title(slug)
    description = _content_summary(landing_content) if landing_content else ""

    if reference_type == "tag":
        return {
            "slug": slug,
            "title": title,
            "url": f"/tag/{slug}.html",
            "description": description,
            "cta_label": cta_label,
        }

    if reference_type == "category":
        return {
            "slug": slug,
            "title": title,
            "url": f"/category/{slug}.html",
            "description": description,
            "cta_label": cta_label,
        }

    return None


def resolve_content_by_slug(slug, pages=None, articles=None):
    if not slug:
        return None

    return _build_content_lookup(pages, articles).get(slug)


def resolve_featured_section(
    section_slug,
    featured_sections=None,
    pages=None,
    articles=None,
    content_obj=None,
):
    sections = featured_sections or {}
    section = sections.get(section_slug)
    if not section:
        return None

    rendered_section = deepcopy(section)
    override = None
    if content_obj is not None:
        override = getattr(content_obj, _section_context_key(section_slug), None)
    if override:
        rendered_section["description"] = override

    lookup = _build_content_lookup(pages, articles)
    cards = []
    referenced_slugs = []
    for reference_slug in rendered_section.get("references", []):
        card = _build_featured_card(
            reference_slug,
            lookup,
            rendered_section.get("cta_label", "Read more"),
        )
        if not card:
            continue

        cards.append(card)
        referenced_slugs.append(card["slug"])

    rendered_section["cards"] = cards
    rendered_section["referenced_slugs"] = referenced_slugs
    rendered_section.setdefault("slug", section_slug)
    rendered_section.setdefault("anchor", section_slug)
    return rendered_section


def build_inline_section_blocks(
    content_html,
    content_obj=None,
    content_sections=None,
    pages=None,
    articles=None,
):
    if not content_html:
        return []

    sections = content_sections or {}
    blocks = []
    last_end = 0

    for match in INLINE_SECTION_TOKEN_RE.finditer(content_html):
        start, end = match.span()
        if start > last_end:
            blocks.append({"type": "html", "content": content_html[last_end:start]})

        slug = match.group(1) or match.group(2)
        section = resolve_featured_section(
            slug,
            sections,
            pages=pages,
            articles=articles,
            content_obj=content_obj,
        )
        if section:
            blocks.append({"type": "section", "section": section})
        else:
            blocks.append({"type": "html", "content": match.group(0)})

        last_end = end

    if last_end < len(content_html):
        blocks.append({"type": "html", "content": content_html[last_end:]})

    return blocks or [{"type": "html", "content": content_html}]


def _render_card(card):
    parts = ['<article class="content-card">']

    if card.get("eyebrow"):
        parts.append(
            f'<p class="content-card-eyebrow">{html.escape(card["eyebrow"])}</p>'
        )

    title = html.escape(card.get("title", ""))
    url = card.get("url")
    if url:
        parts.append(
            '<h3 class="content-card-title">'
            f'<a href="{html.escape(url, quote=True)}" class="contrast">{title}</a>'
            '</h3>'
        )
    else:
        parts.append(f'<h3 class="content-card-title">{title}</h3>')

    if card.get("description"):
        parts.append(f'<p>{html.escape(card["description"])}</p>')

    if card.get("meta"):
        parts.append(f'<p class="content-card-meta">{html.escape(card["meta"])}</p>')

    tags = card.get("tags")
    if tags:
        tag_text = ", ".join(html.escape(str(tag)) for tag in tags)
        parts.append(f'<p class="content-card-tags">{tag_text}</p>')

    if url:
        cta_label = html.escape(card.get("cta_label", "Learn more"))
        parts.append(
            '<p class="content-card-cta">'
            f'<a href="{html.escape(url, quote=True)}">{cta_label}</a>'
            '</p>'
        )

    parts.append("</article>")
    return "".join(parts)


def _expand_inline_content_tokens(
    content_html,
    content_sections=None,
    pages=None,
    articles=None,
    seen_content_slugs=None,
):
    seen_content_slugs = set(seen_content_slugs or set())

    def replace(match):
        slug = match.group(1) or match.group(2)
        if slug in seen_content_slugs:
            return ""

        content = resolve_content_by_slug(slug, pages, articles)
        if not content:
            return match.group(0)

        return render_inline_sections(
            content.content,
            content,
            content_sections,
            pages,
            articles,
            seen_content_slugs=seen_content_slugs | {slug},
        )

    return INLINE_CONTENT_TOKEN_RE.sub(replace, content_html or "")


def render_inline_sections(
    content_html,
    content_obj=None,
    content_sections=None,
    pages=None,
    articles=None,
    seen_content_slugs=None,
):
    rendered_parts = []
    expanded_html = _expand_inline_content_tokens(
        content_html,
        content_sections,
        pages,
        articles,
        seen_content_slugs=seen_content_slugs,
    )

    for block in build_inline_section_blocks(
        expanded_html,
        content_obj,
        content_sections,
        pages=pages,
        articles=articles,
    ):
        if block["type"] == "html":
            rendered_parts.append(block["content"])
            continue

        section = block["section"]
        anchor = html.escape(section.get("anchor") or section.get("slug", ""), quote=True)
        parts = [f'<section class="content-card-section" id="{anchor}">']

        if section.get("title") or section.get("description"):
            parts.append('<header class="content-card-section-header">')
            if section.get("title"):
                parts.append(f'<h2>{html.escape(section["title"])}</h2>')
            if section.get("description"):
                parts.append(f'<p>{html.escape(section["description"])}</p>')
            parts.append("</header>")

        cards = section.get("cards") or []
        if cards:
            parts.append('<div class="content-card-grid">')
            parts.extend(_render_card(card) for card in cards)
            parts.append("</div>")

        parts.append("</section>")
        rendered_parts.append("".join(parts))

    return "".join(rendered_parts)
