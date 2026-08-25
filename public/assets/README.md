# Drop-in Assets

This folder is where your real photography goes. The site already works without any of these files — every place a photo belongs currently renders a designed placeholder (a soft gradient card in the site's colors with an icon and label) instead of a broken image.

**To swap a placeholder for a real photo, just save your image with the exact filename listed below into the matching folder.** No code changes, no restart required in dev — the real photo will appear automatically the next time that page loads. Recommended: JPG, landscape orientation, at least 1200px wide.

---

## /public/assets/images — Ministries (35)

| Filename | Ministry |
|---|---|
| `ministry-placeholder-1.jpg` | Missions |
| `ministry-placeholder-2.jpg` | Prayer |
| `ministry-placeholder-3.jpg` | KDF |
| `ministry-placeholder-4.jpg` | Training |
| `ministry-placeholder-5.jpg` | Assimilation & Covenant Friends |
| `ministry-placeholder-6.jpg` | Transport |
| `ministry-placeholder-7.jpg` | Wealth Creation & Cooperative |
| `ministry-placeholder-8.jpg` | Faith Dynamite Voice |
| `ministry-placeholder-9.jpg` | Decoration |
| `ministry-placeholder-10.jpg` | Media |
| `ministry-placeholder-11.jpg` | Facility Management & Projects |
| `ministry-placeholder-12.jpg` | Security |
| `ministry-placeholder-13.jpg` | Welfare |
| `ministry-placeholder-14.jpg` | Finance |
| `ministry-placeholder-15.jpg` | Medical |
| `ministry-placeholder-16.jpg` | Education & Scholarship |
| `ministry-placeholder-17.jpg` | Baptism Ministry |
| `ministry-placeholder-18.jpg` | Legal Council |
| `ministry-placeholder-19.jpg` | Bookshop & Reading Culture |
| `ministry-placeholder-20.jpg` | Healing & Deliverance Crack Team |
| `ministry-placeholder-21.jpg` | Counselling & Call Centre |
| `ministry-placeholder-22.jpg` | Marriage & Couples |
| `ministry-placeholder-23.jpg` | Singles Connect |
| `ministry-placeholder-24.jpg` | Ushering |
| `ministry-placeholder-25.jpg` | Visitation |
| `ministry-placeholder-26.jpg` | Publicity & Branding |
| `ministry-placeholder-27.jpg` | Salem Elders Ministry |
| `ministry-placeholder-28.jpg` | Communion |
| `ministry-placeholder-29.jpg` | Sanctuary Keepers |
| `ministry-placeholder-30.jpg` | Affinity Leadership |
| `ministry-placeholder-31.jpg` | Announcement |
| `ministry-placeholder-32.jpg` | Salem Theatre |
| `ministry-placeholder-33.jpg` | Dedication |
| `ministry-placeholder-34.jpg` | Protocol |
| `ministry-placeholder-35.jpg` | Conflict Resolution Team |

## /public/assets/images — Churches (37)

| Filename | Church |
|---|---|
| `church-placeholder-1.jpg` | Salem International Christian Centre, Lekki |
| `church-placeholder-2.jpg` | Salem Family, Ogombo |
| `church-placeholder-3.jpg` | Salem Family, Epe |
| `church-placeholder-4.jpg` | Salem Family, Badore Headquarters |
| `church-placeholder-5.jpg` | Salem Family, Maryland |
| `church-placeholder-6.jpg` | Salem Family, Owode |
| `church-placeholder-7.jpg` | Salem Family, Onosa |
| `church-placeholder-8.jpg` | Salem Family, Gbagada Headquarters |
| `church-placeholder-9.jpg` | Salem Family, Oworonshoki |
| `church-placeholder-10.jpg` | Salem Family, Ilupeju |
| `church-placeholder-11.jpg` | Salem Family, Bariga |
| `church-placeholder-12.jpg` | Salem Family, Shomolu |
| `church-placeholder-13.jpg` | Salem Family, Festac Headquarters |
| `church-placeholder-14.jpg` | Salem Family, Ibaa |
| `church-placeholder-15.jpg` | Salem Family, Ojo |
| `church-placeholder-16.jpg` | Salem Family, Ahoyaya District Headquarters |
| `church-placeholder-17.jpg` | Salem Family, Ahoyaya 2 |
| `church-placeholder-18.jpg` | Salem Family, Ajah Area Headquarters |
| `church-placeholder-19.jpg` | Salem Family, Okun Ajah |
| `church-placeholder-20.jpg` | Salem Family, Ajah 2 |
| `church-placeholder-21.jpg` | Salem Family, Jesutedo Area Headquarters |
| `church-placeholder-22.jpg` | Salem Family, Ketu Area Headquarters |
| `church-placeholder-23.jpg` | Salem Family, Ikorodu |
| `church-placeholder-24.jpg` | Salem Family, Victoria Island Headquarters |
| `church-placeholder-25.jpg` | Salem Family, Ojodu Area Headquarters |
| `church-placeholder-26.jpg` | Family City of Grace, Ibadan |
| `church-placeholder-27.jpg` | Salem Family, Sango, Ibadan |
| `church-placeholder-28.jpg` | Salem International Christian Centre, Ekiti |
| `church-placeholder-29.jpg` | Salem International Christian Centre, Mowe |
| `church-placeholder-30.jpg` | Salem International Christian Centre, Dome |
| `church-placeholder-31.jpg` | Salem Family, Ashaiman |
| `church-placeholder-32.jpg` | Salem Family, Abeka |
| `church-placeholder-33.jpg` | Salem Family, Kasoa |
| `church-placeholder-34.jpg` | Salem Family, Kutunse |
| `church-placeholder-35.jpg` | Foundation Eglise de Foi Universelle de Salem |
| `church-placeholder-36.jpg` | Salem International Christian Centre, Freetown |
| `church-placeholder-37.jpg` | Salem International Christian Centre, Benin Republic |

## /public/assets/events — Events (9)

| Filename | Event |
|---|---|
| `event-placeholder-1.jpg` | Continental Faith Convention |
| `event-placeholder-2.jpg` | Teens Summer Camp |
| `event-placeholder-3.jpg` | First Friday Night of Prayer |
| `event-placeholder-4.jpg` | Marriage & Couples Retreat |
| `event-placeholder-5.jpg` | Salem Women International Conference |
| `event-placeholder-6.jpg` | Community Medical & Welfare Outreach |
| `event-placeholder-7.jpg` | Salem Theatre: The Passion Play |
| `event-placeholder-8.jpg` | Singles Connect Evening |
| `event-placeholder-9.jpg` | Harvest Thanksgiving Crusade |

---

## Adding a brand-new ministry, church, or event
Add the entry to the matching file in `src/data/` (`ministries.json`, `churches.json`, or `events.json`), pointing its `image`/`imagePlaceholder` field at a new filename in this folder using the same naming pattern. The card, marquee, calendar and detail modal all pick it up automatically — nothing else needs to change.
