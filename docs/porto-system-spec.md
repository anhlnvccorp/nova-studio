# Đặc tả hệ thống Porto — Nguồn làm HTML Template Core mới

> Mục đích: tổng hợp kiến trúc, tính năng, builders, widgets, theme options và yêu cầu hiệu năng của **Porto WordPress (Business & WooCommerce Theme)** thành một đặc tả duy nhất, dùng làm đầu vào để thiết kế **HTML template core mới** (static, tái sử dụng, tốc độ cao).
> Snapshot tham chiếu: **Porto 7.9.4 (04/09/2026)** — tương thích WooCommerce 11.1, WPBakery 9.0, WordPress 7.x, PHP 8.3–8.5, Elementor 3.35 / 4.0 beta.

---

## 1. Tổng quan hệ thống

- **Định vị:** multi-purpose Business + WooCommerce theme. Một core dùng cho mọi site: doanh nghiệp, corporate, agency, shop, marketplace (Dokan / WCFM / WC Vendors), blog, portfolio.
- **Điểm bán cốt lõi:**
  1. Full-site builders, dựng site không cần chạm code (Soft Mode).
  2. Hiệu năng hàng đầu ThemeForest: Lighthouse **~98 desktop / ~70 mobile** không cần cache plugin.
  3. WooCommerce chuyên sâu: skins, layouts, swatches, pre-order, sales popup, builders riêng cho Shop / Single Product / Product Type.
  4. Thư viện demo + Studio blocks khổng lồ (hàng chục demo Shop, Corporate, Business...).
  5. Tương thích rộng plugin bên thứ 3 và đa ngôn ngữ / RTL / Multisite.
- **Nguyên tắc kiến trúc:** core gọn + modules bật/tắt theo nhu cầu + template builders + display conditions + công cụ optimize/rollback/patcher.

## 2. Kiến trúc tổng thể

```text
porto-core/
├── setup/                 # Setup Wizard, Demo Import/Uninstall, System Status, Purchase Code
├── options/               # Theme Options (Redux + Live Option Panel / Customizer)
├── builders/              # Template Builder, Header/Footer, Single/Archive,
│                          # Post Type, Popup, Block, Page Layout, Type Builder
├── widgets/               # General, Header, Product, Shop, Single, Archive,
│                          # Popup, Block, Type widgets (Elementor + WPBakery + Gutenberg)
├── post-types/            # Post, Portfolio, Event, Member, FAQ
├── commerce/              # WooCommerce: archives, single, cart/checkout,
│                          # swatches, pre-order, sales popup, live search, catalog mode
├── performance/           # Speed Optimize Wizard, Merged JS/CSS, Critical CSS,
│                          # Lazyload, Preload, Minify, Disable unused
├── conditions/            # Display Condition, Conditional Rendering
├── studio/                # Studio blocks + Studio candidate (search/preview import)
├── tools/                 # Version Control/Rollback, Patcher, Refresh blocks/templates,
│                          # Compile CSS, Clear merged assets
└── compat/                # Plugin compatibility layer (SEO, cache, multilingual,
                           # multivendor, payment, GDPR, PWA...)
```

### 2.1 Setup & vận hành

- **Setup Wizard:** cài demo 1-click, AI Demo Import Assistant, AI Website Title Generator, skip media import, giới hạn 1 instance/post-type để import nhanh ~50%.
- **System Status + Share usage data:** kiểm tra môi trường, thu thập dữ liệu phân tích.
- **Import/Export:** từ file, từ URL, download data file, copy export URL.
- **Version Control:** rollback về version cũ; **Patcher:** vá bug nhỏ không cần update full.
- **Tools:** refresh Studio blocks, compile all CSS, clear merged CSS/JS, refresh display conditions.
- **Child theme ready.**

### 2.2 Theme Options (Redux + Live Option Panel)

