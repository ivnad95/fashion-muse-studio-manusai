import { create } from 'zustand';

export interface GenerationResult {
  id: string;
  imageUri: string;
  createdAt: string;
}

interface GenerationState {
  selectedCount: number;
  selectedImage: string | null;
  isGenerating: boolean;
  generationProgress: number;
  results: GenerationResult[];
  error: string | null;
  
  // Actions
  setSelectedCount: (count: number) => void;
  setSelectedImage: (uri: string | null) => void;
  setGenerating: (generating: boolean) => void;
  setProgress: (progress: number) => void;
  setResults: (results: GenerationResult[]) => void;
  addResult: (result: GenerationResult) => void;
  clearResults: () => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  selectedCount: 1,
  selectedImage: null,
  isGenerating: false,
  generationProgress: 0,
  results: [],
  error: null,

  setSelectedCount: (count) => set({ selectedCount: count }),
  setSelectedImage: (uri) => set({ selectedImage: uri }),
  setGenerating: (generating) => set({ isGenerating: generating }),
  setProgress: (progress) => set({ generationProgress: progress }),
  setResults: (results) => set({ results }),
  addResult: (result) => set((state) => ({ results: [...state.results, result] })),
  clearResults: () => set({ results: [] }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
  reset: () => set({
    selectedCount: 1,
    selectedImage: null,
    isGenerating: false,
    generationProgress: 0,
    results: [],
    error: null,
  }),
}));

