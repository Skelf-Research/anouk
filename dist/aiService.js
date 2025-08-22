(() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
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

  // src/configManager.js
  var ConfigManager = class {
    constructor() {
      this.defaultConfig = {
        providerUrl: "https://api.together.xyz/v1/chat/completions",
        apiKey: "",
        model: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
        systemPrompt: "You are a helpful assistant that analyzes emails."
      };
      this.loadConfig();
    }
    // Load configuration from localStorage
    loadConfig() {
      try {
        const savedConfig = localStorage.getItem("ai-extension-config");
        if (savedConfig) {
          this.config = __spreadValues(__spreadValues({}, this.defaultConfig), JSON.parse(savedConfig));
        } else {
          this.config = __spreadValues({}, this.defaultConfig);
        }
      } catch (error) {
        console.error("Error loading configuration:", error);
        this.config = __spreadValues({}, this.defaultConfig);
      }
    }
    // Save configuration to localStorage
    saveConfig(config) {
      try {
        this.config = __spreadValues(__spreadValues({}, this.config), config);
        localStorage.setItem("ai-extension-config", JSON.stringify(this.config));
      } catch (error) {
        console.error("Error saving configuration:", error);
      }
    }
    // Get current configuration
    getConfig() {
      return __spreadValues({}, this.config);
    }
    // Update specific configuration values
    updateConfig(key, value) {
      this.config[key] = value;
      this.saveConfig(this.config);
    }
    // Reset to default configuration
    resetToDefault() {
      this.config = __spreadValues({}, this.defaultConfig);
      this.saveConfig(this.config);
    }
  };
  var configManager = new ConfigManager();
  var configManager_default = configManager;

  // src/aiService.js
  var AIService = class {
    constructor(config = {}) {
      this.config = __spreadValues(__spreadValues({}, configManager_default.getConfig()), config);
    }
    call(instruction, content, emailId, cacheKey) {
      return __async(this, null, function* () {
        const cacheFullKey = `${emailId}_${cacheKey}`;
        const cachedResponse = this.getCachedResponse(cacheFullKey);
        if (cachedResponse) {
          console.log(`Using cached response for ${cacheFullKey}`);
          return cachedResponse;
        }
        const response = yield this.makeRequest(instruction, content);
        this.setCachedResponse(cacheFullKey, response);
        return response;
      });
    }
    makeRequest(instruction, content) {
      return __async(this, null, function* () {
        const currentConfig = configManager_default.getConfig();
        const response = yield fetch(currentConfig.providerUrl, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${currentConfig.apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: currentConfig.model,
            messages: [
              { role: "system", content: currentConfig.systemPrompt },
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
      });
    }
    // Cache helper functions
    getCachedResponse(key) {
      try {
        const cachedData = localStorage.getItem(key);
        return cachedData ? JSON.parse(cachedData) : null;
      } catch (error) {
        console.error("Cache retrieval error:", error);
        return null;
      }
    }
    setCachedResponse(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error("Cache storage error:", error);
      }
    }
    // Method to update configuration
    updateConfig(newConfig) {
      configManager_default.saveConfig(newConfig);
      this.config = __spreadValues(__spreadValues({}, this.config), newConfig);
    }
    // Method to get current configuration
    getConfig() {
      return configManager_default.getConfig();
    }
  };
  var aiService_default = AIService;
})();
//# sourceMappingURL=aiService.js.map