| Nhóm | Tùy chọn chính |
|---|---|
| General | FSE (Gutenberg), Maintenance Mode, Google Map API, 404, BBPress/BuddyPress |
| Layout | Container, Page/Header/Banner/Breadcrumbs/Footer layout, Wide/Full/Boxed, Sticky Sidebar, Reveal Footer |
| Skin | Theme Colors, Global Typography, Page background, Form Style, Custom CSS & JS |
| Header | Header Builder (Customizer), 20 header types (top/left), Sticky Header, Language/Currency Switcher, Social Links, Live Search layout, Wishlist/Mini-Cart |
| Menu | Dropdown, Sidebar Menu, Mega menu + drop-down 3 cấp, Menu Lazyload, image/SVG icon cho menu item |
| Breadcrumbs | 5 kiểu, Page Title/Sub-title, Breadcrumb Path, Yoast breadcrumb option |
| Footer | Layout + widgets, Reveal Effect, Payment icons |
| Content | Image Lightbox, Microdata Rich Snippets, Show Comments, Sticky Sidebar |
| Post | Format, Archives (grid columns, pagination, date format, share, excerpt), Single (layout, author info, comments, related + carousel) |
| Portfolio | Subtitle, Slug, Archives (layout, Ajax load, filter, lightbox icon), Single (metas, slider type, layout, related) |
| Event | Slug/Single name, Archives (title, layout, excerpt, read more), Single (banner block, countdown) |
| Member | Slug, Members page, Archives (layout, pagination, filter, view type, columns), Single (layout, page style, social links) |
| FAQ | Slug/Singular name, FAQs page, sort categories, soft items, pagination |
| WooCommerce | Swatch mode, border ảnh, login link, labels, sales popup, pre-order; Archives (layout, Ajax filter, pagination, per-page, columns, quick view/compare); Single (layout, sticky add-to-cart, tabs, navigation, meta, related/upsell); Image & Zoom; Cart/Checkout (2 kiểu mỗi loại); Catalog Mode (roles, reviews, ẩn add-to-cart); Registration Form |
| Extra/SEO | Microdata, Yoast/RankMath/AIOSEO compatible, font control (custom font), smooth scroll, custom scrollbar |

### 2.3 Builders (Full Site Builder)

| Builder | Chức năng |
|---|---|
| Header | 3 cách dựng: Header Type (20 kiểu) / Header Builder trong Customizer / Header Template Builder + widgets (Logo, Menu, Switcher, Search, Mini Cart, Social, Menu Icon, Divider, My Account, Wishlist, Compare) |
| Footer | 3 Footer Types + Footer Template Builder |
| Page Layouts | Layout Builder: container, sidebar, boxed/wide/full |
| Single Builder | Dựng trang chi tiết (Post/Product/Portfolio...) + widgets (Image, Author Box, Meta, Comments, Related, Navigation, Share, Post Format) |
| Archive Builder | Dựng trang danh sách + widget Archive Posts Grid, preview content type |
| Post Type Builder | Mọi archive layout hài hòa với site; Type widgets (Featured Image, Content, Meta, Woo Buttons/Description/Rating/Stock) |
| WooCommerce Builder | Single Product Builder, Shop Builder, Product Type Builder |
| Shop Builder widgets | Product Archives, Products, Toolbox, Sort, Count, Result, Toggle, Filter, Actions, Title, Description |
| Product Builder widgets | Image, Title, Rating, Actions, Price, Excerpt, Description, Add to cart, Meta, Tabs, Upsell, Related, Linked, Navigation, Sticky Add-to-cart |
| Popup Builder | Width, Animation, Load Duration, Offset X/Y, Off-Canvas, Dynamic Popup Link |
| Block Builder | Edit Area Width; Html Blocks tái sử dụng |
| Display Condition | Hiển thị template theo device, login status, user role, post/page; Conditional Rendering cho Elementor Section/Column, WPBakery Row/Column |
| FSE (Gutenberg) | Full-Site Editing từ WP 5.9+: sửa layout/design qua UI đồ họa |
| Quick Access / Quick Toolbar | Shortcut tới option trong Elementor (5) / WPBakery (4) |

### 2.4 Widgets / Components inventory (rút gọn theo nhóm)

- **General (60+):** Toggles, Block, Container, Animation, Carousel, Testimonial, Content Box, Image Frame, Preview Image, Featured Box, Lightbox, Blockquote, Tooltip, Popover, Grid, Links Block, Recent Posts/Blog, Recent Portfolios/Portfolios/Category, Recent Members, FAQs, Map, History, Diamonds, Price Boxes, Sort Filters/Container/Item, Sticky, Schedule/Experience Timeline, Floating Menu, Events, Sidebar Menu, Icon, Ultimate Heading, Info Box, Stat Counter, Buttons, Google Map, Countdown, Ultimate Carousel, Fancytext, Modal, Carousel Logo, Info List, Interactive Banner, Page Header, Section Scroll, Share, 360 Image Viewer, Heading, Hotspot, SVG Floating, Social Icons, Image Comparison, Image Gallery, Scroll Progress, Contact Form, Cursor Effect, Page Content, Tag Cloud, Horizontal Scroller, Content Switcher.
- **Header:** Logo, Menu, Switcher, Search Form, Mini Cart, Social, Menu Icon, Divider, My Account, Wishlist, Compare.
- **Commerce:** Product (Image/Title/Rating/Actions/Price/Excerpt/Description/Add-to-cart/Meta/Tabs/Upsell/Related/Linked/Navigation/Sticky), Shop (Archives/Products/Toolbox/Sort/Count/Result/Toggle/Filter/Actions/Title/Description).
- **Content builders:** Single (Image/Author/Meta/Comments/Related/Navigation/Share/Post Format), Archive (Posts Grid), Popup (Width/Animation/Duration/Offset), Block (Edit Area Width), Type (Featured Image/Content/Meta/Woo Buttons/Description/Rating/Stock).

