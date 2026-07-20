# Deploy guide — cs16.gbitcode.com

Everything here is a **static Jekyll site**. GitHub Pages builds Jekyll for you,
so there is **no CI, no build server, no Node** to manage. You push files, GitHub
publishes them.

This guide has 4 parts:

1. [Fill in the two placeholders](#1-fill-in-the-two-placeholders) (download links + Google Analytics)
2. [Preview locally](#2-preview-locally-optional)
3. [Publish to GitHub Pages](#3-publish-to-github-pages)
4. [Point the domain `cs16.gbitcode.com`](#4-point-the-domain)

---

## 1. Fill in the two placeholders

Both live in **`_config.yml`**. After editing it, commit & push — GitHub rebuilds automatically.

### a) Download links

```yaml
downloads:
  windows: ""   # <- paste the direct .exe installer URL
  macos:   ""   # <- paste the direct .dmg URL
```

- While these are **empty**, the buttons show a greyed‑out *“Link coming soon”* state
  (clicks are still tracked in Analytics, so you can gauge demand early).
- Once you paste a URL, the button becomes a real download link automatically — no other change needed.
- **Recommended host:** attach the files to a **GitHub Release** and copy the asset URLs, e.g.
  `https://github.com/<you>/<repo>/releases/download/v1/counter-strike-1.6.dmg` (and `…-setup.exe`).
  Releases are free, fast, and don't bloat the repo.

### b) Google Analytics

```yaml
ga_id: ""   # <- paste your Measurement ID, e.g. "G-XXXXXXXXXX"
```

- Empty ⇒ **no analytics script is loaded at all** (clean, privacy‑friendly during development).
- Once set, every page loads GA4 and **download clicks fire a custom event**:

  | Event    | Parameters                                                    |
  |----------|---------------------------------------------------------------|
  | `download` | `platform` = `windows`\|`macos`, `state` = `available`\|`coming_soon`, `lang` = `en`\|`ru` |

  In GA4 → **Reports → Engagement → Events** you'll see `download`; click it to break down by platform/language.
  (You can also mark it as a *Key event* in Admin → Events.)

> **Inject the ID at build time instead of committing it?** Possible, but only via the
> GitHub Actions build (the default branch build can't read repo secrets/variables).
> A GA4 Measurement ID is public anyway (it's in the page HTML for every visitor), so this
> is a code-tidiness choice, not a security one. If you want it: use the included
> `.github/workflows/pages.yml`, set **Settings → Pages → Source = GitHub Actions**, and add
> a repo **Variable** `GA_ID` under *Settings → Secrets and variables → Actions → Variables*.
> The workflow writes it into a throwaway `_config.ci.yml` at build time; leave `ga_id` empty in `_config.yml`.

---

## 2. Preview locally (optional)

Needs Ruby (macOS ships with one; `ruby -v` should print 3.x). One‑time setup:

```bash
cd web
bundle install
```

Then, from the `web/` folder:

```bash
bundle exec jekyll serve --config _config.yml,_config_dev.yml --livereload
```

Open **http://localhost:4000/** — it redirects to `/en/` or `/ru/` by your browser language,
exactly like production. Edits to `_data/*.yml`, layouts, CSS and JS reload live.

> **Local vs prod configs.** `_config.yml` is the base/production config;
> `_config_dev.yml` layers local overrides on top (localhost URL, blank GA id).
> More importantly, `jekyll serve` runs in the **`development`** environment, and the
> analytics snippet only renders in **`production`** — so **GA never loads locally**,
> even if `ga_id` is filled in. GitHub Pages builds in `production`, so it does load there.

> The root redirect uses `location.replace('/en/')`. Locally that resolves to
> `http://localhost:4000/en/`, which is correct.

---

## 3. Publish to GitHub Pages

The site lives in this `web/` folder. GitHub Pages can only serve from a repo's
**root** or **`/docs`**, so publish `web/` as **its own repository**.

```bash
cd web
git init
git add .
git commit -m "CS 1.6 landing page"
git branch -M main
git remote add origin git@github.com:<you>/cs16-web.git
git push -u origin main
```

Then on GitHub:

1. **Repo → Settings → Pages**
2. **Build and deployment → Source: _Deploy from a branch_**
3. **Branch: `main`**, folder **`/ (root)`** → **Save**

GitHub builds the Jekyll site and publishes it within a minute or two. The first
successful build shows a green check on the commit.

> `.gitignore` already excludes `_site/`, `vendor/`, `.bundle/` — never commit those;
> GitHub builds `_site` itself.

---

## 4. Point the domain

The repo already contains a **`CNAME`** file with `cs16.gbitcode.com`, so GitHub
knows the intended domain. You just need the DNS record.

At your DNS provider for **gbitcode.com**, add:

| Type    | Name (host) | Value                 |
|---------|-------------|-----------------------|
| `CNAME` | `cs16`      | `<you>.github.io.`    |

(That's a subdomain, so a `CNAME` record is correct — not `A` records.)

Then on GitHub:

1. **Settings → Pages → Custom domain** → confirm it shows `cs16.gbitcode.com` (from the CNAME file).
2. Wait for the DNS check to go green (minutes to an hour).
3. Tick **Enforce HTTPS** once the certificate is issued.

Done — `https://cs16.gbitcode.com` serves the site, `/` auto‑redirects to the
visitor's language, and `EN`/`RU` in the header switches (and remembers the choice).

---

## Where things live

```
web/
├── _config.yml         # ← download links + GA id live here
├── _data/
│   ├── en.yml          # ALL English text (edit prose here)
│   └── ru.yml          # ALL Russian text
├── _layouts/
│   ├── default.html    # <head>, analytics, jQuery
│   └── home.html       # page structure (rendered from _data)
├── assets/
│   ├── css/style.css   # styling on top of cs16.css
│   └── js/main.js      # accordion, GA tracking, language memory
├── en/index.html       # 3-line stub → home layout, lang: en
├── ru/index.html       # 3-line stub → home layout, lang: ru
├── index.html          # root: JS redirect by browser language
└── CNAME               # cs16.gbitcode.com
```

**To change wording or add a term tooltip:** edit `_data/en.yml` **and** `_data/ru.yml`.
Structure/markup is shared in `home.html`, so you rarely touch HTML.

### Adding a new “teapot” term tooltip

Terms are plain HTML inside the YAML strings. Copy this pattern into any sentence:

```html
<span class="term" tabindex="0" role="button">WORD<span class="teapot" aria-hidden="true">🫖</span><span class="tip">Plain-language explanation here.</span></span>
```

`WORD` is what the reader sees (dotted underline + 🫖); `.tip` is the hover/tap explanation.
