# Sobhan Galleries — restored website (March 2016)

A static restoration of **sobhangalleries.ir** as the Internet Archive's Wayback Machine
captured it on 17–19 March 2016
(e.g. <https://web.archive.org/web/20160318174801/http://www.sobhangalleries.ir/single/14/Hani-Najm->).

Each page is the original archived HTML. Only the links were changed so the site runs
from plain files, without the original PHP (Yii) backend. The original stylesheets,
scripts, fonts and site graphics are included as the archive saved them.

## Viewing it

- Open `index.html` in a browser. Everything works straight from disk.
- Or serve the folder with any static web server, or publish it with GitHub Pages.
  On GitHub Pages, the original addresses `/home`, `/about` and `/single/14/Hani-Najm-` work again.

## Pages

| Original address | File |
| --- | --- |
| `/` (intro splash) | `index.html` |
| `/home` | `home.html` |
| `/exhibitions` | `exhibitions.html` |
| `/exhibitions?time_exhibition=1` … `4` | `exhibitions-current.html`, `-upcoming`, `-past`, `-online` |
| `/artists` | `artists.html` |
| `/artists?artist_list=1` (List view) | `artists-list.html` * |
| `/about` | `about.html` |
| `/news&event` | `news-event.html` |
| `/news`, `/event` | `news.html`, `event.html` |
| `/search` | `search.html` (page 2: `search-2.html` *) |
| `/single/12/Arash-Alimohammadi` | `single/12/Arash-Alimohammadi.html` |
| `/single/13/Raziyeh-Poursalary` | `single/13/Raziyeh-Poursalary.html` |
| `/single/14/Hani-Najm-` | `single/14/Hani-Najm-.html` |
| `/single/7` … `/single/11` (exhibitions) | `single/7/Between-us-and-Nasim.html` … `single/11/Imaginary-Thoughts.html` * |

\* Not captured by the archive; rebuilt from the site's own templates and listings (see below).

## What was missing and how it was filled in

- **Photos.** The archive kept none of the uploaded images: the 4 home slider images and
  the artist and exhibition pictures. Each one is now a plain gray image saved under its
  **original file name** in `upload/`. Put the real files in with the same names and they appear everywhere.
- **Press release.** `upload/filemanager/2016/03/12/najm1.pdf` (Hani Najm) was not kept. It is now a one-page stand-in.
- **Exhibition pages 7–11.** These were never captured. They use the artist page template and show
  the title, dates and type from the exhibition listings. Their descriptions are lost.
- **Artists "List" view and search page 2.** These were generated from the archived Artists and Search pages.
- **Header logo, favicons, Telegram icon, loading spinner.** None of these were kept. The logo and
  favicons were made from the intro logo (`images/logo1.png`). The Telegram icon and spinner were redrawn.
- **Search, News & Events tabs, newsletter.** The server used to handle these. Now `js/static.js`
  searches titles in the browser and marks the selected tab. The newsletter has no backend,
  so it shows the site's own "please try again" message.
- **Map.** The 2016 Google Maps script no longer loads without an API key. The About page now
  uses a Google Maps embed of the same coordinates.
- **Framework files.** Yii's list-view script and styles (`assets/2a94111c`, `assets/244308e9`,
  `jquery.ba-bbq.js`) were not kept. Small stand-ins are in their place.
- **Stylesheet dates.** The archive only captured the CSS/JS in 2017–2018. The 2016 pages link
  to the same files, and those later captures are what is used here.
- **Menu icons.** `img/nucleo-icon-*.svg` (referenced by `css/mobile_menu_fathi.css`) already
  returned 404 on the live site, so they are left out.

## Content

Text, artist biographies and the logo belong to Sobhan Gallery and the artists.
Bootstrap, Font Awesome and jQuery are under their own open-source licenses.
Website design by Faryan Academy (2015).