### 2.5 Post Types & trang chuẩn

- **Post/Blog:** 4 blog types (6 pages), grid/list view, related carousel, share, author box.
- **Portfolio:** 4 types (19 pages), category filter, Ajax load, lightbox.
- **Event:** archives + single (banner block, countdown).
- **Member/Team:** archives (filter, view type, columns) + single.
- **FAQ:** categories sort, soft items, pagination.
- **Pages chuẩn:** About, Services, Team, Process, Careers, FAQ, 404, Sitemap, Contact (3 layouts), One Page template.
- **Menu:** mega menu + drop-down 3 cấp; **Social sharing**; **Forms:** contact + newsletter; Twitter Feed widget.

### 2.6 WooCommerce subsystem

- Hiển thị: swatches (color/image), product labels, border ảnh, hover effect, quick view, compare, wishlist (YITH), zoom (nhiều kiểu), thumbnails count, video thay thumbnail, 360 viewer + zoom.
- Bán hàng: pre-order, sales popup (lịch sử mua gần đây), sticky add-to-cart (+ sticky Order Now ở checkout), upsell/related, GTIN/UPC/EAN/ISBN meta, price unit, variation show.
- Vận hành shop: Ajax filter/pagination/load-more/infinite scroll, per-page, columns, catalog mode theo role, free-shipping progress bar, cart/checkout 2 kiểu, wishlist/compare responsive.
- Tìm kiếm: **Live Search** (AJAX, popular keywords, history, ads block, filter theo brand/tag/category/FAQ/Page).

### 2.7 Performance system (bắt buộc kế thừa cho core mới)

- **Speed Optimize Wizard:** bật/tắt module (disable unused builder, mobile slider, icons...), WPBakery/Shortcodes CSS compile, Revolution Slider optimize, Bootstrap/FontAwesome/Elementor/Dokan/Woo/Gutenberg resources optimize.
- **Merged JS & CSS:** gộp request, nhanh cả khi không dùng cache plugin; split file theo nhu cầu (appear-animate, simple-line-icons, body-boxed, sticky-nav...).
- **Critical CSS:** sinh CSS cho above-the-fold từng trang, giảm render-blocking.
- **Lazyload:** images, menu, icon fonts; **Preload:** icon fonts + ảnh hero (fetchpriority); **Minify** CSS/JS; **Skeleton mode** cho gallery.
- **Dynamic styles:** tối ưu ~30ms (CSS variables), server respond ~30ms.
- **Kết quả chuẩn:** Lighthouse ≥98 desktop / ≥70 mobile (không cache plugin); accessibility demos >90–95.

### 2.8 Studio & Demos

- **Studio:** import blocks trong trang Porto Studio / Studio candidate (tìm + preview theo Elementor & WPBakery).
- **Demo catalog (tham khảo đặt tên trang core):** Personal Portfolio, SEO 1–3, Business Consulting 1–5, Shop 1–56, Home Classic, Corporate 1–21, Auto Services, Cleaning, Architecture, Law Firm, Logistics, Renewable Energy, Industry, Startup, Construction, Medical, Grocery, Beauty Salon, Dokan/Marketplace, IT Services, Digital Agency, Insurance, Barber, Band, SaaS, Coffee, Finance, Education, Real Estate, App Landing, CV/Resume, Hotel, Event, Restaurant, Gym, One Page Agency, Photography, Church, Dentist, Wedding, Parallax/Baby/Digital/Book/Bike/Game/Medical/Wine/Auto/Dark Shops, Hosting, Classic (Color/Light/Video/RTL/Dark), Blog 1–5, Portfolio 1–5.

### 2.9 Tương thích & yêu cầu kỹ thuật

