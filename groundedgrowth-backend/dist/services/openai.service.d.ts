export declare class OpenAIService {
    private openai;
    constructor();
    analyzeJournalEntry(entry: string, goals: string[]): Promise<string>;
    private buildSystemPrompt;
    private buildUserPrompt;
    private formatResponse;
    private getSimulatedAnalysis;
}
//# sourceMappingURL=openai.service.d.ts.map