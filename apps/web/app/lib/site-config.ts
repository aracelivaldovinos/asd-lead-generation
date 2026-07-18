import { headers } from "next/headers";
import { POLICE_ACADEMY_QUOTE_HTML, POLICE_ACADEMY_BODY } from "@asd/domain";

export type Quote = {
  badge?: string;
  text?: string;
  html?: string;
  link?: string;
  url?: string;
};

type PageBase = {
  title: string;
  description: string;
  headerLogo: { src: string; width: number; height: number };
};

export type Subject = {
  icon: string;
  title: string;
  description: string;
  marketContext: string;
};

export type FunnelSiteConfig = {
  type: "funnel";
  name: string;
  meta: { title: string; description: string };
  colors: { primary: string };
  marketContext: string;
  prefilterQuestions: string[];
  page: PageBase & {
    heroImage: string;
    quotes: Quote[];
    bodyContent?: string;
  };
};

export type HubSiteConfig = {
  type: "hub";
  name: string;
  meta: { title: string; description: string };
  colors: { primary: string };
  prefilterQuestions: string[];
  subjects: Subject[];
  page: PageBase;
};

export type SiteConfig = FunnelSiteConfig | HubSiteConfig;

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

const healthBase = {
  type: "funnel" as const,
  colors: { primary: "#097f92" },
  marketContext: "health-acs",
  prefilterQuestions: ["subjectArea", "hsGraduation", "education"],
  page: {
    title: "Prepare to Enter the Healthcare Field",
    description: "The right education is closer than you think!",
  },
};

function getAcolsSubjects(prefix: "acols" | "agrads"): Subject[] {
  const base = "/acols/all-college-search/context";
  return [
    {
      icon: `${base}/abs.svg`,
      title: "Business",
      description: "By the numbers or outside the box: find your fit. Manage a team and lead projects to greatness. In business, hard work and focus will take you far.",
      marketContext: `${prefix}-business`,
    },
    {
      icon: `${base}/acjs.svg`,
      title: "Criminal Justice",
      description: "If community is your priority, join leadership-minded students who work to protect and serve. Support the legal process on the ground or in the office.",
      marketContext: `${prefix}-criminal-justice`,
    },
    {
      icon: `${base}/aes.svg`,
      title: "Education",
      description: "The more you know, the farther you'll go. Learning is a constant for those in this ever-changing field. Patience and persistence will earn high marks.",
      marketContext: `${prefix}-education`,
    },
    {
      icon: `${base}/ahs.svg`,
      title: "Healthcare",
      description: "Compassionate and skilled professionals are the vital signs of this thriving industry. Work broadly or with specialized contexts and populations.",
      marketContext: `${prefix}-healthcare`,
    },
    {
      icon: `${base}/ans.svg`,
      title: "Nursing",
      description: "Tough and tender spirits excel in nursing. Nurses manage heavy workloads and demanding schedules while providing precise and caring service.",
      marketContext: `${prefix}-nursing`,
    },
    {
      icon: `${base}/apsy.svg`,
      title: "Psychology",
      description: "The mind matters. Strengthen yours by helping others. Discover your options in a wide-ranging field that strives to improve the well-being of communities and individuals.",
      marketContext: `${prefix}-psychology`,
    },
    {
      icon: `${base}/acom.svg`,
      title: "Technology & Engineering",
      description: "As the backbone of modern business, you'll provide imagination and essential support to a variety of industries. Creativity + tech-savvy = no limits.",
      marketContext: `${prefix}-technology`,
    },
    {
      icon: `${base}/nh.svg`,
      title: "Natural Healing",
      description: "No matter where you fit in the natural healing and wellness space, there are programs, from massage therapy to alternative medicines, to help you learn to heal others.",
      marketContext: `${prefix}-natural-healers`,
    },
    {
      icon: `${base}/lib.svg`,
      title: "Liberal Arts",
      description: "Find your inner-Renaissance man or woman. Keep languages, history, politics and religion in the forefront with a degree in liberal arts.",
      marketContext: `${prefix}-liberal-arts`,
    },
  ];
}

const allCollegeSearchConfig: HubSiteConfig = {
  type: "hub",
  name: "All College Search",
  meta: {
    title: "Find Your College Degree Program | All College Search",
    description: "Join more than one million prospective students who have pursued an education through All College Search",
  },
  colors: { primary: "#024c9c" },
  prefilterQuestions: ["subjectArea", "hsGraduation", "education"],
  subjects: getAcolsSubjects("acols"),
  page: {
    title: "Choose your area of interest",
    description: "Join more than one million prospective students who have pursued an education through All College Search",
    headerLogo: { src: "/acols/all-college-search/logo-color.svg", width: 206, height: 32 },
  },
};

const allGraduateSchoolsConfig: HubSiteConfig = {
  type: "hub",
  name: "All Graduate Schools",
  meta: {
    title: "Find Your Graduate Degree Program | All Graduate Schools",
    description: "Join more than one million prospective students who have pursued a graduate education through All Graduate Schools",
  },
  colors: { primary: "#024c9c" },
  prefilterQuestions: ["subjectArea", "hsGraduation", "education"],
  subjects: getAcolsSubjects("agrads"),
  page: {
    title: "Choose your area of interest",
    description: "Join more than one million prospective students who have pursued a graduate education through All Graduate Schools",
    headerLogo: { src: "/acols/all-graduate-schools/logo-color.svg", width: 235, height: 32 },
  },
};