- Luôn tương thích WP mới nhất + plugin tích hợp (Elementor/Pro, WPBakery/Visual Composer, Revolution Slider, HubSpot, RankMath/Yoast/AIOSEO, WPML/Polylang/qTranslate, Dokan/WC Vendors/YITH Multi-Vendor, YITH Wishlist/Ajax Search/Badge, Currency Switcher, GDPR, PWA, BBPress/BuddyPress, MailPoet, cache plugins, Minify, Nav Menu Roles, Product Filter, Post Views Counter, GeoDirectory, MemberPress...).
- **Chuẩn:** HTML5/CSS3, responsive pixel-perfect, mobile-first, RTL ready, SEO 100% + microdata, tuân thủ WP/PHP coding standards, Multisite tested, cross-browser (Firefox/Safari/Chrome/IE9–11), FAST support/updates, docs step-by-step.

---

## 3. Mapping sang HTML Template Core mới

### 3.1 Nguyên tắc chuyển đổi

| Porto (WP động) | HTML Core (static) |
|---|---|
| Theme Options / Customizer | `tokens.css` + `config.json` (colors, typography, layout, radius, spacing) |
| Builders (Header/Footer/Single/Archive/Popup/Block...) | `partials/` + layout shell + data-driven JSON (giả lập builder bằng include/partials) |
| Display Condition / Conditional Rendering | `data-display="device:mobile; role:guest..."` + `display.js` |
| Widgets (60+ general + commerce) | Component library `components/` theo chuẩn Atoms → Molecules → Organisms |
| Post Types + Archives/Single | `pages/` + `data/*.json` (posts, products, portfolio, events, members, faqs) render bằng JS tĩnh |
| WooCommerce tương tác | `commerce.js`: cart state (localStorage), quick view modal, filter/sort/pagination (client), swatches, sticky ATC, countdown, compare/wishlist (local) |
| Live Search / Ajax | `search.js`: index JSON cục bộ, suggest + history (localStorage) |
| Popup Builder | `popup.js`: modal/off-canvas, trigger theo thời gian/scroll/exit, cấu hình bằng data attributes |
| Speed Wizard / Merged / Critical CSS | Build tĩnh: 1 file `core.min.css` + `core.min.js`, `critical.css` inline cho above-the-fold, lazyload ảnh/menu, preload fonts/hero, minify |
| Studio / Demo import | `demos/` (mỗi demo = 1 folder override tokens + sections) + `blocks/` (copy-paste sections) |
| Version Control / Rollback / Patcher | Git tags + `CHANGELOG.md` + `patches/` |
| System Status | `docs/` + `lighthouse-budget.json` (performance budget) |

### 3.2 Cấu trúc thư mục core đề xuất

```text
html-core/
├── index.html                 # home mặc định (compose từ partials/blocks)
├── critical.css               # above-the-fold inline
├── tokens.css                 # design tokens (colors, type, spacing, radius, shadows)
├── core.css / core.min.css    # styles gộp + minify
├── core.js / core.min.js      # shell + builders tĩnh
├── config.json                # thay Theme Options: site, layout, header/footer,
│                              # breadcrumbs, commerce, search, popup, display rules
├── partials/
│   ├── header/ (20 header types → header-01..header-20 + header-side)
│   ├── footer/ (footer-01..03 + reveal)
│   ├── breadcrumbs/ (5 kiểu)
│   ├── page-head/ page-title-sub/
│   └── mini-cart/ search-live/ mega-menu/
├── components/                # mirror widget inventory Porto
│   ├── general/ (button, heading, carousel, testimonial, price-box,
│   │            timeline, faq-accordion, countdown, hotspot, compare-image...)
│   ├── commerce/ (product-card, swatches, quick-view, filter-bar,
│   │             cart-drawer, sticky-atc, sales-popup, progress-ship...)
│   └── content/ (post-card, portfolio-card, member-card, event-card...)
├── blocks/                    # Studio blocks copy-paste (hero, features, cta...)
├── pages/
│   ├── home-*.html            # home classic/corporate/one-page...
│   ├── shop/ (archive, filter,0812)
│   ├── product-single.html
│   ├── blog/ post-single.html
│   ├── portfolio/ portfolio-single.html
│   ├── event*/ member*/ faq.html
│   └── about/services/team/process/careers/contact-01..03/404/sitemap.html
├── demos/                     # mỗi demo = tokens override + danh sách sections
├── data/                      # posts.json, products.json, portfolio.json,
│                              # events.json, members.json, faqs.json, menus.json
├── assets/ (fonts/, images/, icons/ svg sprite)
├── js/ (display.js, search.js, commerce.js, popup.js, slider.js,
│        lazyload.js, counters.js, forms.js)
├── docs/ (file đặc tả này + component catalog + changelog)
├── patches/
└── lighthouse-budget.json
```

