import AIService from './aiService.js';
import configManager from './configManager.js';

// Initialize AI service with current configuration
// This allows using any OpenAI-compatible provider with configurable URLs, models, and keys
const aiService = new AIService();

// Queue for API calls
class APIQueue {
    constructor() {
        this.queue = [];
        this.isProcessing = false;
    }

    enqueue(task) {
        return new Promise((resolve, reject) => {
            this.queue.push({
                task,
                resolve,
                reject,
            });
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.isProcessing) return;
        this.isProcessing = true;

        while (this.queue.length > 0) {
            const { task, resolve, reject } = this.queue.shift();
            try {
                const result = await task();
                resolve(result);
            } catch (error) {
                reject(error);
            }
            // Add a delay between API calls (e.g., 1 second)
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        this.isProcessing = false;
    }
}

const apiQueue = new APIQueue();

async function callAI(instruction, content, emailId, cacheKey) {
    return apiQueue.enqueue(async () => {
        return await aiService.call(instruction, content, emailId, cacheKey);
    });
}

export async function generateSummary(emailBody, emailId) {
    return await callAI('Summarize the following email:', emailBody, emailId, 'summary');
}

export async function extractStructuredData(emailBody, emailId) {
    const jsonString = await callAI('Extract key information from this email as YAML. Do not share anything other than the YAML in the reply.', emailBody, emailId, 'structured_data');
    return jsonString;
}

export async function generateReply(emailBody, emailId) {
    return await callAI('Generate a potential reply to this email:', emailBody, emailId, 'reply');
}

export async function generateInboxSummary(emailSummaries) {
    // Note: Inbox summary is not cached as it's based on multiple emails
    return await callAI('Summarize the state of this inbox based on these recent emails:', emailSummaries, 'inbox', 'inbox_summary');
}

// Export the AIService instance and class for external configuration
export { aiService, AIService };
