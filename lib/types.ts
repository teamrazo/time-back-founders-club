// RazoRSharp Networks — 3-Stage Onboarding System Types

export type BudgetTier = 'tier1' | 'tier1-2' | 'tier1-2-3';

export type StageStatus = 'not-started' | 'in-progress' | 'complete';

export type PlatformStatus = 'granted' | 'need-help' | 'na' | '';

export interface PillarRating {
  importance: number;
  satisfaction: number;
}

export interface EntryData {
  fullName: string;
  companyName: string;
  mobilePhone: string;
  bestEmail: string;
  cityState: string;
  industry: string;
  industryOther: string;
  specialtyNiche: string;
  revenueModel: string[];
  yearsInBusiness: string;
  isExistingClient: string;
  businessType: string;
  teamToolsInterest: string;
  monthlyBudget: string;
}

export interface Stage1Data {
  // 1A: Business Identity
  businessHours: string;
  preferredContact: string[];
  preferredMarketingHours: string;
  notificationEmails: string;
  reportEmails: string;
  websiteUrl: string;
  teamSize: string;
  annualRevenue: string;
  techStack: string[];
  techStackOther: string;

  // 1B: Owner Goals
  biggestFrustration: string;
  visionFixed: string;
  pillars: {
    faith: PillarRating;
    family: PillarRating;
    health: PillarRating;
    wealth: PillarRating;
    businessFreedom: PillarRating;
  };
  goal90day: string;
  goal12month: string;
  revenueTarget: string;
  hoursCurrently: number;
  hoursWanted: number;

  // 1C: Operator → Engineer
  operatorAssessment: string;
  operatorChangeNeeded: string;
  freedomScores: {
    financialClarity: number;
    revenueSystems: number;
    executionEngine: number;
    energyOptimization: number;
    delegationPath: number;
    ownershipMindset: number;
    marginCreation: number;
  };

  // 1D: Brand & Voice
  brandWords: string;
  communicationTone: string[];
  neverSoundLike: string;
  contentPreference: string;
  briefFrequency: string;
  additionalNotes: string;
}

export interface Stage2Data {
  // 2A: Current State
  howCustomersFind: string[];
  followUpSpeed: string;
  marketingWorked: string;
  marketingDidntWork: string;

  // 2B: Target Market
  idealCustomer: string;
  customerAgeRange: string;
  geographicFocus: string;
  averageDealSize: string;
  monthlyLeadVolume: string;
  currentCloseRate: string;

  // 2C: Where You're Going
  perfectMarketingVision: string;
  monthlyRevenueTarget: string;
  customerJourneyBottleneck: string;
  activeReviewStrategy: string;
  socialMediaPresence: string[];

  // 2D: Experience & Readiness
  workedWithAgency: string;
  agencyExperience: string;
  readinessScore: number;
  biggestConcern: string;
}

export interface PlatformEntry {
  status: PlatformStatus;
  notes: string;
}

export interface Stage3Data {
  // Tier 1: Core
  domainHosting: PlatformEntry;
  websiteAdmin: PlatformEntry;
  googleMyBusiness: PlatformEntry;
  facebookPage: PlatformEntry;
  instagramPage: PlatformEntry;

  // Tier 2: Advertising
  googleAds: PlatformEntry;
  facebookAds: PlatformEntry;
  googleAnalytics: PlatformEntry;
  googleSearchConsole: PlatformEntry;
  googleTagManager: PlatformEntry;

  // Tier 3: Advanced
  youtubeChannel: PlatformEntry;
  linkedinAds: PlatformEntry;
  crmTools: PlatformEntry;
}

export interface OnboardingStatus {
  entryComplete: boolean;
  stage1: StageStatus;
  stage2: StageStatus;
  stage3: StageStatus;
  slackSetupComplete: boolean;
  lastUpdated: string;
}

// Default values

export const defaultPillar: PillarRating = { importance: 3, satisfaction: 3 };

export const defaultPlatformEntry: PlatformEntry = { status: '', notes: '' };

export const defaultEntryData: EntryData = {
  fullName: '',
  companyName: '',
  mobilePhone: '',
  bestEmail: '',
  cityState: '',
  industry: '',
  industryOther: '',
  specialtyNiche: '',
  revenueModel: [],
  yearsInBusiness: '',
  isExistingClient: '',
  businessType: '',
  teamToolsInterest: '',
  monthlyBudget: '',
};