### 3.3 Design tokens tối thiểu (thay Theme Options)

```css
:root {
  /* layout */
  --container: 1200px; --layout: wide; /* wide|full|boxed */
  /* skin */
  --primary: #08c; --secondary: #...; --dark: #...; --light: #...;
  /* typography */
  --font-base: ...; --font-heading: ...;
  --h1: ...; --h2: ...; --h3: ...; --body: ...;
  /* shape & depth */
  --radius: ...; --shadow: ...;
  /* header/footer */
  --header-h: ...; --header-sticky: 1; --footer-reveal: 0;
  /* commerce */
  --product-radius: ...; --swatch-size: ...;
}
```

### 3.4 Component contract (mỗi component trong `components/`)

Mỗi component gồm: `*.html` (markup), `*.css` (scoped theo BEM), `*.js` (optional, progressive enhancement), `*.json` (props/data mẫu), `README` ngắn. Quy ước class BEM: `porto-<block>__<element>--<modifier>`. Data attributes chuẩn: `data-component`, `data-display`, `data-popup`, `data-search`, `data-commerce`.

### 3.5 Trang bắt buộc cho core v1 (MVP)

1. `index.html` (home corporate) + 1 home shop + 1 one-page.
2. Header types: top standard + transparent + side; Footer 01 + reveal; Breadcrumbs 01.
3. `shop-archive.html` (grid/list, filter, sort, pagination client) + `product-single.html` (gallery/zoom, swatches, tabs, sticky ATC, related/upsell).
4. `blog.html` + `post-single.html` (author box, related carousel, share).
5. `portfolio.html` + `portfolio-single.html` (filter, lightbox).
6. `faq.html` (accordion + category filter), `contact-01.html` (form + map placeholder), `404.html`, `about/services/team/process.html`.
7. Popup (newsletter + sales), mini-cart drawer, live search dropdown, back-to-top, sticky sidebar demo.

### 3.6 Performance budget (kế thừa Porto)

- 1 CSS gộp + 1 JS gộp (defer), critical CSS inline < 14KB, fonts preload (woff2) + `font-display: swap`.
- Ảnh: lazyload + `fetchpriority="high"` cho hero, AVIF/WebP + fallback, kích thước đúng khung.
- Slider/carousel: chỉ init khi vào viewport; tắt animation trên mobile yếu.
- Mục tiêu: Lighthouse Performance ≥95 desktop / ≥70 mobile, Accessibility ≥95, Best Practices/SEO ≥95 (đo không cache plugin, mạng 4G mô phỏng).

### 3.7 Quy tắc code & kiểm thử

- HTML5 valid, BEM, không inline style (trừ critical), không !important trong core (chỉ cho phép ở utility).
- Mọi tương tác phải chạy được khi JS tắt ở mức nội dung cơ bản (progressive enhancement).
- Mỗi PR/commit: `lighthouse-budget.json` pass + checklist: responsive 360/768/1280, RTL smoke test, keyboard và aria cho modal/menu/accordion/tabs.
- `CHANGELOG.md` theo format Porto (Added/Updated/Fixed/Removed) + `patches/` cho hotfix.

---

## 4. Checklist triển khai core mới

- [ ] Chốt `tokens.css` + `config.json` từ Theme Options Porto (§2.2).
- [ ] Dựng layout shell: header/footer/breadcrumbs/page-layouts (wide/full/boxed, sticky, reveal).
- [ ] Port 20 header types → rút gọn còn 3–5 cho v1, giữ interface mở rộng.
- [ ] Xây component library theo inventory §2.4 (ưu tiên: button, heading, carousel, product-card, filter-bar, faq, popup, search).
- [ ] Dựng pages MVP §3.5 với `data/*.json`.
- [ ] Triển khai `display.js` (display conditions), `search.js`, `commerce.js`, `popup.js`.
- [ ] Build pipeline: merge+minify, critical CSS, lazyload, preload (đạt budget §3.6).
- [ ] Viết `docs/component-catalog.md` (props từng component) + `CHANGELOG.md`.
- [ ] Đo Lighthouse 3 trang đại diện (home, shop archive, product single) và ghi kết quả vào docs.
