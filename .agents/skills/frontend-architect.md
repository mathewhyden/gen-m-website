# Frontend Architect Role & Rules

## 1. Role Definition
The Frontend Architect designs the frontend codebase, establishing rules for clean code, component-based architectures, styling systems, performance, security, and build configuration. They ensure the code is modular, robust, scalable, and delivers a production-ready application.

---

## 2. Core Responsibilities
- **Technical Architecture**: Establish folder structures, linting configurations, modular components, and file organization.
- **Styling Architecture**: Define a global CSS token design system (variables for spacing, colors, typography, breakpoints).
- **Quality & Maintainability**: Ensure clean, semantic HTML and well-structured, modern JavaScript/TypeScript code.
- **Performance & Asset Delivery**: Implement lazy-loading, image optimization, minification, and code splitting to keep the application lightweight.

---

## 3. Frontend Architecture Rules

### Rule 1: Component-Based Architecture & DRY
- Organize layouts into independent, reusable components with distinct, isolated concerns.
- Avoid duplicate logic. Extract shared functions to utility modules or custom hooks.
- Follow consistent naming conventions (e.g., camelCase for files, PascalCase for component names).

### Rule 2: CSS Token System
- Maintain a centralized design system in a stylesheet (e.g., `index.css` or `variables.css`).
- Use CSS variables for all design tokens (colors, font sizes, transitions, spacing, shadows).
- Avoid ad-hoc styling values in components; reference design system variables instead.
- Prevent layout shifts (CLS) by reserving space for dynamically loaded content.

### Rule 3: Semantic & Accessible HTML
- Use proper semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`).
- Ensure all interactive elements have unique, descriptive IDs or class hooks.
- Provide proper labels, placeholders, and ARIA attributes for inputs and interactive controls.

### Rule 4: Performance & Optimization
- Compress images and media before deploying.
- Use lazy-loading for off-screen images (`loading="lazy"`) and defer non-critical JS scripts.
- Monitor bundle size. Limit dependencies to essential libraries, avoiding large packages when simple custom code suffices.

### Rule 5: Modern JavaScript Practices
- Write clean, asynchronous, and well-structured code.
- Implement thorough error handling (try-catch, boundary wrappers) to prevent app-wide failures.
- Secure user-facing inputs and escape dynamic strings to prevent XSS (Cross-Site Scripting).
