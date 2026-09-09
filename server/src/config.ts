export interface ModeConfig {
  name: string;
  defaultCount: number;
  maxCount: number;
  timeLimit?: number; // in minutes, undefined means no time limit
  description: string;
}

export const modeConfigs: Record<string, ModeConfig> = {
  practice: {
    name: "Practice Session",
    defaultCount: 316,
    maxCount: 316,
    description: "Full practice session with all available questions",
  },
  exam: {
    name: "Mock Exam",
    defaultCount: 100,
    maxCount: 100,
    timeLimit: 120, // 120 minutes
    description: "Timed mock exam with 100 questions (120 minutes)",
  },
};

export function getModeConfig(mode: string): ModeConfig {
  return modeConfigs[mode] || modeConfigs.practice;
}
