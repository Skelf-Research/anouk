// extension-template.js - Basic extension template
import { AIService } from 'anouk';

// Initialize AI service with default configuration
const aiService = new AIService();

// Wait for page to load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initExtension);
} else {
    initExtension();
}

function initExtension() {
    // Add your extension initialization code here
    console.log('Extension loaded!');
    
    // Example: Add a floating button
    addFloatingButton();
}

function addFloatingButton() {
    const button = document.createElement('button');
    button.id = 'ai-extension-button';
    button.innerHTML = 'AI Analyze';
    button.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        padding: 10px 15px;
        background-color: #4285f4;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    `;
    
    button.addEventListener('click', handleButtonClick);
    document.body.appendChild(button);
}

async function handleButtonClick() {
    try {
        // Get the current page content
        const content = document.body.innerText;
        
        // Show loading state
        const button = document.getElementById('ai-extension-button');
        const originalText = button.innerHTML;
        button.innerHTML = 'Analyzing...';
        button.disabled = true;
        
        // Call AI service
        const analysis = await aiService.call(
            'Please analyze the following content and provide a brief summary:',
            content,
            'page-analysis',
            'summary'
        );
        
        // Show results
        alert(analysis);
        
        // Restore button
        button.innerHTML = originalText;
        button.disabled = false;
    } catch (error) {
        console.error('Analysis failed:', error);
        alert('Analysis failed: ' + error.message);
        
        // Restore button
        const button = document.getElementById('ai-extension-button');
        button.innerHTML = 'AI Analyze';
        button.disabled = false;
    }
}