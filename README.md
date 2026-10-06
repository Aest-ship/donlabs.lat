# Donlabs website (donlabs.lat)

Static website: plain HTML, CSS and JavaScript. No build step and no dependencies.

## Structure

```
index.html              page shell (header, footer, script/style links)
css/style.css           all styles (colors are CSS variables at the top)
js/data.js              content: services/groups (S), team (TEAM), landing text (SHORT)
js/main.js              pages, routing (#/dashboard, #/services, ...), booking form
js/background.js        animated dot background (canvas)
assets/images/          favicon, placeholder, team/ for photos
```

Pages use hash routing (`#/`, `#/services`, `#/dashboard`, `#/tennis`, ...), so it works on any static host.

## Run locally

```
python3 -m http.server 8000
```
Then open http://localhost:8000. (Opening index.html directly also works.)

## Editing content

- **Services and groups:** edit the `S` list in `js/data.js`. Each entry is `[id, title, description, [included items]]`. The first six are the services shown in the booking form.
- **Team:** edit `TEAM` in `js/data.js`: `[name, role, description, photo]`. Save the photo in `assets/images/team/` and set the 4th item to its path, e.g. `"assets/images/team/maria.jpg"`. Leave it out to show the placeholder.
- **Landing text:** `SHORT` in `js/data.js`; the longer description, About and Contacts text are in `home()` in `js/main.js`.
- **Look:** colors and fonts in `css/style.css` (`:root` variables, font loaded from Google Fonts in `index.html`).

## Booking form and APIs

The Services form currently builds a `mailto:` link to contact@donlabs.lat, so the visitor sends the request from their own email app. No server is needed, but nothing is stored.

To collect requests properly, replace the `f.onsubmit` handler in `bindSvc()` (`js/main.js`) with a `fetch` POST to one of:

- a form service such as Formspree or Web3Forms (easiest, no backend)
- an email API such as Resend or SendGrid, called from your own small backend
- your own backend or a database (Supabase, Firebase)

Example:
```js
fetch("https://YOUR-ENDPOINT", {
  method: "POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({service: s, name: nm.value, contact: ct.value, details: dt.value})
})
```
Never put secret API keys in these files. Anything in the browser is public, so keep keys on a backend.

## Deploying to donlabs.lat

Upload the whole folder to any static host (Cloudflare Pages, Netlify, Vercel, GitHub Pages), then point the domain's DNS to it as the host instructs.

## To do

- Real team names, photos and role descriptions
- Real images/logo if wanted
- Decide how booking requests should be stored
