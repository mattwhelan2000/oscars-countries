
# World Explorer — Static Template

This is a lightweight, data-driven website template for country pages.

## How it works
- Edit **`/data/countries.json`** to add or update countries. No build step required.
- `index.html` lists all countries from the JSON.
- `country.html?code=CA` loads that country's data and renders:
  - Video embed
  - Image gallery
  - Tiny animated bar charts for: population, land area, highest point
  - Sections: Animals, Currency, Stamps, Geographic Location, Facts/History

## Add a country
1. Open `data/countries.json`.
2. Copy one of the existing objects in the `countries` array and update values.
3. (Optional) Put image files in `/images` and point to them — or use external URLs.
4. Add a YouTube/Vimeo embed URL to `video_embed` (use the `/embed/` URL).

> Tip: The bar charts scale against global maxima in the top-level `"max"` object. Update these if needed to adjust the animation scale.

## Publish (free/cheap options)
- **Netlify**: Drag-and-drop the `/site` folder into Netlify or connect a repo.
- **GitHub Pages**: Push to a repo and enable Pages.
- **Vercel**: Import the repo; it will serve static files.
No server code is required.

## Customization
- Edit `/assets/styles.css` for colors/typography.
- Edit `/assets/app.js` for behavior.
- Replace `/images/placeholder.png` and flags with your own.

## SEO
- Add `<meta>` tags to both HTML files.
- Consider generating a static country page per code later if you want distinct URLs instead of query strings.

## License
Do anything you want with it.


---

## Kid‑friendly updates

### A) Super simple: Edit with a visual editor (Decap CMS)
1. Host on **Netlify** and enable **Identity + Git Gateway**.
2. Visit `/admin/` on your site, log in, and click **Countries** to add a new file (one JSON per country).
3. Upload images to **/uploads** from the editor.
4. Click **Publish**.

> This keeps everything as flat files in the repo—no database needed. Perfect for adding ~1 country every 2 weeks.

### B) Record a video from the browser
- Open **`/record.html`** to record a short video (.webm).
- Parents can set **Cloudinary** “cloud name” + **unsigned preset** to upload with no login.
- Or just **Download Video** and manually drag it into `/uploads` via the CMS.

### C) One file per country
- All country files live in: **`/data/countries/{CODE}.json`**
- Index is powered by **`/data/manifest.json`** (list of codes & names + chart maxima).
- Add a new country by creating `{CODE}.json` and adding it to the manifest (or let the CMS handle this).

### Safety tips
- Keep Cloudinary unsigned uploads limited by preset/folder.
- Monitor uploads in your Cloudinary dashboard.
