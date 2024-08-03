"use strict";

import { generateSummary, extractStructuredData, generateReply, generateInboxSummary } from './api.js';

// loader-code: wait until gmailjs has finished loading, before triggering actual extension-code.
const loaderId = setInterval(() => {
    if (!window._gmailjs) {
        return;
    }

    clearInterval(loaderId);
    startExtension(window._gmailjs);
}, 100);

// actual extension-code
function startExtension(gmail) {
    console.log("Extension loading...");
    window.gmail = gmail;

    gmail.observe.on("load", () => {
        const userEmail = gmail.get.user_email();
        console.log("Hello, " + userEmail + ". This is your Gmail Assistant!");

        // Inject sidebar
        injectSidebar();

        gmail.observe.on("view_email", (domEmail) => {
            console.log("Looking at email:", domEmail);
            const emailData = gmail.new.get.email_data(domEmail);
            console.log("Email data:", emailData);
            analyzeEmail(emailData);
        });

        gmail.observe.on("compose", (compose) => {
            console.log("New compose window is opened!", compose);
            // You can add compose-specific functionality here if needed
        });
    });
}

function injectSidebar() {
    const sidebar = document.createElement('div');
    sidebar.id = 'gmail-assistant-sidebar';
    sidebar.innerHTML = `
        <h2>Gmail Assistant</h2>
        <div id="email-summary">
            <h3>Email Summary</h3>
            <p>Loading...</p>
        </div>
        <div id="structured-data">
            <h3>Structured Data</h3>
            <p>Loading...</p>
        </div>
        <div id="potential-reply">
            <h3>Potential Reply</h3>
            <p>Loading...</p>
        </div>
        <div id="inbox-summary">
            <h3>Inbox Summary</h3>
            <p>Loading...</p>
        </div>
        <div id="auto-reply-status">
            <h3>Automatic Reply Status</h3>
            <p>No automatic reply sent</p>
        </div>
        <button id="send-auto-reply">
            Send Automatic Reply
        </button>
    `;
    document.body.appendChild(sidebar);

    // Add event listener for auto-reply button
    document.getElementById('send-auto-reply').addEventListener('click', handleAutoReply);

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        #gmail-assistant-sidebar {
            position: fixed;
            right: 0;
            top: 0;
            width: 300px;
            height: 100%;
            background: white;
            border-left: 1px solid #ccc;
            padding: 20px;
            overflow-y: auto;
            z-index: 1000;
        }
        #gmail-assistant-sidebar h2 {
            margin-top: 0;
        }
        #gmail-assistant-sidebar h3 {
            margin-top: 20px;
        }
        #gmail-assistant-sidebar pre {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .loading {
            color: #888;
            font-style: italic;
        }
        button {
            margin-top: 10px;
            padding: 5px 10px;
            background-color: #4285f4;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        button:hover {
            background-color: #3367d6;
        }
    `;
    document.head.appendChild(style);
}

async function analyzeEmail(emailData) {
    try {
        console.log("Email analysis");
        console.log(emailData.content_html);

        const summary = await generateSummary(emailData.content_html);
        document.getElementById('email-summary').innerHTML = `
            <h3>Email Summary</h3>
            <p>${summary}</p>
        `;

        const structuredData = await extractStructuredData(emailData.content_html);
        document.getElementById('structured-data').innerHTML = `
            <h3>Structured Data</h3>
            <pre>${JSON.stringify(structuredData, null, 2)}</pre>
        `;

        const reply = await generateReply(emailData.content_html);
        document.getElementById('potential-reply').innerHTML = `
            <h3>Potential Reply</h3>
            <p>${reply}</p>
        `;

        const inboxSummary = await getInboxSummary();
        document.getElementById('inbox-summary').innerHTML = `
            <h3>Inbox Summary</h3>
            <p>${inboxSummary}</p>
        `;
    } catch (error) {
        console.error('Error analyzing email:', error);
    }
}

async function getInboxSummary() {
    try {
        const emails = await getRecentEmails(10);
        const emailSummaries = emails.map(email => `Subject: ${email.subject}\nFrom: ${email.from}\nSnippet: ${email.snippet}`).join('\n\n');
        return await generateInboxSummary(emailSummaries);
    } catch (error) {
        console.error('Error generating inbox summary:', error);
        return 'Unable to generate inbox summary';
    }
}

async function handleAutoReply() {
    const emailData = window.gmail.new.get.email_data();
    const matchedRule = matchesAutoReplyRule(emailData);
    if (matchedRule) {
        await sendAutomaticReply(emailData, matchedRule);
        document.getElementById('auto-reply-status').innerHTML = '<p>Automatic reply sent</p>';
    } else {
        document.getElementById('auto-reply-status').innerHTML = '<p>No matching rule for automatic reply</p>';
    }
}

async function getRecentEmails(count) {
    return new Promise((resolve, reject) => {
        try {
            const emails = window.gmail.get.visible_emails_async(count)
                .then(emailIds => {
                    return Promise.all(emailIds.map(async (emailId) => {
                        const email = window.gmail.new.get.email_data(emailId);
                        return {
                            id: emailId,
                            subject: email.subject,
                            from: email.from.name || email.from.email,
                            snippet: email.snippet,
                            body: await new Promise(resolve => window.gmail.new.get.email_source_async(emailId, resolve))
                        };
                    }));
                });

            resolve(emails);
        } catch (error) {
            console.error('Error fetching recent emails:', error);
            reject(error);
        }
    });
}

// Define auto-reply rules
const autoReplyRules = [
    {
        condition: {
            from: ['newsletter@example.com', 'updates@example.com'],
            subject: ['Newsletter', 'Weekly Update'],
            body: ['unsubscribe']
        },
        action: 'unsubscribe'
    },
    {
        condition: {
            from: ['support@example.com'],
            subject: ['Order Confirmation'],
            body: ['Thank you for your order']
        },
        action: 'acknowledge'
    }
];

function matchesAutoReplyRule(email) {
    return autoReplyRules.find(rule => {
        return (
            (!rule.condition.from || rule.condition.from.some(sender => email.from.includes(sender))) &&
            (!rule.condition.subject || rule.condition.subject.some(subj => email.subject.includes(subj))) &&
            (!rule.condition.body || rule.condition.body.some(text => email.body.includes(text)))
        );
    });
}

async function sendAutomaticReply(email, rule) {
    let replyContent;
    
    switch(rule.action) {
        case 'unsubscribe':
            replyContent = await generateUnsubscribeReply(email);
            break;
        case 'acknowledge':
            replyContent = await generateAcknowledgementReply(email);
            break;
        default:
            console.error('Unknown auto-reply action:', rule.action);
            return;
    }

    // Use gmail.js to send the reply
    window.gmail.tools.add_to_gmail(replyContent);
    console.log('Automatic reply sent:', replyContent);
}

async function generateUnsubscribeReply(email) {
    const prompt = `Generate a polite email reply requesting to unsubscribe from the newsletter or mailing list. 
    The original email subject was: "${email.subject}"
    It was sent from: ${email.from}`;
    
    return await generateReply(prompt);
}

async function generateAcknowledgementReply(email) {
    const prompt = `Generate a brief email reply acknowledging receipt of an order confirmation. 
    The original email subject was: "${email.subject}"
    It was sent from: ${email.from}`;
    
    return await generateReply(prompt);
}