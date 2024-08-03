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

// Cache helper functions
function getCachedResponse(key) {
    const cachedData = localStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
}

function setCachedResponse(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

async function callOpenAI(instruction, content, emailId, cacheKey) {
    const cacheFullKey = `${emailId}_${cacheKey}`;
    const cachedResponse = getCachedResponse(cacheFullKey);
    
    if (cachedResponse) {
        console.log(`Using cached response for ${cacheFullKey}`);
        return cachedResponse;
    }

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
        const apiResponse = result.choices[0].message.content;
        
        setCachedResponse(cacheFullKey, apiResponse);
        return apiResponse;
    });
}

export async function generateSummary(emailBody, emailId) {
    return await callOpenAI('Summarize the following email:', emailBody, emailId, 'summary');
}

export async function extractStructuredData(emailBody, emailId) {
    const jsonString = await callOpenAI('Extract key information from this email as YAML. Do not share anything other than the YAML in the reply.', emailBody, emailId, 'structured_data');
    return jsonString;
}

export async function generateReply(emailBody, emailId) {
    return await callOpenAI('Generate a potential reply to this email:', emailBody, emailId, 'reply');
}

export async function generateInboxSummary(emailSummaries) {
    // Note: Inbox summary is not cached as it's based on multiple emails
    return await callOpenAI('Summarize the state of this inbox based on these recent emails:', emailSummaries, 'inbox', 'inbox_summary');
}