# Sobhan Gallery website

The website of **Sobhan Gallery**, Tehran (founded 2004): 57 artists and 944 artworks from the gallery's
artist catalogues and exhibition photographs, past exhibitions with their posters, and visiting information.

It began as a restoration of **sobhangalleries.ir** as the Internet Archive captured it in March 2016
(e.g. <https://web.archive.org/web/20160318174801/http://www.sobhangalleries.ir/single/14/Hani-Najm->).
In 2026 every page was rebuilt in a new theme. The yellow Sobhan logo stays. Every original address still works.

## Viewing it

- Open `index.html` in a browser. Everything works straight from disk.
- Or serve the folder with any static web server, or publish it with GitHub Pages.

## The theme

One stylesheet and one script for every page. No framework, no build step.

| File | What it does |
| --- | --- |
| `css/theme.css` | The whole design: warm gallery-white background, near-black type, Sobhan yellow (`#ffcb08`) as the accent. Headings in Cormorant Garamond, text in Manrope (Google Fonts). Works on phones (slide-in menu below 820 px). |
| `js/theme.js` | Day/night switch, mobile menu, landing slideshow, artist filter, full-screen artwork viewer (arrow keys, swipe, Esc), and site search. Pages still work without it. |

**Day and night mode.** The moon/sun button in the header switches between them, and the choice is remembered (`localStorage`,
key `sobhan-theme`). Until a visitor chooses, the site follows their device's light or dark setting. A one-line script in each
page's head applies the mode before the page is drawn. The night colours are the `:root[data-theme="dark"]` block at the top of
`css/theme.css`; everything else uses the same variables.
| `js/search-index.js` | The search list: every artist, artwork and exhibition. |
| `css/font-awesome.min.css` | Icons (kept from the 2016 site). |

The 2016 stylesheets and scripts (`bootstrap*`, `style_sobhan.css`, `intro_css.css`, `mobile_menu_fathi.css`,
`js/main.js`, `js/static.js`, jQuery plugins) are still in the folder but no page uses them now.

## Pages

| Page | File |
| --- | --- |
| Landing: logo, slideshow of works, about, featured artists, recent exhibitions, map | `index.html` (`home.html` forwards here) |
| Artists, grid view with filter | `artists.html` |
| Artists, A–Z list | `artists-list.html` |
| One page per artist (57) | `artists/<Name>.html`; three keep their 2016 addresses: `single/12/Arash-Alimohammadi.html`, `single/13/Raziyeh-Poursalary.html`, `single/14/Hani-Najm-.html` |
| Exhibitions (All, Current, Upcoming, Past, Online) | `exhibitions.html`, `exhibitions-current.html`, `-upcoming`, `-past`, `-online` |
| Exhibition pages | `single/7/Between-us-and-Nasim.html` … `single/11/Imaginary-Thoughts.html` |
| "In Time of Sorrow" (online photography exhibition: statement and 15 photographs in two series) | `exhibitions/In-Time-of-Sorrow.html`, photos in `upload/exhibitions/in-time-of-sorrow/` |
| Solo painting exhibitions with their poster: "Rashtak" (Atefeh Mortazavi, Nov 2015), "Bodily" (Bahareh Chartabi Asl, Dec 2015), "My Realism" (Hamid Khayamzadeh, Jan 2016) | `exhibitions/Rashtak.html`, `Bodily.html`, `My-Realism.html`, posters in `upload/exhibitions/<slug>/poster.jpg` |
| About, with address, phone, email and map | `about.html` |
| News & Events (hidden) | `news-event.html`, `news.html`, `event.html` |
| Search (hidden) | `search.html` (`search-2.html` forwards here; `?q=` or the old `?search_text=` work) |

Search and News & Events are hidden for now: no menu or page links to them, but the pages still work at
their addresses. To show them again, add them back to `NAV` (and the search icon and footer link) in the build script.

## Artist pages

Every artist page uses the same template, in this order:

1. **Header**: portrait, name, born, from, number of works, years the works are dated, links to the sections below.
   An artist with no photo, or one too poor to show (`POOR_PORTRAITS` in the build script), gets the header without a portrait box.
2. **Statement**: the artist's statement or essay from the catalogue, when it has one.
3. **Works**: every artwork with title, medium, size, year and catalogue number. Sales status is not shown
   (the data still records "Sold" where marked).
   Series headings and texts placed between works in the catalogue appear in the same place.
   Clicking a work opens it full screen.
4. **History of experience**: the CV as a list after the works: one group per heading (Education,
   Solo exhibitions, Group exhibitions, Awards…), one row per entry with the year on the left.
5. Source catalogue, and links to the previous and next artist.

Images are in `upload/artists/<name>/`: `NN.jpg` full size, `NN-t.jpg` thumbnail, `portrait.jpg`, `card.jpg`.

Names are spelled as each catalogue spells them. Obvious typos in artwork titles and media were corrected
(e.g. "Untitle", "Wellcoming"). CV text is as printed.

## Adding an exhibition with photos

Each one is a JSON file in the build folder (`_build/exhibitions/<slug>.json`: title, status, statement,
and series of photos with alt text). `prep_exhibition.py` copies the photos into `upload/exhibitions/<slug>/`
(`NN.jpg` and a 640 px `NN-t.jpg`), and the build script makes the page and lists it under Exhibitions
and on the landing page. The page links add `?v=…` to `theme.css` and `theme.js`, taken from their contents,
so browsers load the new files after every change.

## Adding an exhibition with a poster, and its artist

- **Exhibition**: a JSON file in `_build/exhibitions/` with `"kind": "poster"`, the title, dates, start date (for ordering),
  the artist and the poster file. `prep_exhibition.py` converts the poster (often CMYK) to a web JPEG. The page shows the
  poster under the title, then the artist's works; the artist's page lists the exhibition.
- **Artist**: a JSON file in `_build/artists/` (name, short CV, source, and the works in order with an optional crop box
  and the caption). `prep_artist.py <artist.json> <photos_dir> sobhan-galleries` makes `NN.jpg`, `NN-t.jpg` and `card.jpg`.
  A file with `"extends"` adds works to a catalogue artist instead (used for five more works by Bahareh Chartabi Asl).
  A work whose title is not known gets `"label": "Painting"`, shown in small type instead of a title.
- Then run `build_theme.py sobhan-galleries`. Without the catalogue PDFs it takes their file names from `_build/catalogue_files.json`.

## Not known

- **Titles of the newer works.** Hamid Khayamzadeh's 21 works and 10 of Atefeh Mortazavi's 11 came without titles,
  media, sizes or dates, so they are labelled "Painting".
- **Bodily closing date.** The poster's English text says Wednesday 11 December 2015, its Persian text Wednesday 18 Azar 1394
  (9 December 2015). 11 December 2015 was a Friday, so the site uses 9 December.

- **Exhibition descriptions and photos.** The archive kept only the title, dates and type of the five exhibitions.
- **News & Events.** Nothing was ever posted, so those pages say so.
- **Mailing list.** There is no server. "Join the mailing list" opens an email to the gallery.
- **Map.** Uses the same coordinates as the 2016 site.

## Content

Text, artworks, artist biographies and the logo belong to Sobhan Gallery and the artists.
Font Awesome is under its own open-source license. The original 2016 site was designed by Faryan Academy (2015).
