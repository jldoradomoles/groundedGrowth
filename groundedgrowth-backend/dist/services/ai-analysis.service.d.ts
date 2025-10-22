export type AIProvider = 'gemini' | 'openai' | 'auto';
export declare class AIAnalysisService {
    private geminiService;
    private openaiService;
    private preferredProvider;
    constructor(preferredProvider?: AIProvider);
    analyzeJournalEntry(entry: string, goals: string[], provider?: AIProvider): Promise<{
        analysis: string;
        aiProvider: string;
    }>;
    private tryWithFallback;
    private getLocalFallbackAnalysis;
    setPreferredProvider(provider: AIProvider): void;
    getPreferredProvider(): AIProvider;
}
//# sourceMappingURL=ai-analysis.service.d.ts.map