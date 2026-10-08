// One entry per project. Images are file stems under src/assets/work (no extension).
export type Link = { label: string; url: string };
export type Project = {
  slug: string;
  title: string;
  kind: string;
  status: 'shipped' | 'in-progress';
  line: string;
  links: Link[];
  note?: string;
  facts: string[];
  media: { desktop?: string; phone?: string; special?: 'river' | 'lava' };
};

export const projects: Project[] = [
  {
    slug: 'vectorshield',
    title: 'VectorShield',
    kind: 'iOS and watchOS app · Chrome extension · website',
    status: 'shipped',
    line: 'Alpha-gal safety. Scan products, check medications, find safe food, tuned to your sensitivity level.',
    links: [{ label: 'vectorshield.app', url: 'https://vectorshield.app' }],
    facts: [
      'Built because I wish I would have had it when I was learning I had alpha-gal syndrome.',
      'Four sensitivity levels. Food analysis on the device. Medication checks on FDA data. Reaction detection from Apple Watch and other wearables.',
      'The Chrome extension reads product pages on nine retailers and label photos with on-device OCR. "Gelatin free" does not trip the alarm.',
    ],
    media: { desktop: 'vectorshield-home-desktop', phone: 'vectorshield-medications-phone' },
  },
  {
    slug: 'riverstock',
    title: 'Riverstock',
    kind: 'Hydrology model · Python · PostgreSQL',
    status: 'in-progress',
    line: 'How deep will the Little Red River be at your access point, at the hour you plan to be standing in it?',
    links: [],
    note: 'Model and ingestion built. API and apps next.',
    facts: [
      'Started as a display for my parents’ river house showing the gauges. Became a model of the release wave from Greers Ferry Dam.',
      'Measured, not folklore: the wave reaches Ramsey Access in a median of twelve hours, not the eight everyone repeats.',
      '280 tests. Four scheduled ingestion jobs. Built on the new USGS API before the old one goes dark. Not a safety device, and it will never claim to be.',
    ],
    media: { special: 'river' },
  },
  {
    slug: 'lavarise',
    title: 'LavaRise',
    kind: 'iOS game · pixel art',
    status: 'shipped',
    line: 'Slingshot upward to outrun rising lava. 100 levels, 10 chapters, 44 achievements.',
    links: [
      { label: 'App Store', url: 'https://apps.apple.com/us/app/lavarise/id6759515609' },
      { label: 'Privacy policy', url: '/privacy.html' },
    ],
    facts: [
      'Made for fun, and to learn the whole App Store path from pixel art to review.',
      'No account. Progress stays on the phone.',
    ],
    media: { special: 'lava' },
  },
  {
    slug: 'hutchs-rv-park',
    title: 'Hutch’s RV Park',
    kind: 'Website · brand · content system',
    status: 'shipped',
    line: 'The family RV park in Searcy, Arkansas. I drew the park layout, then built the site my brothers run it with.',
    links: [{ label: 'hutchsrv.com', url: 'https://hutchsrv.com' }],
    facts: [
      'Next.js with Keystatic, so deals, events, and photos get edited in a plain editor and the site rebuilds itself.',
      'Brand mark, icons, video, and the move off the old provider onto our own stack.',
    ],
    media: { desktop: 'hutchrv-home-desktop', phone: 'hutchrv-stay-phone' },
  },
  {
    slug: 'elrod-construction',
    title: 'Elrod Construction & Services',
    kind: 'Website · logo · video',
    status: 'shipped',
    line: 'A contractor in Texarkana needed a site. The owner sends photos; the site does the rest.',
    links: [],
    note: 'Custom domain pending DNS.',
    facts: [
      'Astro and Tailwind on Cloudflare Pages. One line per photo, and the build makes every size.',
      'Logo traced from a raster original. Hero video cut from the company’s own drone footage.',
    ],
    media: { desktop: 'elrod-home-desktop', phone: 'elrod-home-phone' },
  },
];
