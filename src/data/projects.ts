// One entry per project. Images are file stems under src/assets/work (no extension).
export type Project = {
  slug: string;
  title: string;
  kind: string;
  text: string;
  link?: { label: string; url: string };
  aside?: string;
  media: { image?: string; special?: 'river' | 'lava' };
};

export const projects: Project[] = [
  {
    slug: 'vectorshield',
    title: 'VectorShield',
    kind: 'iOS and Apple Watch app, Chrome extension, website',
    text: 'VectorShield is an app for people with alpha-gal syndrome, the tick-borne allergy to mammalian products. It scans products, checks medications against FDA data, and finds safe food, all tuned to one of four sensitivity levels, and a Chrome extension does the same on retail sites. I built it because I wish I’d had it when I was learning I had alpha-gal syndrome.',
    link: { label: 'Visit vectorshield.app', url: 'https://vectorshield.app' },
    media: { image: 'vectorshield-home-desktop' },
  },
  {
    slug: 'riverstock',
    title: 'Riverstock',
    kind: 'Hydrology model, in progress',
    text: 'Riverstock is a model of the Little Red River below Greers Ferry Dam. It answers one question: how deep will the river be at your access point, at the hour you plan to be standing in it? The model and data pipeline are built and tested, and the API and apps come next. One finding already matters. The release wave reaches Ramsey Access in a median of twelve hours, not the eight hours anglers repeat.',
    media: { special: 'river' },
  },
  {
    slug: 'lavarise',
    title: 'LavaRise',
    kind: 'iPhone game',
    text: 'LavaRise is a pixel-art climbing game. You slingshot upward to outrun rising lava through 100 levels and 10 chapters. I made it for fun and to learn the full path from pixel art to App Store review.',
    link: { label: 'Get it on the App Store', url: 'https://apps.apple.com/us/app/lavarise/id6759515609' },
    media: { special: 'lava' },
  },
  {
    slug: 'hutchs-rv-park',
    title: 'Hutch’s RV Park',
    kind: 'Website and brand',
    text: 'Hutch’s RV Park is my family’s park in Searcy, Arkansas. I drew the original layout of the park, designed the brand, and built the website my brothers run it with. It runs on Next.js with a Git-backed editor, so they can change deals and events without calling me.',
    link: { label: 'Visit hutchsrv.com', url: 'https://hutchsrv.com' },
    media: { image: 'hutchrv-home-desktop' },
  },
  {
    slug: 'elrod-construction',
    title: 'Elrod Construction & Services',
    kind: 'Website, logo, and video',
    text: 'Elrod Construction & Services builds homes in Texarkana. The owner needed a site, so I designed and built one on Astro, traced the logo from a raster original, and cut a hero video from the company’s own drone footage. Adding a project to the portfolio is as simple as sending a photo.',
    aside: 'The custom domain is on its way.',
    media: { image: 'elrod-home-desktop' },
  },
];
