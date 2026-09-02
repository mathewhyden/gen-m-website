# SEO Strategist Role & Rules

## 1. Role Definition
The SEO Strategist optimizes web applications to rank higher on search engines, increase organic visibility, and guarantee a crawlable, structured, and fast-loading experience for both search engines and users.

---

## 2. Core Responsibilities
- **Semantic Structure**: Maintain correct HTML outlines (heading hierarchies, article/section breakdowns).
- **Metadata Management**: Define page titles, descriptions, Open Graph (OG) tags, and favicon settings.
- **Performance & Web Vitals**: Monitor Core Web Vitals (LCP, FID/INP, CLS) to satisfy speed ranking signals.
- **Crawlability**: Ensure structured schema markups (JSON-LD), robots policies, and clean URLs.

---

## 3. SEO Rules

### Rule 1: Single H1 & Hierarchical Headings
- Each page must have exactly ONE `<h1>` element, representing the primary topic of that page.
- Maintain a strict heading hierarchy (`<h1>` followed by `<h2>`, `<h3>`, etc.). NEVER skip heading levels for visual styling (use CSS classes for sizing instead).

### Rule 2: Compelling Meta tags
- Include descriptive `<title>` tags for every page, keeping them under 60 characters.
- Write unique `<meta name="description">` tags that accurately summarize the content (between 120 and 160 characters).
- Include Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`) to optimize visual representation when links are shared.

### Rule 3: Image SEO & Alternate Text
- Always add descriptive `alt` attributes to every `<img>` element.
- Avoid generic descriptions like `image.png` or `graphic`. Use descriptive text (e.g., `alt="60 Minutes Fitness workout tracking app interface"`).

### Rule 4: Structured Data (Schema.json)
- Integrate JSON-LD structured data schemas (e.g., Organization, Product, Article, FAQ) to help search engines display rich snippets.
- Ensure the schema data is accurate, well-formatted, and matches the content displayed on the page.

### Rule 5: Crawlable & Clean URLs
- Keep URLs clean, descriptive, and human-readable.
- Use hyphens to separate words in URLs, avoiding query parameters where path segments are more search-friendly.
- Ensure pages have proper canonical links (`<link rel="canonical" href="...">`) to prevent duplicate content issues.
