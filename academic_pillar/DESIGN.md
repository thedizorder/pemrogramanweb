---
name: Academic Pillar
colors:
  surface: '#f8f9ff'
  surface-dim: '#ccdbf4'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dde9ff'
  surface-container-highest: '#d5e3fd'
  on-surface: '#0d1c2f'
  on-surface-variant: '#444651'
  inverse-surface: '#233144'
  inverse-on-surface: '#ebf1ff'
  outline: '#757682'
  outline-variant: '#c5c5d3'
  surface-tint: '#4059aa'
  primary: '#00236f'
  on-primary: '#ffffff'
  primary-container: '#1e3a8a'
  on-primary-container: '#90a8ff'
  inverse-primary: '#b6c4ff'
  secondary: '#904d00'
  on-secondary: '#ffffff'
  secondary-container: '#fe932c'
  on-secondary-container: '#663500'
  tertiary: '#003120'
  on-tertiary: '#ffffff'
  tertiary-container: '#004a32'
  on-tertiary-container: '#4ac08f'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b6c4ff'
  on-primary-fixed: '#00164e'
  on-primary-fixed-variant: '#264191'
  secondary-fixed: '#ffdcc3'
  secondary-fixed-dim: '#ffb77d'
  on-secondary-fixed: '#2f1500'
  on-secondary-fixed-variant: '#6e3900'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0d1c2f'
  surface-variant: '#d5e3fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
  code-inline:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system serves higher education institutions, research bodies, and academic administrative platforms. The visual tone is authoritative, structured, and clear, balancing scholastic prestige with operational efficiency.

The visual direction follows **Corporate / Modern** principles with structured editorial clarity:
- **Tone**: Scholarly, dependable, systematic, and focused.
- **Clarity over novelty**: High information density paired with precise micro-spacing ensures faculty, registrars, and students process administrative tasks without cognitive strain.
- **Visual anchors**: Subdued slate backgrounds allow crisp surface panels, high-contrast typography, and gold-hued achievement signifiers to stand out clearly.

## Colors

The palette establishes an institutional identity:

- **Primary (`#1E3A8A`)**: Deep Royal Navy provides structural authority for headers, high-level navigation, primary buttons, and critical states. Interactive variants use cobalt (`#2563EB`) for hover and active highlights.
- **Secondary / Accent (`#D97706` / `#F59E0B`)**: Amber Gold highlights institutional achievements, badges, warnings, and editorial highlights without sacrificing readability.
- **Tertiary / Success (`#059669`)**: Emerald provides explicit confirmation for publishing states, grading validations, and active curricular statuses.
- **Neutral Slate Range**:
  - `#0F172A`: Primary text and table titles.
  - `#334155`: Secondary text, metadata, table headers, and outline icons.
  - `#E2E8F0`: Structural border strokes, dividers, and active selection perimeters.
  - `#F1F5F9`: Component surfaces, table hover rows, and secondary button fills.
  - `#F8FAFC`: App canvas background, keeping optical strain low during prolonged use.

## Typography

The type scale combines **Plus Jakarta Sans** for structural headers with **Inter** for data density and editorial readability.

- **Plus Jakarta Sans** offers clean geometric forms with slight warmth, softening administrative stiffness while maintaining institutional dignity. Used for page titles, modal headlines, metrics, and card titles.
- **Inter** handles dense data tables, administrative inputs, form labels, and nested tree navigation. Tabular numbers (`tnum`) must be enabled globally for all data grids, financial totals, and student credit summaries.
- Mobile scaling clamps headlines larger than 28px downward to preserve administrative vertical space and avoid multiline layout breakage in school admin toolbars.

## Layout & Spacing

The layout is built on an adaptive multi-column fixed-fluid model tuned for school admin dashboards:

- **Desktop (1280px+)**: Dual-tier navigation layout. Fixed 260px primary navigation sidebar, dynamic master/detail work area, and 12-column content grid with 24px (`1.5rem`) gutters and 32px (`2rem`) outer boundaries.
- **Tablet (768px - 1279px)**: Primary navigation collapses to an icon rail (64px width). Content grid adjusts to 8 columns with 20px gutters. Detail panes convert to full overlays or tabs.
- **Mobile (< 768px)**: Single-column view with off-canvas slideover navigation, 16px (`1rem`) gutters, and compact vertical spacing to prioritize immediate form editing.

