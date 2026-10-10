// One entry per project. Images are file stems under src/assets/work (no extension).
// Every sentence here was said by Sam or read from the project's own repository.
export type Shot = { stem: string; alt: string; kind: 'phone' | 'desktop' | 'watch' };
export type Project = {
  slug: string;
  title: string;
  kind: string;
  text: string;
  link?: { label: string; url: string };
  aside?: string;
  icon?: string;
  media: { image?: string; phones?: string[]; special?: 'river' };
  // The project page.
  since: string;
  status: string;
  platforms: string[];
  built: string[];
  appStore?: string;
  more: string[];
  shots: Shot[];
  figure?: { stem: string; alt: string; caption: string };
  wave?: boolean;
};

export const projects: Project[] = [
  {
    slug: 'vectorshield',
    title: 'VectorShield',
    kind: 'iOS and Apple Watch app, Chrome extension, website',
    text: 'VectorShield is an app for people with alpha-gal syndrome, the tick-borne allergy to mammalian products. It scans products, checks medications against FDA data, and finds safe food, all tuned to one of four sensitivity levels, and a Chrome extension does the same on retail sites. I built it because I wish I’d had it when I was learning I had alpha-gal syndrome.',
    link: { label: 'Visit vectorshield.app', url: 'https://vectorshield.app' },
    icon: 'vectorshield-icon',
    media: { phones: ['vectorshield-meds', 'vectorshield-medication', 'vectorshield-restaurants'] },
    since: '2025',
    status: 'On the App Store',
    platforms: ['iPhone', 'Apple Watch', 'Chrome', 'Web'],
    built: ['Swift and SwiftUI', 'Next.js', 'Supabase'],
    appStore: 'https://apps.apple.com/us/app/vectorshield/id6759514220',
    more: [
      'The app has a food analyzer for products and menu items, a medication checker built on FDA ingredient data for prescription and over-the-counter drugs, four sensitivity levels with dairy tolerance settings and family profiles, and community safety reports that people vote on. It reads heart rate from Apple Watch and other wearables through Apple Health to help spot a reaction, and what it learns about which foods are safe for you stays on the device.',
      'The website carries a research page with an anonymized dataset from the sensitivity quiz and a map of suspected alpha-gal cases, which run highest in Arkansas, Oklahoma, and Missouri.',
    ],
    shots: [
      { stem: 'vectorshield-meds', alt: 'The Meds screen: a search box for medications, supplements, and products, and categories with product counts', kind: 'phone' },
      { stem: 'vectorshield-medication', alt: 'A medication check for a cold and flu caplet, marked safe, with its active and inactive ingredients listed', kind: 'phone' },
      { stem: 'vectorshield-restaurants', alt: 'The restaurant finder with nearby places and their safety ratings', kind: 'phone' },
      { stem: 'vectorshield-community', alt: 'The community feed with safety tips from other people with alpha-gal syndrome', kind: 'phone' },
      { stem: 'vectorshield-watch', alt: 'The Apple Watch face showing heart rate and heart rate variability over the last day', kind: 'watch' },
      { stem: 'vectorshield-home-desktop', alt: 'The vectorshield.app home page', kind: 'desktop' },
      { stem: 'vectorshield-map-desktop', alt: 'The map of suspected alpha-gal cases by county', kind: 'desktop' },
      { stem: 'vectorshield-research-desktop', alt: 'The research page with the anonymized sensitivity dataset', kind: 'desktop' },
    ],
  },
  {
    slug: 'riverstock',
    title: 'Riverstock',
    kind: 'Hydrology model, in progress',
    text: 'Riverstock is a model of the Little Red River below Greers Ferry Dam. It answers one question: how deep will the river be at your access point, at the hour you plan to be standing in it? The model and data pipeline are built and tested, and the API and apps come next. One finding already matters. The release wave reaches Ramsey Access in a median of twelve hours, not the eight hours anglers repeat.',
    media: { special: 'river' },
    since: '2026',
    status: 'Model and data pipeline built, app in progress',
    platforms: ['Server', 'iPhone, in progress', 'Raspberry Pi display, in progress'],
    built: ['Python', 'PostgreSQL and TimescaleDB', 'SwiftUI'],
    more: [
      'The reach below the dam has two gauged points, the dam tailwater and Dewey at mile 29.5, and every access people fish from sits between them. The model routes each generation release down the river and gives each access a discharge, an arrival time, and a wadeability class with the discharge printed beside it, because the wadeable threshold is still being measured.',
      'Water temperature is measured at the same two points. Between them the model draws a straight line and says so, and the measured means show why that is only a start: the river warms toward Dewey in summer and runs colder there in winter.',
      'It is a Python model on PostgreSQL with TimescaleDB, fed by the USGS water data API, the Corps of Engineers, and the power administration’s generation schedule. The figure below is from the model’s own documentation: three ways to join the two measured points, why a curve in distance alone is wrong, and how the chosen kernel’s peak compares with the measured peak at Dewey.',
    ],
    shots: [],
    wave: true,
    figure: {
      stem: 'riverstock-interior-peak',
      alt: 'Three charts from the Riverstock documentation: three ways to join the two measured points, peak discharge against miles below the dam for release blocks of two to ten hours, and the kernel peak divided by the measured peak at Dewey for each analogue cell',
      caption: 'The interior peak, from the Riverstock documentation. Every trout-reach access is ungauged, and these figures are the evidence that decided how the gap between the two measured points is filled.',
    },
  },
  {
    slug: 'lavarise',
    title: 'LavaRise',
    kind: 'iPhone game',
    text: 'LavaRise is a pixel-art climbing game. You slingshot upward to outrun rising lava through 100 levels and 10 chapters. I made it for fun and to learn the full path from pixel art to App Store review.',
    link: { label: 'Get it on the App Store', url: 'https://apps.apple.com/us/app/lavarise/id6759515609' },
    icon: 'lavarise-icon',
    media: { phones: ['lavarise-lava', 'lavarise-grapple', 'lavarise-chapters'] },
    since: '2025',
    status: 'On the App Store',
    platforms: ['iPhone'],
    built: ['Godot 4', 'GDScript'],
    appStore: 'https://apps.apple.com/us/app/lavarise/id6759515609',
    more: [
      'You aim with a drag and let go, and a sweet spot on the charge meter gives a stronger launch. A few boosts carry you further in the air. Two gadgets help: a platform creator that drops a temporary platform under you, and a grappling hook that pulls you to a surface. There are 44 achievements, a daily reward, and a shop for upgrades.',
      'It is built in Godot with GDScript. The sprites came out of a pixel-art diffusion model and were fitted into the game one at a time.',
    ],
    shots: [
      { stem: 'lavarise-menu', alt: 'The LavaRise main menu', kind: 'phone' },
      { stem: 'lavarise-lava', alt: 'A climb with the lava rising from below', kind: 'phone' },
      { stem: 'lavarise-grapple', alt: 'The grappling hook pulling the player to a platform', kind: 'phone' },
      { stem: 'lavarise-chapters', alt: 'The chapter select screen', kind: 'phone' },
      { stem: 'lavarise-shop', alt: 'The shop with the two gadgets', kind: 'phone' },
      { stem: 'lavarise-achievements', alt: 'The achievements list', kind: 'phone' },
    ],
  },
  {
    slug: 'hutchs-rv-park',
    title: 'Hutch’s RV Park',
    kind: 'Website and brand',
    text: 'Hutch’s RV Park is my family’s park in Searcy, Arkansas. I drew the original layout of the park, designed the brand, and built the website my brothers run it with. It runs on Next.js with a Git-backed editor, so they can change deals and events without calling me.',
    link: { label: 'Visit hutchsrv.com', url: 'https://hutchsrv.com' },
    media: { image: 'hutchrv-home-desktop' },
    since: '2024',
    status: 'Live',
    platforms: ['Web'],
    built: ['Next.js', 'Keystatic'],
    more: [
      'The logo and the colors came first, and then the site that carries them. The content lives in Git behind a visual editor, so a deal or an event is a form, not a code change. The map of the park started as my own drawings of the layout.',
    ],
    shots: [
      { stem: 'hutchrv-home-desktop', alt: 'The hutchsrv.com home page', kind: 'desktop' },
      { stem: 'hutchrv-map-desktop', alt: 'The park map page', kind: 'desktop' },
      { stem: 'hutchrv-home-phone', alt: 'The home page on a phone', kind: 'phone' },
      { stem: 'hutchrv-stay-phone', alt: 'The stay page on a phone, with the sites and rates', kind: 'phone' },
      { stem: 'hutchrv-attractions-phone', alt: 'The attractions page on a phone', kind: 'phone' },
    ],
  },
  {
    slug: 'elrod-construction',
    title: 'Elrod Construction & Services',
    kind: 'Website, logo, and video',
    text: 'Elrod Construction & Services builds homes in Texarkana. The owner needed a site, so I designed and built one on Astro, traced the logo from a raster original, and cut a hero video from the company’s own drone footage. Adding a project to the portfolio is as simple as sending a photo.',
    link: { label: 'Visit elrodconstructionservices.com', url: 'https://elrodconstructionservices.com' },
    media: { image: 'elrod-home-desktop' },
    since: '2026',
    status: 'Live',
    platforms: ['Web'],
    built: ['Astro', 'Tailwind CSS', 'Cloudflare Pages'],
    more: [
      'The site runs on Astro and Tailwind and is served by Cloudflare Pages. The logo was a raster file, so I traced it into a clean vector that scales from a favicon to a sign. The hero video is cut from the company’s own drone footage.',
    ],
    shots: [
      { stem: 'elrod-home-desktop', alt: 'The elrodconstructionservices.com home page with the hero video', kind: 'desktop' },
      { stem: 'elrod-portfolio-desktop', alt: 'The portfolio page of finished homes', kind: 'desktop' },
      { stem: 'elrod-home-phone', alt: 'The home page on a phone', kind: 'phone' },
      { stem: 'elrod-services-phone', alt: 'The services page on a phone', kind: 'phone' },
      { stem: 'elrod-about-phone', alt: 'The about page on a phone', kind: 'phone' },
    ],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
