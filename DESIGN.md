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
typography:
  sans:
    fontFamily: "'Segoe UI', Arial, sans-serif"
  mono:
    fontFamily: "Consolas, monospace"
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

Runtime Sass is canonical. This file mirrors its tokens: colors map to `--auth-ink`, `--auth-muted`, `--auth-accent`, `--auth-border`, `--auth-soft`, and `--auth-white` in `Frontend/src/features/Auth/auth.scss`. Radius maps to `--auth-radius`; typography, field gap, and control height map directly to the shared auth rules. Global scrollbar tokens live in `Frontend/src/style.scss`.

## Colors

Slate blue carries text and primary actions. Pale sea glass accents the route and side-panel headline; it is not used as text on white. White forms and cool grey fields make input boundaries clear. Muted text retains contrast on the light background. This scope provides a light form surface with a dark brand panel, rather than a theme switch.

## Typography

Segoe UI provides native Windows typography without font downloads or layout shifts. Headlines use medium weight and tight tracking. Consolas is reserved for small navigation-chart labels and form eyebrows.

## Layout

Equal desktop columns, with a form capped at 390px. Below 760px, use a compact brand header and a single naturally scrolling form. Do not constrain form height or hide document overflow.

## Elevation & Depth

Only the career-map annotation has a soft shadow. Form surfaces use borders rather than floating cards.

## Shapes

8px control corners and restrained thin-line icons. Circular nodes communicate the start and destination of the career route.

## Components

`AuthLayout` owns the shared page structure; `PasswordField` owns masking and accessible visibility toggling. Both routes share labels, fields, primary button styling, and account-switch links. Fields provide hover and visible keyboard focus. Primary buttons provide hover, pressed, and disabled styles. Transitions are short and disabled for reduced motion.

This task is UI-only. Submission prevents default navigation and performs no authentication, persistence, validation, or simulated success. Register fields match the existing username/email/password backend shape. No OAuth, password recovery, consent policies, or unimplemented links are invented.

## Do's and Don'ts

- Keep entry forms legible, compact, and consistent.
- Use the route illustration as the single expressive element.
- Avoid social proof, invented metrics, decorative gradients, and new UI dependencies.
- Keep future authentication behavior separate from this visual foundation.
