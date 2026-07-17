import { headers } from "next/headers";
import { POLICE_ACADEMY_QUOTE_HTML, POLICE_ACADEMY_BODY } from "@asd/domain";

export type Quote = {
  badge?: string;
  text?: string;
  html?: string;
  link?: string;
  url?: string;
};

export type SiteConfig = {
  name: string;
  meta: {
    title: string;
    description: string;
  };
  colors: {
    primary: string;
  };
  marketContext: string;
  prefilterQuestions: string[];
  page: {
    title: string;
    description: string;
    heroImage: string;
    headerLogo: { src: string; width: number; height: number };
    quotes: Quote[];
    bodyContent?: string;
  };
};

const HEALTH_QUOTES_2026: Quote[] = [
  {
    badge: "/funnels/health/badge_the-100-best-jobs.png",
    text: '"Nurse practitioner is the number one job in the 2026 U.S. News Best 100 Jobs in America rankings, with three other healthcare careers in the top 10."',
    link: "U.S. News",
    url: "https://careers.usnews.com/best-jobs/rankings/the-100-best-jobs",
  },
  {
    text: '"The healthcare sector is projected to grow 8.4% through 2034, much faster than the average for all occupations, adding about 1.9 million new jobs"',
    link: "U.S. Bureau of Labor Statistics Occupational Outlook Handbook",
    url: "https://www.bls.gov/ooh/healthcare/home.htm",
  },
];

const HEALTH_QUOTES_2020: Quote[] = [
  {
    badge: "/funnels/health/badge_the-100-best-jobs.png",
    text: '"The 2020 U.S. News Best Jobs rankings is packed with healthcare occupations, and healthcare also takes a majority of best-paying jobs."',
    link: "U.S. News & World Report",
    url: "https://www.usnews.com/info/blogs/press-room/articles/2020-01-07/us-news-reveals-the-2020-best-jobs",
  },
  {
    text: '"The healthcare sector is projected to grow 15% through 2029, much faster than the average for all occupations, adding about 2.4 million new jobs."',
    link: "U.S. Bureau of Labor Statistics Occupational Outlook Handbook, May 2019",
    url: "https://www.bls.gov/ooh/healthcare/home.htm",
  },
];

const defaultConfig: SiteConfig = {
  name: "My Health Degree Search",
  meta: {
    title: "Join the Thriving Healthcare Industry—Find Health Care Schools | My Health Degree Search",
    description: "My Health Degree Search",
  },
  colors: {
    primary: "#097f92",
  },
  marketContext: "health-acs",
  prefilterQuestions: ["subjectArea", "hsGraduation", "education"],
  page: {
    title: "Prepare to Enter the Healthcare Field",
    description: "The right education is closer than you think!",
    heroImage: "/funnels/myhealthdegreesearch/hero-960px.jpg",
    headerLogo: { src: "/funnels/myhealthdegreesearch/header-logo.png", width: 224, height: 30 },
    quotes: HEALTH_QUOTES_2026,
  },
};

