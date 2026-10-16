---
version: alpha
name: CareerPilot AI
description: Career planning with the calm precision of a personal navigation chart.
colors:
  primary: "#223b50"
  muted: "#667582"
  accent: "#bce5de"
  border: "#d8e0e5"
  soft: "#f6f8fa"
  surface: "#ffffff"
  danger: "#a23232"
  workspace-background: "#0d1117"
  workspace-surface: "#151b24"
  workspace-field: "#1e2533"
  workspace-text: "#edf2f8"
  workspace-muted: "#a6afbe"
  workspace-border: "#303a49"
  workspace-control-border: "#60708b"
  workspace-accent: "#ff6b9d"
  workspace-action: "#d91d60"
  workspace-action-hover: "#df2463"
  workspace-action-pressed: "#be1652"
  workspace-danger: "#ffb2bd"
  workspace-on-action: "#ffffff"
  workspace-warning: "#f2c078"
  workspace-low-priority: "#9ad3c4"
typography:
  sans:
    fontFamily: "'Segoe UI', Arial, sans-serif"
  mono:
    fontFamily: "Consolas, monospace"
  workspace:
    fontFamily: "'Manrope', 'Segoe UI', Arial, sans-serif"
rounded:
  DEFAULT: "8px"
spacing:
  field-gap: "22px"
  control-height: "52px"
components:
  input:
    borderRadius: "8px"
  button:
    borderRadius: "8px"
---

# CareerPilot AI

## Overview

The authentication screens give career seekers a quiet entry point into their career planning workspace. The signature is a plotted route between where someone is and where they could go, rather than a dashboard mockup or invented success statistics. English copy; no market or additional locale is specified. Product forms stay familiar while the side panel carries the brand expression.

Runtime Sass is canonical. Base color tokens map to `--color-primary`, `--color-muted`, `--color-accent`, `--color-border`, `--color-soft`, `--color-surface`, and `--color-danger` in `Frontend/src/style.scss`; the existing auth variables alias them in `Frontend/src/features/Auth/auth.scss`. The shared dark workspace palette and font live in `Frontend/src/features/Interview/_workspace.scss`, loaded once by the global stylesheet for `.interview-home` and `.interview-report`. Workspace background, control border, action, action hover/pressed, and on-action map to the corresponding `--home-*` variables there. Radius maps to `--auth-radius`; typography, field gap, and control height map directly to the shared auth rules. Global scrollbar tokens live in `Frontend/src/style.scss`.

## Colors

Slate blue carries text and primary actions. Pale sea glass accents the route and side-panel headline; it is not used as text on white. White forms and cool grey fields make input boundaries clear. Muted text retains contrast on the light background. This scope provides a light form surface with a dark brand panel, rather than a theme switch.

The interview workspace follows the user's dark reference: graphite page and card surfaces, navy input surfaces, and rose accents on the headline, upload affordance, focus rings, and primary button. White and cool grey text retain hierarchy. This is a route-specific visual treatment; authentication retains its established palette.

## Typography

Segoe UI provides native Windows typography without font downloads or layout shifts. Headlines use medium weight and tight tracking. Consolas is reserved for small navigation-chart labels and form eyebrows.

Home uses self-hosted Manrope at weights 400–750 for more defined headings and rounded, legible body text. The variable font and SIL Open Font License live in `Frontend/public/fonts`. Its `@font-face` uses optional display to avoid a late font swap. Mobile textareas use 16px text. Consolas remains the small workspace/eyebrow accent.

## Layout

Equal desktop columns, with a form capped at 390px. Below 760px, use a compact brand header and a single naturally scrolling form. Do not constrain form height or hide document overflow.

The interview home uses a 1060px content width and a single bordered form. Background details and the target role sit side by side above 760px, then stack in reading order. The original field order, page geometry, and footer actions remain intact. A compact compass brand and rose marker connect the workspace to the product identity without adding dashboard chrome.

The report follows the user's three-column sketch: a 220px section rail, flexible reading pane, and 270px skill-gap aside inside a 1320px frame. Skill gaps move below the first two columns at 1100px; all regions stack below 700px. The document owns vertical scrolling, with no fixed-height clipping or competing content scrollers.

## Elevation & Depth

Only the career-map annotation has a soft shadow. Form surfaces use borders rather than floating cards.

The dark workspace form has a restrained outer shadow and 16px corners. Input corners are 10px; focus is defined by rose outlines, never by color alone.

Workspace scroll containers inherit dark scrollbar colors through the global baseline; their local tokens alias the workspace control-border, field, muted, and accent values.

## Shapes

8px control corners and restrained thin-line icons. Circular nodes communicate the start and destination of the career route.

## Components

`AuthLayout` owns the shared page structure; `PasswordField` owns masking and accessible visibility toggling. Both routes share labels, fields, primary button styling, and account-switch links. Fields provide hover and visible keyboard focus. Primary buttons provide hover, pressed, and disabled styles. Transitions are short and disabled for reduced motion.

This task is UI-only. Submission prevents default navigation and performs no authentication, persistence, validation, or simulated success. Register fields match the existing username/email/password backend shape. No OAuth, password recovery, consent policies, or unimplemented links are invented.

The interview home is also UI-only: Generate Report prevents submission and makes no API call. Its native file picker accepts PDF resumes, shows the selected filename, and rejects empty files, unsupported extensions, and files larger than 3 × 1024 × 1024 bytes, matching the existing upload middleware limit and PDF parser. Textareas provide labeled native editing and internal scrolling. File feedback is inline and announced; no files are read or stored beyond the current selection.

The report layout accepts a `report` prop and defaults to visibly labeled sample data in `data/sampleReport.js`. Its fields match the generated Zod report: `matchScore`, `technicalQuestions`, `behavioralQuestions`, `skillGaps`, and `preparationPlan`; questions expose `question`, `intention`, and `answer`, and preparation days expose `day`, `focus`, and string-array `tasks`. There are no report API calls. Section tabs use native buttons with roving focus, arrow/Home/End navigation, and associated panels. Questions use native details/summary disclosure. Priority is written in text as well as color; medium uses `--report-warning` (#f2c078), and low uses `--report-low-priority` (#9ad3c4).

## Do's and Don'ts

- Keep entry forms legible, compact, and consistent.
- Use the route illustration as the single expressive element.
- Avoid social proof, invented metrics, decorative gradients, and new UI dependencies.
- Keep future authentication behavior separate from this visual foundation.