const defaultConfig: FunnelSiteConfig = {
  ...healthBase,
  name: "My Health Degree Search",
  meta: {
    title: "Join the Thriving Healthcare Industry—Find Health Care Schools | My Health Degree Search",
    description: "My Health Degree Search",
  },
  page: {
    ...healthBase.page,
    heroImage: "/funnels/myhealthdegreesearch/hero-960px.jpg",
    headerLogo: { src: "/funnels/myhealthdegreesearch/header-logo.png", width: 224, height: 30 },
    quotes: HEALTH_QUOTES_2026,
  },
};

const siteConfigs: Record<string, SiteConfig> = {
  "myhealthdegreesearch.com": defaultConfig,
  "findhealthschools.com": {
    ...healthBase,
    name: "Find Health Schools",
    meta: {
      title: "Join the Thriving Healthcare Industry—Find Health Care Schools | Find Health Schools",
      description: "Find Health Schools",
    },
    page: {
      ...healthBase.page,
      heroImage: "/funnels/findhealthschools/hero-960px.jpg",
      headerLogo: { src: "/funnels/findhealthschools/header-logo.png", width: 153, height: 30 },
      quotes: HEALTH_QUOTES_2020,
    },
  },
  "findhealthcareschools.com": {
    ...healthBase,
    name: "Find Health Care Schools",
    meta: {
      title: "Join the Thriving Healthcare Industry—Find Health Care Schools | Find Health Care Schools",
      description: "Find Health Care Schools",
    },
    page: {
      ...healthBase.page,
      heroImage: "/funnels/findhealthcareschools/hero-960px.jpg",
      headerLogo: { src: "/funnels/findhealthcareschools/header-logo.png", width: 179, height: 30 },
      quotes: HEALTH_QUOTES_2020,
    },
  },
  "healthschoolsearch.com": {
    ...healthBase,
    name: "Health School Search",
    meta: {
      title: "Join the Thriving Healthcare Industry—Find Health Care Schools | Health School Search",
      description: "Health School Search",
    },
    page: {
      ...healthBase.page,
      heroImage: "/funnels/healthschoolsearch/hero-960px.jpg",
      headerLogo: { src: "/funnels/healthschoolsearch/header-logo.png", width: 170, height: 30 },
      quotes: HEALTH_QUOTES_2020,
    },
  },
  "myhealthschoolsearch.com": {
    ...healthBase,
    name: "My Health School Search",
    meta: {
      title: "Join the Thriving Healthcare Industry—Find Healthcare Schools | My Health School Search",
      description: "My Health School Search",
    },
    page: {
      ...healthBase.page,
      heroImage: "/funnels/myhealthschoolsearch/hero-960px.jpg",
      headerLogo: { src: "/funnels/myhealthschoolsearch/header-logo.png", width: 183, height: 30 },
      quotes: HEALTH_QUOTES_2026,
    },
  },
  "nursingschooldegrees.com": {
    type: "funnel",
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
    type: "funnel",
    name: "Police Academy Search",
    meta: {
      title: "Find Police Academy and Law Enforcement Training - Prepare to Serve & Protect Your Community",
      description: "Prepare to Serve & Protect Your Community",
    },
    colors: { primary: "#0066cc" },
    marketContext: "acjssem",
    prefilterQuestions: ["postalCode", "hsGraduation", "education"],
    page: {
      title: "Pursue an Education in Law Enforcement & Criminal Justice",
      description: "Find the info you need to start your degree in law enforcement, corrections, or criminal justice.",
      heroImage: "/funnels/police-academy-search/hero-960px.jpg",
      headerLogo: { src: "/funnels/police-academy-search/header-logo.png", width: 173, height: 30 },
      quotes: [{ badge: "/funnels/police-academy-search/badge-logo.jpg", html: POLICE_ACADEMY_QUOTE_HTML }],
      bodyContent: POLICE_ACADEMY_BODY,
    },
  },
  "allcollegesearch.com": allCollegeSearchConfig,
  "all-college-search.com": allCollegeSearchConfig,
  "allgraduateschools.com": allGraduateSchoolsConfig,
};

function getRootDomain(host: string): string {
  const hostWithoutPort = host.split(":")[0];
  const parts = hostWithoutPort.split(".");
  return parts.length > 2 ? parts.slice(-2).join(".") : hostWithoutPort;
}

export function getPrefilterQuestions(config: SiteConfig, marketContext?: string): string[] {
  if (config.type === "hub" && marketContext?.includes("nursing")) {
    return ["subjectArea", "education", "nursingLicense"];
  }
  return config.prefilterQuestions;
}

export async function getSiteConfig(): Promise<SiteConfig> {
  if (process.env.SITE_KEY && siteConfigs[process.env.SITE_KEY]) {
    return siteConfigs[process.env.SITE_KEY];
  }
  const host = (await headers()).get("host") ?? "";
  const rootDomain = getRootDomain(host);
  return siteConfigs[rootDomain] ?? defaultConfig;
}