const siteConfigs: Record<string, SiteConfig> = {
  "myhealthdegreesearch.com": defaultConfig,
  "findhealthschools.com": {
    name: "Find Health Schools",
    meta: {
      title: "Join the Thriving Healthcare Industry—Find Health Care Schools | Find Health Schools",
      description: "Find Health Schools",
    },
    colors: { primary: "#097f92" },
    marketContext: "health-acs",
    prefilterQuestions: ["subjectArea", "hsGraduation", "education"],
    page: {
      title: "Prepare to Enter the Healthcare Field",
      description: "The right education is closer than you think!",
      heroImage: "/funnels/findhealthschools/hero-960px.jpg",
      headerLogo: { src: "/funnels/findhealthschools/header-logo.png", width: 153, height: 30 },
      quotes: HEALTH_QUOTES_2020,
    },
  },
  "findhealthcareschools.com": {
    name: "Find Health Care Schools",
    meta: {
      title: "Join the Thriving Healthcare Industry—Find Health Care Schools | Find Health Care Schools",
      description: "Find Health Care Schools",
    },
    colors: { primary: "#097f92" },
    marketContext: "health-acs",
    prefilterQuestions: ["subjectArea", "hsGraduation", "education"],
    page: {
      title: "Prepare to Enter the Healthcare Field",
      description: "The right education is closer than you think!",
      heroImage: "/funnels/findhealthcareschools/hero-960px.jpg",
      headerLogo: { src: "/funnels/findhealthcareschools/header-logo.png", width: 179, height: 30 },
      quotes: HEALTH_QUOTES_2020,
    },
  },
  "healthschoolsearch.com": {
    name: "Health School Search",
    meta: {
      title: "Join the Thriving Healthcare Industry—Find Health Care Schools | Health School Search",
      description: "Health School Search",
    },
    colors: { primary: "#097f92" },
    marketContext: "health-acs",
    prefilterQuestions: ["subjectArea", "hsGraduation", "education"],
    page: {
      title: "Prepare to Enter the Healthcare Field",
      description: "The right education is closer than you think!",
      heroImage: "/funnels/healthschoolsearch/hero-960px.jpg",
      headerLogo: { src: "/funnels/healthschoolsearch/header-logo.png", width: 170, height: 30 },
      quotes: HEALTH_QUOTES_2020,
    },
  },
  "myhealthschoolsearch.com": {
    name: "My Health School Search",
    meta: {
      title: "Join the Thriving Healthcare Industry—Find Healthcare Schools | My Health School Search",
      description: "My Health School Search",
    },
    colors: { primary: "#097f92" },
    marketContext: "health-acs",
    prefilterQuestions: ["subjectArea", "hsGraduation", "education"],
    page: {
      title: "Prepare to Enter the Healthcare Field",
      description: "The right education is closer than you think!",
      heroImage: "/funnels/myhealthschoolsearch/hero-960px.jpg",
      headerLogo: { src: "/funnels/myhealthschoolsearch/header-logo.png", width: 183, height: 30 },
      quotes: HEALTH_QUOTES_2026,
    },
  },
  "nursingschooldegrees.com": {
    name: "Nursing School Degrees",
    meta: {
      title: "Administer Superior Care - Find Nursing Schools | Nursing School Degrees",
      description: "Nursing School Degrees",
    },
    colors: { primary: "#097f92" },
    marketContext: "ans-basic",
    prefilterQuestions: ["subjectArea", "education", "nursingLicense"],
    page: {
      title: "Prepare to Enter the Healthcare Field",
      description: "The right education is closer than you think!",
      heroImage: "/funnels/nursingschooldegrees/hero-960px.jpg",
      headerLogo: { src: "/funnels/nursingschooldegrees/header-logo.png", width: 163, height: 30 },
      quotes: [
        {
          badge: "/funnels/health/badge_the-100-best-jobs.png",
          text: '"Nursing careers ranked highly in U.S. New Best Healthcare Careers for 2022, with Nurse Practitioners at #1, Registered Nurses at #5, and Nurse Anesthetists at #8."',
          link: "U.S. News and World Report Best Healthcare Jobs",
          url: "https://money.usnews.com/careers/best-jobs/rankings/best-healthcare-jobs",
        },
        {
          text: "Nurse practitioners and nurse anesthetists are two of the fastest growing healthcare fields through 2030, with a 52% job growth for nurse practitioners alone.",
          link: "U.S. Bureau of Labor Statistics Occupational Outlook Handbook, 2021",
          url: "https://www.bls.gov/ooh/healthcare/nurse-anesthetists-nurse-midwives-and-nurse-practitioners.htm#tab-6",
        },
      ],
    },
  },
  "police-academy-search.com": {
    name: "Police Academy Search",
    meta: {
      title: "Find Police Academy and Law Enforcement Training - Prepare to Serve & Protect Your Community",
      description: "Prepare to Serve & Protect Your Community",
    },
    colors: { primary: "#0066cc" },
    marketContext: "health-acs",
    prefilterQuestions: ["postalCode", "hsGraduation", "education"],
    page: {
      title: "Pursue an Education in Law Enforcement & Criminal Justice",
      description: "Find the info you need to start your degree in law enforcement, corrections, or criminal justice.",
      heroImage: "/funnels/police-academy-search/hero-960px.jpg",
      headerLogo: { src: "/funnels/police-academy-search/header-logo.png", width: 173, height: 30 },
      quotes: [
        {
          badge: "/funnels/police-academy-search/badge-logo.jpg",
          html: POLICE_ACADEMY_QUOTE_HTML,
        },
      ],
      bodyContent: POLICE_ACADEMY_BODY,
    },
  },
};

function getRootDomain(host: string): string {
  const hostWithoutPort = host.split(":")[0];
  const parts = hostWithoutPort.split(".");
  return parts.length > 2 ? parts.slice(-2).join(".") : hostWithoutPort;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  if (process.env.SITE_KEY && siteConfigs[process.env.SITE_KEY]) {
    return siteConfigs[process.env.SITE_KEY];
  }
  const host = (await headers()).get("host") ?? "";
  const rootDomain = getRootDomain(host);
  return siteConfigs[rootDomain] ?? defaultConfig;
}
