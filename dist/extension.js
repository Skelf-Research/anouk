"use strict";
(() => {
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // src/api.js
  var OPENAI_API_KEY = "98a9f3a23cf7b83243500ead07874aca741dcb34c4031abd3129794411f594a7";
  var APIQueue = class {
    constructor() {
      this.queue = [];
      this.isProcessing = false;
    }
    enqueue(task) {
      return new Promise((resolve, reject) => {
        this.queue.push({
          task,
          resolve,
          reject
        });
        this.processQueue();
      });
    }
    processQueue() {
      return __async(this, null, function* () {
        if (this.isProcessing) return;
        this.isProcessing = true;
        while (this.queue.length > 0) {
          const { task, resolve, reject } = this.queue.shift();
          try {
            const result = yield task();
            resolve(result);
          } catch (error) {
            reject(error);
          }
          yield new Promise((resolve2) => setTimeout(resolve2, 1e3));
        }
        this.isProcessing = false;
      });
    }
  };
  var apiQueue = new APIQueue();
  function callOpenAI(instruction, content) {
    return __async(this, null, function* () {
      return apiQueue.enqueue(() => __async(this, null, function* () {
        const response = yield fetch("https://api.together.xyz/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
            messages: [
              { role: "system", content: "You are a helpful assistant that analyzes emails." },
              { role: "user", content: `${instruction}

${content}` }
            ]
          })
        });
        if (!response.ok) {
          throw new Error(`API call failed: ${response.statusText}`);
        }
        const result = yield response.json();
        return result.choices[0].message.content;
      }));
    });
  }
  function generateSummary(emailBody) {
    return __async(this, null, function* () {
      return yield callOpenAI("Summarize the following email:", emailBody);
    });
  }
  function extractStructuredData(emailBody) {
    return __async(this, null, function* () {
      const jsonString = yield callOpenAI("Extract key information from this email as JSON:", emailBody);
      return JSON.parse(jsonString);
    });
  }
  function generateReply(emailBody) {
    return __async(this, null, function* () {
      return yield callOpenAI("Generate a potential reply to this email:", emailBody);
    });
  }
  function generateInboxSummary(emailSummaries) {
    return __async(this, null, function* () {
      return yield callOpenAI("Summarize the state of this inbox based on these recent emails:", emailSummaries);
    });
  }

  // src/extension.js
  var loaderId = setInterval(() => {
    if (!window._gmailjs) {
      return;
    }
    clearInterval(loaderId);
    startExtension(window._gmailjs);
  }, 100);
  function startExtension(gmail) {
    console.log("Extension loading...");
    window.gmail = gmail;
    gmail.observe.on("load", () => {
      const userEmail = gmail.get.user_email();
      console.log("Hello, " + userEmail + ". This is your Gmail Assistant!");
      injectSidebar();
      gmail.observe.on("view_email", (domEmail) => {
        console.log("Looking at email:", domEmail);
        const emailData = gmail.new.get.email_data(domEmail);
        console.log("Email data:", emailData);
        analyzeEmail(emailData);
      });
      gmail.observe.on("compose", (compose) => {
        console.log("New compose window is opened!", compose);
      });
    });
  }
  function injectSidebar() {
    const sidebar = document.createElement("div");
    sidebar.id = "gmail-assistant-sidebar";
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
    document.getElementById("send-auto-reply").addEventListener("click", handleAutoReply);
    const style = document.createElement("style");
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
  function analyzeEmail(emailData) {
    return __async(this, null, function* () {
      try {
        console.log("Email analysis");
        console.log(emailData.content_html);
        const summary = yield generateSummary(emailData.content_html);
        document.getElementById("email-summary").innerHTML = `
            <h3>Email Summary</h3>
            <p>${summary}</p>
        `;
        const structuredData = yield extractStructuredData(emailData.content_html);
        document.getElementById("structured-data").innerHTML = `
            <h3>Structured Data</h3>
            <pre>${JSON.stringify(structuredData, null, 2)}</pre>
        `;
        const reply = yield generateReply(emailData.content_html);
        document.getElementById("potential-reply").innerHTML = `
            <h3>Potential Reply</h3>
            <p>${reply}</p>
        `;
        const inboxSummary = yield getInboxSummary();
        document.getElementById("inbox-summary").innerHTML = `
            <h3>Inbox Summary</h3>
            <p>${inboxSummary}</p>
        `;
      } catch (error) {
        console.error("Error analyzing email:", error);
      }
    });
  }
  function getInboxSummary() {
    return __async(this, null, function* () {
      try {
        const emails = yield getRecentEmails(10);
        const emailSummaries = emails.map((email) => `Subject: ${email.subject}
From: ${email.from}
Snippet: ${email.snippet}`).join("\n\n");
        return yield generateInboxSummary(emailSummaries);
      } catch (error) {
        console.error("Error generating inbox summary:", error);
        return "Unable to generate inbox summary";
      }
    });
  }
  function handleAutoReply() {
    return __async(this, null, function* () {
      const emailData = window.gmail.new.get.email_data();
      const matchedRule = matchesAutoReplyRule(emailData);
      if (matchedRule) {
        yield sendAutomaticReply(emailData, matchedRule);
        document.getElementById("auto-reply-status").innerHTML = "<p>Automatic reply sent</p>";
      } else {
        document.getElementById("auto-reply-status").innerHTML = "<p>No matching rule for automatic reply</p>";
      }
    });
  }
  function getRecentEmails(count) {
    return __async(this, null, function* () {
      return new Promise((resolve, reject) => {
        try {
          const emails = window.gmail.get.visible_emails_async(count).then((emailIds) => {
            return Promise.all(emailIds.map((emailId) => __async(this, null, function* () {
              const email = window.gmail.new.get.email_data(emailId);
              return {
                id: emailId,
                subject: email.subject,
                from: email.from.name || email.from.email,
                snippet: email.snippet,
                body: yield new Promise((resolve2) => window.gmail.new.get.email_source_async(emailId, resolve2))
              };
            })));
          });
          resolve(emails);
        } catch (error) {
          console.error("Error fetching recent emails:", error);
          reject(error);
        }
      });
    });
  }
  var autoReplyRules = [
    {
      condition: {
        from: ["newsletter@example.com", "updates@example.com"],
        subject: ["Newsletter", "Weekly Update"],
        body: ["unsubscribe"]
      },
      action: "unsubscribe"
    },
    {
      condition: {
        from: ["support@example.com"],
        subject: ["Order Confirmation"],
        body: ["Thank you for your order"]
      },
      action: "acknowledge"
    }
  ];
  function matchesAutoReplyRule(email) {
    return autoReplyRules.find((rule) => {
      return (!rule.condition.from || rule.condition.from.some((sender) => email.from.includes(sender))) && (!rule.condition.subject || rule.condition.subject.some((subj) => email.subject.includes(subj))) && (!rule.condition.body || rule.condition.body.some((text) => email.body.includes(text)));
    });
  }
  function sendAutomaticReply(email, rule) {
    return __async(this, null, function* () {
      let replyContent;
      switch (rule.action) {
        case "unsubscribe":
          replyContent = yield generateUnsubscribeReply(email);
          break;
        case "acknowledge":
          replyContent = yield generateAcknowledgementReply(email);
          break;
        default:
          console.error("Unknown auto-reply action:", rule.action);
          return;
      }
      window.gmail.tools.add_to_gmail(replyContent);
      console.log("Automatic reply sent:", replyContent);
    });
  }
  function generateUnsubscribeReply(email) {
    return __async(this, null, function* () {
      const prompt = `Generate a polite email reply requesting to unsubscribe from the newsletter or mailing list. 
    The original email subject was: "${email.subject}"
    It was sent from: ${email.from}`;
      return yield generateReply(prompt);
    });
  }
  function generateAcknowledgementReply(email) {
    return __async(this, null, function* () {
      const prompt = `Generate a brief email reply acknowledging receipt of an order confirmation. 
    The original email subject was: "${email.subject}"
    It was sent from: ${email.from}`;
      return yield generateReply(prompt);
    });
  }
})();
//# sourceMappingURL=extension.js.map