Spacing uses a strict 4px/8px modular base:
- Internal form and compact table cells rely on `space-xs` (4px) and `space-sm` (8px).
- General component block gaps and panel layouts rely on `space-md` (12px) and `space-lg` (20px).
- Section grouping and metric tile walls apply `space-xl` (32px).

## Elevation & Depth

This design system avoids heavy shadows, instead using **tonal layers and crisp low-contrast outlines**:

- **Borders**: Primary structural separation relies on a 1px solid stroke (`#E2E8F0`). Card boundaries, table cells, toolbar dividers, and header strips all use this perimeter rule.
- **Base Canvas**: The foundational background rests at `#F8FAFC`. Elevated surfaces (content containers, data tables, modals) use `#FFFFFF`.
- **Shadow Profile**: Where elevation is required (dropdowns, popovers, flyout drawers), apply a single subtle ambient shadow: `0 4px 12px -2px rgba(15, 23, 42, 0.06), 0 2px 4px -1px rgba(15, 23, 42, 0.04)`.
- **Active / Drag States**: Reordering components (course modules, page tree reorganizers) elevate on pick-up using `0 10px 25px -5px rgba(30, 58, 138, 0.12)` alongside a 1px border colored `#2563EB`.

## Shapes

The design system uses a **Soft (Level 1)** geometric standard.

- **Base Controls (`0.25rem` / `4px`)**: Text fields, select inputs, table row highlights, button elements, and inline chips. This preserves the precision expected in institutional data tools.
- **Medium Panels (`0.5rem` / `8px`)**: Cards, data tables, content cards, metric tiles, and floating modals.
- **Structural Shelves (`0.75rem` / `12px`)**: Flyout drawers and persistent layout frames.
- **Pill Exceptions**: Reserved strictly for high-visibility status pills and badge counters (e.g., "Published", "Archived", "Graded").

## Components

### Buttons
- **Primary**: Solid Royal Navy (`#1E3A8A`) background, white text, 4px border radius. Hover: `#2563EB`. Focus: 2px offset ring with `#2563EB`.
- **Secondary**: Crisp white background, 1px solid `#E2E8F0` border, `#334155` text. Hover: `#F1F5F9`.
- **Accent**: Solid Amber (`#D97706`) background, white text. Reserved for primary calls-to-action like "Publish Course" or "Certify Roster".

### Form Inputs & Selectors
- Standard height of 38px for desktop data efficiency.
- Border: 1px `#E2E8F0` on white surface. Active/Focus: 1.5px border `#2563EB` with zero outer fuzzy glow.
- Helper labels sit directly above in `label-md` using `#334155`. Validation text renders in tertiary green or distinct error ruby (`#DC2626`).

### Administrative Data Tables
- Crisp outer containment border (`#E2E8F0`) with header background set to `#F1F5F9`.
- Headers use `label-sm` with text transformed to uppercase, tracking `0.05em`, color `#334155`.
- Row height: 48px standard, 36px dense mode. Border bottom: 1px `#E2E8F0`. Hover: `#F8FAFC`.
- Integrated actions menu triggered via clean 3-dot ghost buttons anchored to the right column.

### Badges & Chips
- Status badges: Soft tint backgrounds (10% tint) with bold text.
  - *Published / Active*: Background `#ECFDF5`, text `#059669`.
  - *Pending / Review*: Background `#FEF3C7`, text `#D97706`.
  - *Draft / Inactive*: Background `#F1F5F9`, text `#334155`.
- Radius: Fully pill-shaped (`9999px`), padding: 2px horizontal 8px, font: `label-sm`.

### Metric Badges & KPI Blocks
- Top-line summary panels for enrollment stats, average GPA, or completion rates.
- White surface, 1px `#E2E8F0` stroke, 8px radius.
- Small top label in `label-sm` (`#334155`), value rendered in `Plus Jakarta Sans` 28px bold (`#0F172A`), accompanied by subtle upward/downward indicator icons in emerald or slate.

### Navigation Hierarchy
- **Primary Left Rail**: Subdued `#0F172A` deep navy-slate background or pure crisp white with right stroke `#E2E8F0`. Active states display a solid 3px left edge accent in `#2563EB` with `#F1F5F9` row fill.
- **Breadcrumbs**: Top horizontal path using `body-sm` with `/` glyph delimiters in `#94A3B8`.