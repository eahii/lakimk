# Plan: Palvelut Dropdown Navbar

**Feature:** Navbar "Palvelut" becomes a dropdown listing each service sub-page. Main "Palvelut" link still navigates (anchor `#palvelut` on home, `/#palvelut` elsewhere). Responsive: desktop dropdown, mobile accordion inside burger menu.

**Repo:** `/home/juuso/projects/genesisremake/astro`
**Project type:** Astro site, plain CSS (no Tailwind), Finnish content.

---

## Cold-Claude Workflow

1. User `/clear` before each phase.
2. Pastes the "Next Cold-Claude Prompt" block from the current phase.
3. Executor reads this file, does the phase, updates status + writes "Next Cold-Claude Prompt" for the following phase at the bottom of this file.
4. Last executor marks feature `DONE`.

**Rules for every executor:**
- Read this entire file first.
- Stay inside scope of the single phase.
- Update the phase status checkbox and Notes section when done.
- Append any discovered gotchas to `## Gotchas` at bottom.
- Finish by writing the exact prompt the user should paste for the next phase.
- Do NOT run `pnpm build` unless necessary — user may not have deps installed in every session.

---

## Relevant Files

- `src/components/Nav.astro` — nav markup + inline script.
- `src/config/site.ts` — site data constants (will add `SERVICES`).
- `src/styles/global.css` — nav styles live around lines 199–310.
- `src/pages/palvelut/*.astro` — four existing service pages:
  - `rikosasiat.astro` → `/palvelut/rikosasiat` → "Rikosasiat"
  - `perheoikeudelliset-asiat.astro` → `/palvelut/perheoikeudelliset-asiat` → "Perheoikeudelliset asiat"
  - `perintooikeudelliset-asiat.astro` → `/palvelut/perintooikeudelliset-asiat` → "Perintöoikeudelliset asiat"
  - `riita-asiat.astro` → `/palvelut/riita-asiat` → "Riita-asiat"
- `src/pages/index.astro` line 76–130 — homepage service-row list (optional future consumer of SERVICES).

---

## Phases

### Phase 1 — Data + Markup  **[x] DONE**

**Scope (one file-heavy edit):**

1. Add to `src/config/site.ts`:
   ```ts
   export const SERVICES = [
     { slug: 'rikosasiat', href: '/palvelut/rikosasiat', title: 'Rikosasiat' },
     { slug: 'perheoikeudelliset-asiat', href: '/palvelut/perheoikeudelliset-asiat', title: 'Perheoikeudelliset asiat' },
     { slug: 'perintooikeudelliset-asiat', href: '/palvelut/perintooikeudelliset-asiat', title: 'Perintöoikeudelliset asiat' },
     { slug: 'riita-asiat', href: '/palvelut/riita-asiat', title: 'Riita-asiat' },
   ] as const
   ```

2. Edit `src/components/Nav.astro`:
   - Import `SERVICES` from `../config/site`.
   - Replace the single `<a href={palvelutHref} class="nav-link">Palvelut</a>` in `.nav-links` with a wrapper:
     ```astro
     <div class="nav-item nav-has-dropdown" data-dropdown>
       <a href={palvelutHref} class="nav-link">Palvelut</a>
       <button
         type="button"
         class="nav-dropdown-toggle"
         aria-expanded="false"
         aria-controls="palvelut-menu"
         aria-haspopup="true"
         aria-label="Avaa palvelut-alavalikko"
         data-dropdown-toggle
       >
         <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M3 4.5l3 3 3-3"/></svg>
       </button>
       <ul class="nav-dropdown" id="palvelut-menu" role="menu">
         {SERVICES.map(s => (
           <li role="none"><a role="menuitem" href={s.href} class="nav-dropdown-link">{s.title}</a></li>
         ))}
       </ul>
     </div>
     ```
   - Mobile block: replace the single mobile Palvelut link with:
     ```astro
     <div class="nav-mobile-group" data-mobile-dropdown>
       <div class="nav-mobile-row">
         <a href={palvelutHref} class="nav-mobile-link" data-closemob>Palvelut</a>
         <button
           type="button"
           class="nav-mobile-sub-toggle"
           aria-expanded="false"
           aria-controls="palvelut-mobile-submenu"
           aria-label="Avaa palvelut-alavalikko"
           data-mobile-sub-toggle
         >
           <svg width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.75" aria-hidden="true"><path d="M3 4.5l3 3 3-3"/></svg>
         </button>
       </div>
       <ul class="nav-mobile-sublinks" id="palvelut-mobile-submenu">
         {SERVICES.map(s => (
           <li><a href={s.href} class="nav-mobile-sublink" data-closemob>{s.title}</a></li>
         ))}
       </ul>
     </div>
     ```

