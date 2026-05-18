import { create } from 'zustand';

export interface ConfiguratorState {
  // Navigation / Quiz steps
  currentStep: string;
  answers: Record<string, any>;
  
  // Dynamic Configurator states
  segment: 'b2b' | 'academic';
  configuratorMode: 'slider' | 'features';
  activeComponentIds: string[];
  volumes: Record<string, number>; // e.g., { extra_page: 5, pitch_deck_slide: 15 }
  targetBudget: number; // For budget-first slider flow

  // Actions
  setStep: (stepId: string) => void;
  submitAnswer: (stepId: string, answer: any) => void;
  setSegment: (segment: 'b2b' | 'academic') => void;
  setConfiguratorMode: (mode: 'slider' | 'features') => void;
  toggleComponent: (id: string) => void;
  setVolume: (id: string, value: number) => void;
  setTargetBudget: (budget: number) => void;
  resetConfigurator: () => void;
}

export const useConfigurator = create<ConfiguratorState>((set) => ({
  currentStep: 'step_1',
  answers: {},
  segment: 'b2b',
  configuratorMode: 'features',
  activeComponentIds: [],
  volumes: {},
  targetBudget: 15000000, // Default budget marker Rp 15jt

  setStep: (stepId) => set({ currentStep: stepId }),
  
  submitAnswer: (stepId, answer) => set((state) => ({
    answers: { ...state.answers, [stepId]: answer }
  })),

  setSegment: (segment) => set({ segment }),
  
  setConfiguratorMode: (mode) => set({ configuratorMode: mode }),
  
  toggleComponent: (id) => set((state) => ({
    activeComponentIds: state.activeComponentIds.includes(id)
      ? state.activeComponentIds.filter((item) => item !== id)
      : [...state.activeComponentIds, id]
  })),

  setVolume: (id, value) => set((state) => ({
    volumes: { ...state.volumes, [id]: value }
  })),

  setTargetBudget: (budget) => set({ targetBudget: budget }),

  resetConfigurator: () => set({
    currentStep: 'step_1',
    answers: {},
    segment: 'b2b',
    configuratorMode: 'features',
    activeComponentIds: [],
    volumes: {},
    targetBudget: 15000000
  })
}));
