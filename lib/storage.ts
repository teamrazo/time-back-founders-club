// localStorage persistence for the 3-stage onboarding system

import {
  EntryData,
  Stage1Data,
  Stage2Data,
  Stage3Data,
  OnboardingStatus,
  defaultEntryData,
  defaultStage1Data,
  defaultStage2Data,
  defaultStage3Data,
  defaultOnboardingStatus,
} from './types';

const KEYS = {
  entry: 'rsn-onboarding-entry',
  stage1: 'rsn-onboarding-stage1',
  stage2: 'rsn-onboarding-stage2',
  stage3: 'rsn-onboarding-stage3',
  status: 'rsn-onboarding-status',
};

function safeGet<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    return { ...fallback, ...JSON.parse(stored) } as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

export const storage = {
  getEntry: () => safeGet<EntryData>(KEYS.entry, defaultEntryData),
  setEntry: (data: EntryData) => safeSet(KEYS.entry, data),

  getStage1: () => safeGet<Stage1Data>(KEYS.stage1, defaultStage1Data),
  setStage1: (data: Stage1Data) => safeSet(KEYS.stage1, data),

  getStage2: () => safeGet<Stage2Data>(KEYS.stage2, defaultStage2Data),
  setStage2: (data: Stage2Data) => safeSet(KEYS.stage2, data),

  getStage3: () => safeGet<Stage3Data>(KEYS.stage3, defaultStage3Data),
  setStage3: (data: Stage3Data) => safeSet(KEYS.stage3, data),

  getStatus: () => safeGet<OnboardingStatus>(KEYS.status, defaultOnboardingStatus),
  setStatus: (data: OnboardingStatus) => safeSet(KEYS.status, data),

  clearAll: () => {
    try {
      Object.values(KEYS).forEach(k => localStorage.removeItem(k));
    } catch {}
  },
};