3. Do **not** touch styles or scripts yet beyond what Astro needs to render. No behavior; dropdown will be always-closed (via default CSS in Phase 2).

**Acceptance:**
- `src/config/site.ts` exports `SERVICES`.
- `Nav.astro` renders without syntax errors.
- Mobile + desktop still render their respective Palvelut links.
- New elements present in DOM (verify via grep, not browser).

**Notes:**
- `SERVICES` added to `src/config/site.ts` before `OFFICES`.
- `Nav.astro` imports `SERVICES` in the frontmatter.
- Desktop: single `<a>` replaced with `div.nav-item.nav-has-dropdown[data-dropdown]` containing the link, chevron button, and `<ul#palvelut-menu role="menu">`.
- Mobile: single `<a>` replaced with `div.nav-mobile-group[data-mobile-dropdown]` containing a row (link + chevron) and `<ul#palvelut-mobile-submenu>`.
- No CSS or JS touched. Dropdown elements render but have no visual behavior until Phase 2.

---

### Phase 2 — Desktop + Mobile Styles & Behavior  **[x] DONE**

**Scope:** `src/styles/global.css` additions + inline script at bottom of `Nav.astro`.

1. **CSS (append in nav block, after line ~310):**

   Desktop:
   ```css
   .nav-item { position: relative; }
   .nav-has-dropdown { display: flex; align-items: center; gap: 0.25rem; }
   .nav-dropdown-toggle {
     display: none;
     background: none;
     border: 0;
     padding: 0.25rem;
     color: inherit;
     cursor: pointer;
     border-radius: 4px;
     transition: transform 200ms var(--ease-out-expo, cubic-bezier(0.16,1,0.3,1));
   }
   .nav-dropdown-toggle:focus-visible { outline: 2px solid hsl(var(--primary)); outline-offset: 2px; }
   .nav-has-dropdown[data-open="true"] .nav-dropdown-toggle { transform: rotate(180deg); }
   @media (min-width: 900px) { .nav-dropdown-toggle { display: inline-flex; align-items: center; } }

   .nav-dropdown {
     position: absolute;
     top: calc(100% + 0.5rem);
     left: 0;
     min-width: 280px;
     margin: 0;
     padding: 0.5rem;
     list-style: none;
     background: hsl(var(--background));
     border: 1px solid hsl(var(--border));
     border-radius: 8px;
     box-shadow: 0 12px 32px -12px rgb(0 0 0 / 0.25);
     opacity: 0;
     transform: translateY(-6px);
     pointer-events: none;
     transition: opacity 180ms ease, transform 180ms ease;
     z-index: 50;
   }
   @media (max-width: 899px) { .nav-dropdown { display: none; } }
   .nav-has-dropdown:hover .nav-dropdown,
   .nav-has-dropdown:focus-within .nav-dropdown,
   .nav-has-dropdown[data-open="true"] .nav-dropdown {
     opacity: 1;
     transform: translateY(0);
     pointer-events: auto;
   }
   .nav-dropdown-link {
     display: block;
     padding: 0.625rem 0.75rem;
     color: hsl(var(--foreground));
     text-decoration: none;
     border-radius: 6px;
     font-size: 0.9375rem;
     transition: background 150ms ease, color 150ms ease;
   }
   .nav-dropdown-link:hover,
   .nav-dropdown-link:focus-visible {
     background: hsl(var(--muted, var(--accent)));
     color: hsl(var(--primary));
   }

   @media (prefers-reduced-motion: reduce) {
     .nav-dropdown, .nav-dropdown-toggle { transition: none; }
   }
   ```

   Mobile:
   ```css
   .nav-mobile-group { display: flex; flex-direction: column; }
   .nav-mobile-row { display: flex; align-items: center; justify-content: space-between; gap: 0.5rem; }
   .nav-mobile-sub-toggle {
     background: none;
     border: 0;
     padding: 0.75rem;
     color: inherit;
     cursor: pointer;
     border-radius: 6px;
     transition: transform 200ms ease;
   }
   .nav-mobile-sub-toggle:focus-visible { outline: 2px solid hsl(var(--primary)); outline-offset: 2px; }
   .nav-mobile-group[data-open="true"] .nav-mobile-sub-toggle { transform: rotate(180deg); }
   .nav-mobile-sublinks {
     list-style: none;
     margin: 0;
     padding: 0;
     max-height: 0;
     overflow: hidden;
     transition: max-height 260ms ease;
   }
   .nav-mobile-group[data-open="true"] .nav-mobile-sublinks { max-height: 400px; }
   .nav-mobile-sublink {
     display: block;
     padding: 0.625rem 0 0.625rem 1.25rem;
     color: hsl(var(--foreground));
     text-decoration: none;
     font-size: 1rem;
     opacity: 0.85;
   }
   .nav-mobile-sublink:hover { color: hsl(var(--primary)); }
   @media (prefers-reduced-motion: reduce) {
     .nav-mobile-sublinks, .nav-mobile-sub-toggle { transition: none; }
   }
   ```

   > **Check first:** use grep to confirm existing CSS custom properties. If `--border`, `--muted`, `--accent` aren't defined, swap for variables that are. Keep the dropdown background visually consistent with existing navbar solid style.

