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
})();
//# sourceMappingURL=configManager.js.map
