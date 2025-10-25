import fs from "fs";
import path from "path";

export interface HeroContent {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  badge?: string;
  image?: string;
}

export interface Feature {
  number: string;
  title: string;
  description: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  suffix?: string;
  label: string;
}

export interface MixedLeagueContent {
  hero: HeroContent;
  about: {
    title: string;
    description: string;
  };
  features: Feature[];
  howItWorks: {
    title: string;
    steps: Array<{
      step: string;
      title: string;
      description: string;
    }>;
  };
  stats: {
    title: string;
    subtitle: string;
    stats: Stat[];
  };
  faq: {
    title: string;
    items: FAQItem[];
  };
}

const contentDirectory = path.join(process.cwd(), "content");

export async function getMixedLeagueContent(): Promise<MixedLeagueContent> {
  const filePath = path.join(contentDirectory, "mixed-league.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
}

export async function updateMixedLeagueContent(content: MixedLeagueContent): Promise<void> {
  const filePath = path.join(contentDirectory, "mixed-league.json");
  fs.writeFileSync(filePath, JSON.stringify(content, null, 2), "utf8");
}

