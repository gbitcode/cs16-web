# Counter-Strike 1.6 — landing page

Bilingual (🇷🇺 / 🇬🇧) landing page to distribute self-contained CS 1.6 builds
(Windows + macOS) and explain — *for absolute beginners* — how to host and play
together. Styled with [cs16.css](https://github.com/ekmas/cs16.css) for an
authentic 1.6 menu look.

**Live:** https://cs16.gbitcode.com

## Features

- **Two languages**, one source. All text lives in `_data/en.yml` / `_data/ru.yml`;
  the markup is shared. Jekyll (GitHub Pages' native engine) builds `/en/` and `/ru/`.
- **Auto language routing.** `/` redirects to the visitor's language and remembers the choice.
- **“For dummies” tooltips.** Jargon (IP, port forwarding, VPN, HLDS, Gatekeeper…) is
  marked with a 🫖 teapot icon; hover/tap reveals a plain-language explanation.
- **Download tracking.** Clicks fire a Google Analytics `download` event (platform + language),
  even while the files are still “coming soon”.
- Tech stack per spec: **plain HTML/CSS/jQuery** + Jekyll templating. No build tooling to run.

## Quick start

```bash
cd web
bundle install
bundle exec jekyll serve --config _config.yml,_config_dev.yml --livereload   # http://localhost:4000
```

Locally, Jekyll runs in the `development` environment, so **Google Analytics is
never loaded** (the snippet only renders in `production`, which GitHub Pages sets
automatically). `_config_dev.yml` also points absolute URLs at `localhost`.

## Configuring & deploying

See **[DEPLOY.md](DEPLOY.md)** — it covers the two placeholders to fill
(download URLs + GA id), publishing to GitHub Pages, and pointing the domain.
