(() => {
  // src/settingsPanel.js
  function createSettingsPanel(aiService) {
    const settingsPanel = $(`
        <div id="ai-settings-panel" class="ai-settings-panel">
            <h3>AI Service Configuration</h3>
            <div class="form-group">
                <label for="provider-url">Provider URL:</label>
                <input type="text" id="provider-url" class="form-control" placeholder="https://api.openai.com/v1/chat/completions">
            </div>
            <div class="form-group">
                <label for="api-key">API Key:</label>
                <input type="password" id="api-key" class="form-control" placeholder="Your API key">
            </div>
            <div class="form-group">
                <label for="model">Model:</label>
                <input type="text" id="model" class="form-control" placeholder="gpt-4">
            </div>
            <div class="form-group">
                <label for="system-prompt">System Prompt:</label>
                <textarea id="system-prompt" class="form-control" rows="3">You are a helpful assistant that analyzes emails.</textarea>
            </div>
            <div class="button-group">
                <button id="save-settings" class="btn btn-primary">Save Settings</button>
                <button id="reset-settings" class="btn btn-secondary">Reset to Default</button>
            </div>
        </div>
    `);
    $("head").append(`
        <style>
            .ai-settings-panel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 400px;
                background: white;
                border: 1px solid #ccc;
                border-radius: 8px;
                padding: 20px;
                z-index: 2000;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                display: none;
            }
            
            .ai-settings-panel.active {
                display: block;
            }
            
            .ai-settings-panel h3 {
                margin-top: 0;
                text-align: center;
            }
            
            .form-group {
                margin-bottom: 15px;
            }
            
            .form-group label {
                display: block;
                margin-bottom: 5px;
                font-weight: bold;
            }
            
            .form-control {
                width: 100%;
                padding: 8px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }
            
            .button-group {
                text-align: center;
                margin-top: 20px;
            }
            
            .btn {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                margin: 0 5px;
            }
            
            .btn-primary {
                background-color: #4285f4;
                color: white;
            }
            
            .btn-secondary {
                background-color: #f1f3f4;
                color: #5f6368;
            }
        </style>
    `);
    $("body").append(settingsPanel);
    const currentConfig = aiService.getConfig();
    $("#provider-url").val(currentConfig.providerUrl);
    $("#api-key").val(currentConfig.apiKey);
    $("#model").val(currentConfig.model);
    $("#system-prompt").val(currentConfig.systemPrompt);
    $("#save-settings").on("click", function() {
      const newConfig = {
        providerUrl: $("#provider-url").val(),
        apiKey: $("#api-key").val(),
        model: $("#model").val(),
        systemPrompt: $("#system-prompt").val()
      };
      aiService.updateConfig(newConfig);
      alert("Settings saved successfully!");
      settingsPanel.removeClass("active");
    });
    $("#reset-settings").on("click", function() {
      if (confirm("Are you sure you want to reset to default settings?")) {
        aiService.updateConfig({
          providerUrl: "https://api.together.xyz/v1/chat/completions",
          apiKey: "",
          model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
          systemPrompt: "You are a helpful assistant that analyzes emails."
        });
        const currentConfig2 = aiService.getConfig();
        $("#provider-url").val(currentConfig2.providerUrl);
        $("#api-key").val(currentConfig2.apiKey);
        $("#model").val(currentConfig2.model);
        $("#system-prompt").val(currentConfig2.systemPrompt);
        alert("Settings reset to default!");
      }
    });
    return settingsPanel;
  }
  function toggleSettingsPanel(panel) {
    panel.toggleClass("active");
  }
})();
//# sourceMappingURL=settingsPanel.js.map