export const defaultStage1Data: Stage1Data = {
  businessHours: '',
  preferredContact: [],
  preferredMarketingHours: '',
  notificationEmails: '',
  reportEmails: '',
  websiteUrl: '',
  teamSize: '',
  annualRevenue: '',
  techStack: [],
  techStackOther: '',
  biggestFrustration: '',
  visionFixed: '',
  pillars: {
    faith: { importance: 3, satisfaction: 3 },
    family: { importance: 3, satisfaction: 3 },
    health: { importance: 3, satisfaction: 3 },
    wealth: { importance: 3, satisfaction: 3 },
    businessFreedom: { importance: 3, satisfaction: 3 },
  },
  goal90day: '',
  goal12month: '',
  revenueTarget: '',
  hoursCurrently: 40,
  hoursWanted: 20,
  operatorAssessment: '',
  operatorChangeNeeded: '',
  freedomScores: {
    financialClarity: 5,
    revenueSystems: 5,
    executionEngine: 5,
    energyOptimization: 5,
    delegationPath: 5,
    ownershipMindset: 5,
    marginCreation: 5,
  },
  brandWords: '',
  communicationTone: [],
  neverSoundLike: '',
  contentPreference: '',
  briefFrequency: '',
  additionalNotes: '',
};

export const defaultStage2Data: Stage2Data = {
  howCustomersFind: [],
  followUpSpeed: '',
  marketingWorked: '',
  marketingDidntWork: '',
  idealCustomer: '',
  customerAgeRange: '',
  geographicFocus: '',
  averageDealSize: '',
  monthlyLeadVolume: '',
  currentCloseRate: '',
  perfectMarketingVision: '',
  monthlyRevenueTarget: '',
  customerJourneyBottleneck: '',
  activeReviewStrategy: '',
  socialMediaPresence: [],
  workedWithAgency: '',
  agencyExperience: '',
  readinessScore: 7,
  biggestConcern: '',
};

export const defaultStage3Data: Stage3Data = {
  domainHosting: { status: '', notes: '' },
  websiteAdmin: { status: '', notes: '' },
  googleMyBusiness: { status: '', notes: '' },
  facebookPage: { status: '', notes: '' },
  instagramPage: { status: '', notes: '' },
  googleAds: { status: '', notes: '' },
  facebookAds: { status: '', notes: '' },
  googleAnalytics: { status: '', notes: '' },
  googleSearchConsole: { status: '', notes: '' },
  googleTagManager: { status: '', notes: '' },
  youtubeChannel: { status: '', notes: '' },
  linkedinAds: { status: '', notes: '' },
  crmTools: { status: '', notes: '' },
};

export const defaultOnboardingStatus: OnboardingStatus = {
  entryComplete: false,
  stage1: 'not-started',
  stage2: 'not-started',
  stage3: 'not-started',
  slackSetupComplete: false,
  lastUpdated: new Date().toISOString(),
};

// Budget tier logic
export function getBudgetTier(monthlyBudget: string): BudgetTier {
  const tier3Budgets = ['$5K-$10K', '$10K-$25K', '$25K+'];
  const tier2Budgets = ['$500-$2K', '$2K-$5K'];
  if (tier3Budgets.includes(monthlyBudget)) return 'tier1-2-3';
  if (tier2Budgets.includes(monthlyBudget)) return 'tier1-2';
  return 'tier1';
}

// Industry options
export const INDUSTRY_OPTIONS = [
  'Automotive',
  'Construction & Contracting',
  'Dental & Orthodontics',
  'E-Commerce',
  'Financial Services',
  'Health & Wellness',
  'Home Services',
  'Hospitality & Events',
  'Insurance',
  'Law & Legal Services',
  'Medical & Healthcare',
  'Real Estate',
  'Restaurant & Food Service',
  'Retail',
  'Technology & Software',
  'Other',
];

export const YEARS_OPTIONS = ['<1 year', '1-3 years', '3-5 years', '5-10 years', '10-20 years', '20+ years'];

export const REVENUE_MODEL_OPTIONS = ['Product', 'Service', 'E-commerce', 'Content', 'Donations'];

export const BUDGET_OPTIONS = [
  'Not spending yet',
  'Under $500',
  '$500-$2K',
  '$2K-$5K',
  '$5K-$10K',
  '$10K-$25K',
  '$25K+',
];

export const TEAM_SIZE_OPTIONS = ['Solo', '2-5', '6-15', '16-50', '50+'];

export const ANNUAL_REVENUE_OPTIONS = [
  'Pre-revenue',
  'Under $100K',
  '$100K-$250K',
  '$250K-$500K',
  '$500K-$1M',
  '$1M-$2.5M',
  '$2.5M-$5M',
  '$5M+',
];

export const TECH_STACK_OPTIONS = [
  'GoHighLevel (GHL)',
  'HubSpot',
  'Salesforce',
  'WordPress',
  'Shopify',
  'Wix',
  'Squarespace',
  'Google Workspace',
  'Microsoft 365',
  'Slack',
  'QuickBooks',
  'Stripe',
  'Other',
];

export const REVENUE_TARGET_OPTIONS = [
  'Under $100K',
  '$100K-$250K',
  '$250K-$500K',
  '$500K-$1M',
  '$1M-$2.5M',
  '$2.5M-$5M',
  '$5M+',
];
