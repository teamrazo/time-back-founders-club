export interface PillarRating {
  importance: number;
  satisfaction: number;
  notes: string;
}

export interface FreedomScore {
  score: number;
  notes: string;
}

export interface FormData {
  // Section 1: Company Snapshot
  companyName: string;
  industry: string;
  websiteUrl: string;
  locations: string;
  yearFounded: string;
  teamSize: string;
  annualRevenue: string;
  techStack: string[];
  techStackOther: string;

  // Section 2: Owner Profile
  fullName: string;
  roleTitle: string;
  email: string;
  phone: string;
  preferredContact: string[];
  timezone: string;
  hoursCurrently: string;
  hoursWanted: string;
  idealWorkday: string;

  // Section 3: Five Pillars
  pillars: {
    faith: PillarRating;
    family: PillarRating;
    health: PillarRating;
    wealth: PillarRating;
    businessFreedom: PillarRating;
  };

  // Section 4: Business Goals
  goals90day: string[];
  goals12month: string[];
  vision3year: string;
  revenueTarget: string;
  netMarginTarget: string;
  teamGoal: string;
  lifestyleGoal: string;

  // Section 5: Pain Points
  topStuck: string[];
  timeLeaks: string[];
  timeLeakOther: string;
  reactivePercent: string;
  proactivePercent: string;
  eliminateTask: string;

  // Section 6: Customer Lifecycle
  leadSources: string[];
  leadSourceOther: string;
  biggestBottleneck: string;
  biggestBottleneckOther: string;
  followUpSpeed: string;
  reviewStrategy: string;

  // Section 7: Operator → Engineer Score
  operatorLevel: string;
  operatorNextStep: string;

  // Section 8: Brand & Communication
  brandWords: string[];
  customerDescription: string;
  commTone: string[];
  commToneOther: string;
  neverSoundLike: string;
  contentPrefs: string[];
  updateFrequency: string;

  // Section 9: FREEDOM Scorecard
  freedom: {
    financial: FreedomScore;
    revenue: FreedomScore;
    execution: FreedomScore;
    energy: FreedomScore;
    delegation: FreedomScore;
    ownership: FreedomScore;
    margin: FreedomScore;
  };

  // Section 10: Quick Wins
  wishHandled: string;
  oneSystem: string;
  unusedTools: string;
  anythingElse: string;
}

export const defaultFormData: FormData = {
  companyName: "",
  industry: "",
  websiteUrl: "",
  locations: "",
  yearFounded: "",
  teamSize: "",
  annualRevenue: "",
  techStack: [],
  techStackOther: "",

  fullName: "",
  roleTitle: "",
  email: "",
  phone: "",
  preferredContact: [],
  timezone: "",
  hoursCurrently: "",
  hoursWanted: "",
  idealWorkday: "",

  pillars: {
    faith: { importance: 3, satisfaction: 3, notes: "" },
    family: { importance: 3, satisfaction: 3, notes: "" },
    health: { importance: 3, satisfaction: 3, notes: "" },
    wealth: { importance: 3, satisfaction: 3, notes: "" },
    businessFreedom: { importance: 3, satisfaction: 3, notes: "" },
  },

  goals90day: ["", "", ""],
  goals12month: ["", "", ""],
  vision3year: "",
  revenueTarget: "",
  netMarginTarget: "",
  teamGoal: "",
  lifestyleGoal: "",

  topStuck: ["", "", ""],
  timeLeaks: [],
  timeLeakOther: "",
  reactivePercent: "",
  proactivePercent: "",
  eliminateTask: "",

  leadSources: [],
  leadSourceOther: "",
  biggestBottleneck: "",
  biggestBottleneckOther: "",
  followUpSpeed: "",
  reviewStrategy: "",

  operatorLevel: "",
  operatorNextStep: "",

  brandWords: ["", "", ""],
  customerDescription: "",
  commTone: [],
  commToneOther: "",
  neverSoundLike: "",
  contentPrefs: [],
  updateFrequency: "",

  freedom: {
    financial: { score: 5, notes: "" },
    revenue: { score: 5, notes: "" },
    execution: { score: 5, notes: "" },
    energy: { score: 5, notes: "" },
    delegation: { score: 5, notes: "" },
    ownership: { score: 5, notes: "" },
    margin: { score: 5, notes: "" },
  },

  wishHandled: "",
  oneSystem: "",
  unusedTools: "",
  anythingElse: "",
};
