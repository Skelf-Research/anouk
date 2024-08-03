"use strict";

const GmailFactory = require("gmail-js");
import $ from "jquery";

const trustedHTMLpolicy = trustedTypes.createPolicy("default", {
    createHTML: (to_escape) => to_escape,
});

$.extend({
    htmlPrefilter: trustedHTMLpolicy.createHTML // this is the actual function which jQuery needs
});

// don't mess up too bad if we have several gmail.js-based
// extensions loaded at the same time!
window._gmailjs = window._gmailjs || new GmailFactory.Gmail($);