2. **Script (add a single `<script>` block at the end of `Nav.astro`):**
   - Desktop toggle: click on `[data-dropdown-toggle]` toggles `data-open` on parent `[data-dropdown]` and syncs `aria-expanded`. Outside click closes all. `Escape` closes + returns focus to the toggle.
   - Mobile toggle: click on `[data-mobile-sub-toggle]` toggles `data-open` on parent `[data-mobile-dropdown]` and syncs `aria-expanded`.
   - Clicking any sub-link should (mobile) also close the whole burger menu via existing `data-closemob` handler (it should already handle this — verify).
   - Use `addEventListener` only. No external deps. Vanilla JS. Use `type="module"` only if already pattern in repo; otherwise plain `<script>` at end of component.

   Reference script shape:
   ```html
   <script>
     document.addEventListener('click', (e) => {
       const target = e.target as HTMLElement;
       const toggle = target.closest('[data-dropdown-toggle]');
       if (toggle) {
         const parent = toggle.closest('[data-dropdown]');
         if (!parent) return;
         const open = parent.getAttribute('data-open') === 'true';
         parent.setAttribute('data-open', open ? 'false' : 'true');
         toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
         return;
       }
       // outside click
       document.querySelectorAll('[data-dropdown][data-open="true"]').forEach(el => {
         if (!el.contains(target)) {
           el.setAttribute('data-open', 'false');
           el.querySelector('[data-dropdown-toggle]')?.setAttribute('aria-expanded', 'false');
         }
       });

       const mtoggle = target.closest('[data-mobile-sub-toggle]');
       if (mtoggle) {
         const parent = mtoggle.closest('[data-mobile-dropdown]');
         if (!parent) return;
         const open = parent.getAttribute('data-open') === 'true';
         parent.setAttribute('data-open', open ? 'false' : 'true');
         mtoggle.setAttribute('aria-expanded', open ? 'false' : 'true');
       }
     });
     document.addEventListener('keydown', (e) => {
       if (e.key !== 'Escape') return;
       document.querySelectorAll('[data-dropdown][data-open="true"]').forEach(el => {
         el.setAttribute('data-open', 'false');
         const t = el.querySelector<HTMLButtonElement>('[data-dropdown-toggle]');
         t?.setAttribute('aria-expanded', 'false');
         t?.focus();
       });
     });
   </script>
   ```
   Adjust to match existing script conventions in the repo (no TS syntax if the existing inline scripts are plain JS — remove `as HTMLElement`, `<HTMLButtonElement>`, etc.).

**Acceptance:**
- Desktop: hover or click chevron opens dropdown. Click outside or `Escape` closes. Main "Palvelut" link still navigates.
- Mobile: chevron toggles accordion in burger menu. Clicking a sub-link closes the whole mobile menu.
- Keyboard: Tab reaches toggle, Enter opens, focusing any inner link keeps it open (via `:focus-within`), Escape closes.
- Reduced motion honored.

