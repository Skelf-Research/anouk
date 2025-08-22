"use strict";

import $ from 'jquery';
import { generateSummary, extractStructuredData, generateReply, generateInboxSummary, AIService } from './api.js';
import { defaultConfig } from './aiConfig.js';
import { createSettingsPanel, toggleSettingsPanel } from './settingsPanel.js';

// Initialize AI service with configuration
// In a production extension, this should be loaded from storage or environment
const aiService = new AIService(defaultConfig);

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

        // Inject sidebar and floating button
        injectSidebarAndButton();

        // Create settings panel
        const settingsPanel = createSettingsPanel(aiService);

        // Add event listener for settings button
        $('#gmail-assistant-settings').on('click', function() {
            toggleSettingsPanel(settingsPanel);
        });

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

function injectSidebarAndButton() {
    // Inject floating buttons
    $('body').append(`
        <button id="gmail-assistant-toggle" class="gmail-assistant-toggle">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4"></path>
                <path d="M12 8h.01"></path>
            </svg>
        </button>
        <button id="gmail-assistant-settings" class="gmail-assistant-settings">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6"></path>
                <path d="M3 12h6m6 0h6"></path>
            </svg>
        </button>
    `);

    // Inject sidebar with tabs
    $('body').append(`
        <div id="gmail-assistant-sidebar" class="gmail-assistant-sidebar">
            <h2>Gmail Assistant</h2>
            <div class="tabs">
                <button class="tab-button active" data-tab="inbox">Inbox</button>
                <button class="tab-button" data-tab="email">Email</button>
                <button class="tab-button" data-tab="actions">Actions</button>
            </div>
            <div id="inbox-tab" class="tab-content active">
                <div id="inbox-summary">
                    <h3>Inbox Summary</h3>
                    <p>Loading...</p>
                </div>
            </div>
            <div id="email-tab" class="tab-content">
                <div id="email-summary">
                    <h3>Email Summary</h3>
                    <p>Loading...</p>
                </div>
                <div id="potential-reply">
                    <h3>Potential Reply</h3>
                    <p>Loading...</p>
                </div>
            </div>
            <div id="actions-tab" class="tab-content">
                <div id="structured-data">
                    <h3>Structured Data</h3>
                    <p>Loading...</p>
                </div>
                <div id="auto-reply-status">
                    <h3>Automatic Reply Status</h3>
                    <p>No automatic reply sent</p>
                </div>
                <button id="send-auto-reply">
                    Send Automatic Reply
                </button>
            </div>
        </div>
    `);

    // Add event listener for auto-reply button
    $('#send-auto-reply').on('click', handleAutoReply);

    // Add event listener for toggle button
    $('#gmail-assistant-toggle').on('click', toggleSidebar);
    
    // Add event listener for settings button
    $('#gmail-assistant-settings').on('click', function() {
        // We'll implement this after creating the settings panel
    });

    // Add event listeners for tab buttons
    $('.tab-button').on('click', function() {
        $('.tab-button').removeClass('active');
        $(this).addClass('active');
        $('.tab-content').removeClass('active');
        $(`#${$(this).data('tab')}-tab`).addClass('active');
    });

    // Inject CSS
    $('head').append(`
        <style>
            .gmail-assistant-toggle {
                position: fixed;
                right: 20px;
                bottom: 20px;
                width: 50px;
                height: 50px;
                border-radius: 25px;
                background-color: #4285f4;
                color: white;
                border: none;
                cursor: pointer;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .gmail-assistant-toggle:hover {
                background-color: #3367d6;
            }
            .gmail-assistant-settings {
                position: fixed;
                right: 20px;
                bottom: 80px;
                width: 50px;
                height: 50px;
                border-radius: 25px;
                background-color: #34a853;
                color: white;
                border: none;
                cursor: pointer;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            .gmail-assistant-settings:hover {
                background-color: #2d9247;
            }
            .gmail-assistant-sidebar {
                position: fixed;
                right: -300px;
                top: 0;
                width: 300px;
                height: 100%;
                background: white;
                border-left: 1px solid #ccc;
                padding: 20px;
                overflow-y: auto;
                z-index: 1100;
                transition: right 0.3s ease-in-out;
            }
            .gmail-assistant-sidebar.open {
                right: 0;
            }
            .gmail-assistant-sidebar h2 {
                margin-top: 0;
            }
            .gmail-assistant-sidebar h3 {
                margin-top: 20px;
            }
            .gmail-assistant-sidebar pre {
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
            .tabs {
                display: flex;
                justify-content: space-between;
                margin-bottom: 20px;
            }
            .tab-button {
                flex-grow: 1;
                background-color: #f1f3f4;
                color: #5f6368;
                border: none;
                padding: 10px;
                cursor: pointer;
            }
            .tab-button.active {
                background-color: #4285f4;
                color: white;
            }
            .tab-content {
                display: none;
            }
            .tab-content.active {
                display: block;
            }
        </style>
    `);
}

function toggleSidebar() {
    $('#gmail-assistant-sidebar').toggleClass('open');
}

async function analyzeEmail(emailData) {
    try {
        console.log("Email analysis");
        console.log(emailData.content_html);

        const summary = await generateSummary(emailData.content_html, emailData.id);
        $('#email-summary').html(`
            <h3>Email Summary</h3>
            <p>${summary}</p>
        `);

        const structuredData = await extractStructuredData(emailData.content_html, emailData.id);
        $('#structured-data').html(`
            <h3>Structured Data</h3>
            <pre>${JSON.stringify(structuredData, null, 2)}</pre>
        `);

        const reply = await generateReply(emailData.content_html, emailData.id);
        $('#potential-reply').html(`
            <h3>Potential Reply</h3>
            <p>${reply}</p>
        `);

        await updateInboxSummary();
    } catch (error) {
        console.error('Error analyzing email:', error);
    }
}

async function updateInboxSummary() {
    try {
        const inboxSummary = await getInboxSummary();
        $('#inbox-summary').html(`
            <h3>Inbox Summary</h3>
            <p>${inboxSummary}</p>
        `);
    } catch (error) {
        console.error('Error updating inbox summary:', error);
        $('#inbox-summary').html(`
            <h3>Inbox Summary</h3>
            <p>Unable to generate inbox summary</p>
        `);
    }
}

async function getInboxSummary() {
    const emails = await getRecentEmails(10);
    const emailSummaries = emails.map(email => `Subject: ${email.subject}\nFrom: ${email.from}\nSnippet: ${email.snippet}`).join('\n\n');
    return await generateInboxSummary(emailSummaries);
}

async function handleAutoReply() {
    const emailData = window.gmail.new.get.email_data();
    const matchedRule = matchesAutoReplyRule(emailData);
    if (matchedRule) {
        await sendAutomaticReply(emailData, matchedRule);
        $('#auto-reply-status').html('<p>Automatic reply sent</p>');
    } else {
        $('#auto-reply-status').html('<p>No matching rule for automatic reply</p>');
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