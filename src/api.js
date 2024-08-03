// OpenAI API Key (Note: In a production environment, you'd want to handle this more securely)
const OPENAI_API_KEY = '98a9f3a23cf7b83243500ead07874aca741dcb34c4031abd3129794411f594a7';

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

async function callOpenAI(instruction, content) {
    return apiQueue.enqueue(async () => {
        const response = await fetch('https://api.together.xyz/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant that analyzes emails.' },
                    { role: 'user', content: `${instruction}\n\n${content}` }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }

        const result = await response.json();
        return result.choices[0].message.content;
    });
}

export async function generateSummary(emailBody) {
    return await callOpenAI('Summarize the following email:', emailBody);
}

export async function extractStructuredData(emailBody) {
    const jsonString = await callOpenAI('Extract key information from this email as JSON. Do not share anything other than the JSON in the reply.', emailBody);
    return JSON.parse(jsonString);
}

export async function generateReply(emailBody) {
    return await callOpenAI('Generate a potential reply to this email:', emailBody);
}

export async function generateInboxSummary(emailSummaries) {
    return await callOpenAI('Summarize the state of this inbox based on these recent emails:', emailSummaries);
}