**Notes:**
- `--border`, `--muted`, `--background`, `--foreground`, `--primary` all confirmed in global.css. `--accent` not defined; replaced with `--muted` in hover rule.
- CSS appended at line 310 in global.css (between nav block and Hero section).
- Existing inline scripts in `public/scripts/site.js` are plain JS with arrow functions and `const` — no TS. Script added to Nav.astro follows same style (no TS casts).
- `<script>` tag at end of Nav.astro (no `type="module"`, matching repo pattern in site.js).
- `data-closemob` on sub-links delegates mobile menu close to existing site.js handler — no re-implementation needed.

---

### Phase 3 — Verify + Polish  **[x] DONE**

**Scope:** manual-style verification without running a full test harness unless the user specifically asks.

1. Read the three modified files and spot-check:
   - No duplicate class names conflict with existing styles.
   - `aria-expanded` toggles are symmetric with `data-open`.
   - No inline TS syntax in a plain-JS `<script>` tag.
2. Run `grep -n "palvelut\|SERVICES\|nav-dropdown" src/components/Nav.astro src/config/site.ts src/styles/global.css` — sanity check wiring.
3. If Playwright is already installed (check `package.json`), add a tiny e2e that:
   - loads `/`, asserts `.nav-dropdown` exists and is not visible by default,
   - clicks `[data-dropdown-toggle]`, asserts menu is visible.
   If Playwright is NOT installed, SKIP this step — do not add new tooling.
4. Mark plan `DONE`. Summarize changes for the user.

**Acceptance:**
- All three files pass self-review.
- Feature works under realistic CSS variable availability.
- Plan file marked DONE with short change log.

**Notes:**
- No duplicate class names: all new classes (`.nav-item`, `.nav-has-dropdown`, `.nav-dropdown*`, `.nav-mobile-group`, `.nav-mobile-row`, `.nav-mobile-sub-toggle`, `.nav-mobile-sublinks`, `.nav-mobile-sublink`) are absent from CSS before line 311. `.nav-mobile-link` reuse is intentional.
- `aria-expanded` / `data-open` are fully symmetric: toggle sets both to matching `'true'/'false'`, outside click and Escape set both to `'false'`. ✓
- Script is plain JS — no TS casts (`as HTMLElement`, `<HTMLButtonElement>` etc.) present. ✓
- Playwright not in `package.json` — e2e test skipped per plan scope.
- Feature complete: SERVICES exported, markup wired, CSS added, JS behavior correct.

---

## Gotchas (append as discovered)

- Existing CSS uses `hsl(var(--foreground))`, `hsl(var(--primary))`, `hsl(var(--background))` etc. — confirm `--border`, `--muted`, `--accent` exist before using; fall back to an explicit HSL if not.
- Mobile burger uses `.nav-mobile.is-open`; existing JS handles `data-closemob`. Don't re-implement it.
- `palvelutHref` differs between home (`#palvelut`) and other pages (`/#palvelut`). Keep that behavior intact.
- Don't convert Nav.astro to use `client:*` directives — Astro component runs at build time; only the `<script>` tag needs runtime.

---

## Status

- [x] Phase 1 — Data + Markup
- [x] Phase 2 — Styles + Behavior
- [x] Phase 3 — Verify + Polish

---

## Next Cold-Claude Prompt (paste after `/clear`)

**Model:** `claude-sonnet-4-6` (Sonnet 4.6)

**Prompt:**
```
Execute Phase 3 of /home/juuso/projects/genesisremake/astro/PLAN_NAVBAR_DROPDOWN.md.

1. Read the entire plan file first.
2. Do ONLY Phase 3 (Verify + Polish).
3. Read src/components/Nav.astro, src/config/site.ts, src/styles/global.css and spot-check:
   - No duplicate class names conflict with existing styles.
   - aria-expanded toggles are symmetric with data-open.
   - No inline TS syntax in the <script> tag.
4. Run: grep -n "palvelut\|SERVICES\|nav-dropdown" src/components/Nav.astro src/config/site.ts src/styles/global.css
5. Check package.json for @playwright/test — if present, add a tiny e2e test (loads /, asserts .nav-dropdown exists and is not visible, clicks [data-dropdown-toggle], asserts menu is visible). If NOT present, skip.
6. Mark plan DONE (all phases checked, Status section updated).
7. Fill Phase 3 Notes section.
8. Reply in under 8 lines: what was verified, any issues found, final status.
```
