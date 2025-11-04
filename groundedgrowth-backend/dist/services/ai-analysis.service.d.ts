export type AIProvider = 'openai';
export declare class AIAnalysisService {
    private openaiService;
    private preferredProvider;
    constructor(preferredProvider?: AIProvider);
    analyzeJournalEntry(entry: string, goals: string[], provider?: AIProvider): Promise<{
        analysis: string;
        aiProvider: string;
    }>;
    private getLocalFallbackAnalysis;
    setPreferredProvider(provider: AIProvider): void;
    getPreferredProvider(): AIProvider;
}
//# sourceMappingURL=ai-analysis.service.d.ts.map