// Configuration and constants for CMP Document Converter
const CONFIG = {
    // API Configuration
    webhookUrl: 'https://learningtechnologies.app.n8n.cloud/webhook/cmp-document-upload',
    
    // File Configuration
    acceptedFileTypes: '.html,.htm',
    maxLogHeight: '350px',
    
    // UI Configuration
    maxContentHeight: '600px',
    animationDuration: '0.3s',
    
    // Processing Configuration
    maxResponseLogLength: 200
};

// Message constants
const MESSAGES = {
    // Success messages
    CONVERSION_START: '🚀 Starting document conversion...',
    CONVERSION_SUCCESS: '✅ Conversion successful!',
    WEBHOOK_TEST_SUCCESS: '✅ Webhook is reachable!',
    FILE_LOADED: '✅ File content loaded',
    
    // Error messages
    CONVERSION_FAILED: '❌ Conversion failed',
    WEBHOOK_TEST_FAILED: '❌ Webhook test failed',
    VALIDATION_ERROR: '❌ Validation error detected',
    NETWORK_ERROR: '💡 Network error detected. Possible solutions:',
    MISSING_FIELDS: '❌ Please fill in webhook URL and select a file',
    MISSING_WEBHOOK: 'Please enter a webhook URL',
    
    // Info messages
    LOG_CLEARED: 'Log cleared...\n',
    READY_TO_PROCESS: 'Ready to process your document...\n',
    SENDING_TO_N8N: '📤 Sending to n8n...',
    RESPONSE_RECEIVED: '📥 Response received',
    AUTO_DETECTED_LO: '🔍 Auto-detected LO number from filename',
    NO_LO_FOUND: '💡 No LO number found in filename, workflow will use default',
    FOLDER_PROCESSING: '✅ Folder-based processing detected',
    
    // Debug messages
    RESPONSE_DEBUG: '=== RESPONSE DEBUG ===',
    RESPONSE_ANALYSIS: '📋 Response structure analysis:',
    UNEXPECTED_FORMAT: '⚠️ Unexpected response format - no files, folderPath, or error info found',
    
    // Network troubleshooting
    CORS_SOLUTIONS: [
        '1. Use the "Test Webhook" URL from n8n (webhook-test instead of webhook)',
        '2. Make sure the workflow is active and running',
        '3. Check if the webhook path is correct'
    ],
    
    NETWORK_SOLUTIONS: [
        '1. Check if n8n workflow is active',
        '2. Verify webhook URL is correct',
        '3. Try using webhook-test URL instead of webhook',
        '4. Check browser console for CORS errors (F12 > Console)'
    ]
};

// HTML Templates
const TEMPLATES = {
    // File info display
    fileInfo: (folderName, totalFiles, processingDate) => `
        <h4>📁 Files Generated Successfully!</h4>
        <p><strong>Folder Name:</strong> ${folderName}</p>
        <p><strong>Total Files:</strong> ${totalFiles}</p>
        <p><strong>Generated:</strong> ${new Date(processingDate).toLocaleString()}</p>
        <p>You can click <strong>Generated HTML Files</strong> below to view or download individual HTML files, or move on to Step 4 to download all files as a TAR archive.</p>
    `,
    
    // Success response
    successResponse: (status) => `<p style="color: green;">✅ Webhook is reachable!</p>`,
    
    // Warning response
    warningResponse: (status) => `<p style="color: orange;">⚠️ Webhook responded with status ${status}</p>`,
    
    // Error response
    errorResponse: (message) => `<p style="color: red;">❌ Error: ${message}</p>`,
    
    // Missing webhook response
    missingWebhookResponse: () => `<p style="color: red;">Please enter a webhook URL</p>`
};

// Utility functions
const UTILS = {
    // Create styled div with consistent styling
    createStyledDiv: (content, styles) => {
        const div = document.createElement('div');
        Object.assign(div.style, styles);
        div.innerHTML = content;
        return div;
    },
    
    // Standard success box styles
    successBoxStyles: {
        padding: '20px',
        margin: '10px 0',
        backgroundColor: '#d4edda',
        borderRadius: '5px',
        border: '1px solid #c3e6cb'
    },
    
    // Standard info box styles
    infoBoxStyles: {
        padding: '20px',
        margin: '10px 0',
        backgroundColor: '#f8f9fa',
        borderRadius: '5px',
        border: '1px solid #dee2e6'
    },
    
    // Standard download box styles
    downloadBoxStyles: {
        padding: '15px',
        margin: '10px 0',
        backgroundColor: '#e7f3ff',
        borderRadius: '5px',
        border: '1px solid #0066cc',
        textAlign: 'center'
    },
    
    // Format timestamp
    formatTimestamp: () => new Date().toLocaleTimeString(),
    
    // Auto-detect LO number from filename
    detectLONumber: (filename) => {
        const loMatch = filename.match(/LO(\d+)/i);
        return loMatch ? loMatch[1].padStart(2, '0') : '';
    },
    
    // Format file size
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
};

// Export for use in main script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CONFIG, MESSAGES, TEMPLATES, UTILS };
}