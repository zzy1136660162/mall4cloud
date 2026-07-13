# Product UI and Rich Text Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Align the merchant product pages with the Fantastic Admin example layout and replace raw HTML editing with a real TinyMCE editor without changing product APIs or submission behavior.

**Architecture:** Keep page state, API calls, routes, field names, and submit transformations intact. Restrict UI work to the product list and product information views, plus one reusable rich-text editor component configured from the TinyMCE example already shipped in the same app.

**Tech Stack:** Vue 3 `<script setup>`, TypeScript, Element Plus, Fantastic Admin `FaPageMain`/`FaSearchBar`, TinyMCE 7, UnoCSS/SCSS.

---

### Task 1: Product list framework layout

**Files:**
- Modify: `apps/example/src/views/product/list/index.vue`

- [ ] **Step 1: Record the failing UI contract**

Run: `rg -n "FaSearchBar|FaPageMain" apps/example/src/views/product/list/index.vue`

Expected: no match, proving the page does not yet use the framework containers.

- [ ] **Step 2: Replace only the presentation structure**

Wrap the existing filters with `FaSearchBar`, move the publish action and table into `FaPageMain`, keep all `pageQuery`, `getPage`, `clearSearchInfo`, routing, delete, and pagination behavior unchanged, and add Enter-to-search plus resilient loading cleanup.

- [ ] **Step 3: Re-run the UI contract check**

Run: `rg -n "FaSearchBar|FaPageMain" apps/example/src/views/product/list/index.vue`

Expected: both components are present.

### Task 2: Reusable TinyMCE product editor

**Files:**
- Create: `apps/example/src/components/RichTextEditor/index.vue`
- Modify: `apps/example/src/views/product/prod-info/index.vue`

- [ ] **Step 1: Record the failing rich-text contract**

Run: `rg -n "RichTextEditor" apps/example/src/views/product/prod-info/index.vue`

Expected: no match, proving raw HTML is still edited in a textarea.

- [ ] **Step 2: Build the editor from the bundled framework example**

Create a `v-model` component around `@tinymce/tinymce-vue`, reuse local language/skin assets, support light and dark themes, enable common formatting, lists, links, images, tables, media, preview, source code, and full screen, and keep HTML as the emitted string.

- [ ] **Step 3: Replace the textarea only**

Import `RichTextEditor` in `prod-info/index.vue` and bind `v-model="dataForm.detail"`. Preserve the existing detail field, API payload, load/reset paths, and validation flow.

- [ ] **Step 4: Re-run the rich-text contract check**

Run: `rg -n "RichTextEditor" apps/example/src/views/product/prod-info/index.vue`

Expected: import and template usage are present.

### Task 3: Product information visual hierarchy

**Files:**
- Modify: `apps/example/src/views/product/prod-info/index.vue`

- [ ] **Step 1: Apply the framework page shell**

Use `FaPageHeader` and `FaPageMain`, preserve the four existing form sections, improve section cards, headings, spacing, disabled states, responsive widths, and the sticky footer without changing any form handlers.

- [ ] **Step 2: Verify code quality and production build**

Run: `pnpm --filter @fantastic-admin/example lint`

Expected: Vue TypeScript check exits with code 0.

Run: `pnpm --filter @fantastic-admin/example build`

Expected: Vite production build exits with code 0.

- [ ] **Step 3: Review the target pages in the running app**

Open `/product/list` and `/product/prod_info?spuId=883`. Verify filters wrap cleanly, Enter triggers search, table/actions/pagination remain functional, existing HTML is rendered inside TinyMCE instead of shown as source text, and saving retains the HTML string.

