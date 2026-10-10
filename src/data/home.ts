// The home page's short sections that are not projects: whole sentences in Sam's voice.
// The page and llms-full.txt both read from here, so the two never drift.
import { site } from './site';

export const work = {
  intro: 'Everything here is finished or in daily use.',
};

export const music = {
  text: `I’ve released music since I was eighteen, first as 2NDSAMUEL and now as ${site.fullName}. Lately I’ve been making beats with hard drums.`,
};

export const method = {
  title: 'How I work',
  verse: 'Speak, for your servant hears.',
  cite: '1 Samuel 3:10',
  text: 'Listening comes first. I try to know the heart of the customer and then apply technical wisdom to it, and that is the whole method.',
  // On the page the address becomes a mailto link.
  contact: `Client work runs through ${site.company}. If you have a project in mind, write to ${site.email}.`,
};
