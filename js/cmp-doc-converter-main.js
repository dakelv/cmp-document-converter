// CMP Document Converter - Main JavaScript Functions
// Global variable to store the latest result for ZIP download
let latestResult = null;

function log(message) {
    const debugLog = document.getElementById('debugLog');
    const timestamp = UTILS.formatTimestamp();
    debugLog.textContent += `[${timestamp}] ${message}\n`;
    debugLog.scrollTop = debugLog.scrollHeight;
}

function clearLog() {
    document.getElementById('debugLog').textContent = MESSAGES.LOG_CLEARED;
}

async function testWebhook() {
    const webhookUrl = document.getElementById('webhookUrl').value;
    const testResult = document.getElementById('testResult');

    if (!webhookUrl) {
        testResult.innerHTML = TEMPLATES.missingWebhookResponse();
        return;
    }

    log(`Testing webhook: ${webhookUrl}`);

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ test: true })
        });

        log(`Response status: ${response.status}`);
        log(`Response headers: ${JSON.stringify([...response.headers.entries()])}`);

        if (response.ok) {
            testResult.innerHTML = TEMPLATES.successResponse();
            log(MESSAGES.WEBHOOK_TEST_SUCCESS);
        } else {
            const errorText = await response.text();
            testResult.innerHTML = TEMPLATES.warningResponse(response.status);
            log(`Response body: ${errorText}`);
        }

    } catch (error) {
        testResult.innerHTML = TEMPLATES.errorResponse(error.message);
        log(`${MESSAGES.WEBHOOK_TEST_FAILED}: ${error.message}`);

        if (error.message.includes('fetch')) {
            log(MESSAGES.NETWORK_ERROR);
            MESSAGES.CORS_SOLUTIONS.forEach(solution => log(solution));
        }
    }
}

// File validation and handling functions
function validateFileType() {
    const fileInput = document.getElementById('document');
    const file = fileInput.files[0];

    if (file) {
        const fileName = file.name.toLowerCase();
        const allowedExtensions = ['.html', '.htm'];
        const isValidFile = allowedExtensions.some(ext => fileName.endsWith(ext));

        if (!isValidFile) {
            log(`❌ Invalid file type: ${file.name}`);
            log(`⚠️ Only HTML files (.html, .htm) are allowed`);
            log(`💡 Please select an HTML file converted from your Word document`);

            fileInput.value = '';
            hideSelectedFile();

            alert(`Invalid file type!\n\nOnly HTML files (.html, .htm) are accepted.\n\nSelected file: ${file.name}\n\nPlease select an HTML file converted from your Word document.`);
            return false;
        } else {
            log(`✅ Valid HTML file selected: ${file.name}`);
            showSelectedFile(file);
            return true;
        }
    }
    return true;
}

// Drag & Drop Functions
function allowDrop(event) {
    event.preventDefault();
    const dropZone = document.getElementById('fileDropZone');
    dropZone.classList.add('dragover');
}

function handleDragLeave(event) {
    event.preventDefault();
    const dropZone = document.getElementById('fileDropZone');
    dropZone.classList.remove('dragover');
}

function handleDrop(event) {
    event.preventDefault();
    const dropZone = document.getElementById('fileDropZone');
    dropZone.classList.remove('dragover');

    const files = event.dataTransfer.files;
    if (files.length > 0) {
        const file = files[0];

        const fileName = file.name.toLowerCase();
        const allowedExtensions = ['.html', '.htm'];
        const isValidFile = allowedExtensions.some(ext => fileName.endsWith(ext));

        if (!isValidFile) {
            log(`❌ Invalid file type dropped: ${file.name}`);
            log(`⚠️ Only HTML files (.html, .htm) are allowed`);
            alert(`Invalid file type!\n\nOnly HTML files (.html, .htm) are accepted.\n\nDropped file: ${file.name}\n\nPlease drag an HTML file converted from your Word document.`);
            return;
        }

        const fileInput = document.getElementById('document');
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;

        log(`✅ Valid HTML file dropped: ${file.name}`);
        showSelectedFile(file);
    }
}

function triggerFileSelect() {
    document.getElementById('document').click();
}

function showSelectedFile(file) {
    const display = document.getElementById('selectedFileDisplay');
    const fileName = document.getElementById('selectedFileName');

    fileName.textContent = file.name;
    display.style.display = 'block';
}

function hideSelectedFile() {
    const display = document.getElementById('selectedFileDisplay');
    display.style.display = 'none';
}

function clearSelectedFile() {
    const fileInput = document.getElementById('document');
    fileInput.value = '';
    hideSelectedFile();
    log('🗑️ File selection cleared');
}

// Enhanced LO detection function
function detectLearningOutcome(fileName, htmlContent) {
    // Method 1: Check H1 headings for x.y.z patterns (primary method)
    const h1Pattern = /<h1[^>]*>(.*?)<\/h1>/gi;
    let h1Match;
    
    while ((h1Match = h1Pattern.exec(htmlContent)) !== null) {
        const h1Content = h1Match[1];
        
        // Look for x.y.z pattern in H1 content (e.g., "1.2.3 Learning Activity")
        const xyzMatch = h1Content.match(/(\d+)\.(\d+)\.(\d+)/);
        if (xyzMatch) {
            const loNumber = xyzMatch[1].padStart(2, '0');
            log(`🔍 Auto-detected LO number from H1 x.y.z pattern: ${loNumber} (from "${h1Content.trim()}")`);
            return loNumber;
        }
        
        // Look for LOx pattern in H1 content (e.g., "LO5 Intro", "LO12: Introduction", "LO 3 intro")
        const loMatch = h1Content.match(/LO\s*(\d+)/i);
        if (loMatch) {
            const loNumber = loMatch[1].padStart(2, '0');
            log(`🔍 Auto-detected LO number from H1 LO pattern: ${loNumber} (from "${h1Content.trim()}")`);
            return loNumber;
        }
    }
    
    // Method 2: Check filename for LO pattern (fallback method)
    const fileNameMatch = fileName.match(/LO(\d+)/i);
    if (fileNameMatch) {
        const loNumber = fileNameMatch[1].padStart(2, '0');
        log(`🔍 Auto-detected LO number from filename: ${loNumber}`);
        return loNumber;
    }
    
    // Method 3: No LO number found
    log(`💡 No LO number found in H1 headings or filename, workflow will use default`);
    return '';
}

// Helper functions for error reporting
function getLineNumber(content, position) {
    const beforePosition = content.substring(0, position);
    return beforePosition.split('\n').length;
}

function getContextWithLineNumber(content, position, contextLines = 2) {
    const lines = content.split('\n');
    const targetLineIndex = getLineNumber(content, position) - 1;

    const startLine = Math.max(0, targetLineIndex - contextLines);
    const endLine = Math.min(lines.length - 1, targetLineIndex + contextLines);

    let formattedContext = '';
    for (let i = startLine; i <= endLine; i++) {
        const lineNumber = (i + 1).toString().padStart(3, ' ');
        const indicator = i === targetLineIndex ? '→' : ' ';
        const line = (lines[i] || '').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        if (i === targetLineIndex) {
            formattedContext += `<span style="color: #f56565; font-weight: bold;">${lineNumber}${indicator}</span> ${line}\n`;
        } else {
            formattedContext += `<span style="color: #a0aec0;">${lineNumber}${indicator}</span> ${line}\n`;
        }
    }

    return {
        lineNumber: targetLineIndex + 1,
        context: content.substring(Math.max(0, position - 50), position + 100).replace(/\n/g, ' '),
        formattedContext: formattedContext.trim()
    };
}

// Client-side style tag validation function
function validateStyleTags(htmlContent) {
    const errors = [];
    const warnings = [];

    log('🔍 Validating style tags in HTML content...');

    // Simple bracket validation
    const bracketErrors = [];

    // Find all bracket sequences that look like style tags
    const allBracketPatterns = /\[+(?:style:\s*[\w]+|\/style)\]+/gi;
    
    let match;
    while ((match = allBracketPatterns.exec(htmlContent)) !== null) {
        const found = match[0];
        const contextInfo = getContextWithLineNumber(htmlContent, match.index);
        let expectedFormat, errorType;
        
        // Determine what it should be and if it's correct
        if (found.includes('style:')) {
            // Extract the style type (e.g., "read", "image", etc.)
            const styleMatch = found.match(/style:\s*([\w]+)/i);
            const styleType = styleMatch ? styleMatch[1] : 'xx';
            
            // Check if it's a valid format (allowing spaces after colon)
            const validPattern = new RegExp(`^\\[\\[style:\\s*${styleType}\\]\\]$`, 'i');
            const isValidFormat = validPattern.test(found);
            
            if (!isValidFormat) {
                // Only report as error if it's actually malformed (wrong brackets, not just spacing)
                expectedFormat = `[[style:${styleType}]]`;
                errorType = 'malformed_opening_tag';
                bracketErrors.push({
                    type: errorType,
                    message: `Malformed opening tag: ${found} should be ${expectedFormat}`,
                    position: match.index,
                    line: contextInfo.lineNumber,
                    context: contextInfo.formattedContext,
                    found: found,
                    expected: expectedFormat
                });
                log(`❌ Malformed opening tag found: ${found} at line ${contextInfo.lineNumber}`);
            }
        } else if (found.includes('/style')) {
            expectedFormat = '[[/style]]';
            
            if (found !== expectedFormat) {
                errorType = 'malformed_closing_tag';
                bracketErrors.push({
                    type: errorType,
                    message: `Malformed closing tag: ${found} should be ${expectedFormat}`,
                    position: match.index,
                    line: contextInfo.lineNumber,
                    context: contextInfo.formattedContext,
                    found: found,
                    expected: expectedFormat
                });
                log(`❌ Malformed closing tag found: ${found} at line ${contextInfo.lineNumber}`);
            }
        }
    }

    // Add bracket errors to the main errors array
    log(`🔍 Found ${bracketErrors.length} bracket errors`);
    bracketErrors.forEach((error, index) => {
        log(`  ${index + 1}. [${error.type}] ${error.message} at line ${error.line}`);
        errors.push(error);
    });

    // Detailed opening/closing tag validation with stack-based matching
    const openingTags = [];
    const closingTags = [];
    
    // Find all opening tags with their positions and types
    const openingPattern = /\[\[style:\s*([\w]+)\]\]/gi;
    let openMatch;
    while ((openMatch = openingPattern.exec(htmlContent)) !== null) {
        const styleType = openMatch[1] ? openMatch[1].toLowerCase() : 'unknown';
        openingTags.push({
            type: styleType,
            fullMatch: openMatch[0],
            position: openMatch.index,
            line: getLineNumber(htmlContent, openMatch.index)
        });
    }
    
    // Find all closing tags with their positions
    const closingPattern = /\[\[\/style\]\]/gi;
    let closeMatch;
    while ((closeMatch = closingPattern.exec(htmlContent)) !== null) {
        closingTags.push({
            fullMatch: closeMatch[0],
            position: closeMatch.index,
            line: getLineNumber(htmlContent, closeMatch.index)
        });
    }
    
    log(`📊 Style tag summary: ${openingTags.length} opening, ${closingTags.length} closing`);
    
    // Stack-based validation to find unmatched tags
    if (openingTags.length > 0 || closingTags.length > 0) {
        // Create combined array of all tags sorted by position
        const allTags = [];
        
        openingTags.forEach(tag => {
            allTags.push({ ...tag, tagType: 'opening' });
        });
        
        closingTags.forEach(tag => {
            allTags.push({ ...tag, tagType: 'closing', type: 'closing' });
        });
        
        // Sort by position
        allTags.sort((a, b) => a.position - b.position);
        
        // Process tags using stack-based validation
        const stack = [];
        const orphanedClosingTags = [];
        
        for (let i = 0; i < allTags.length; i++) {
            const tag = allTags[i];
            
            if (tag.tagType === 'opening') {
                stack.push(tag);
            } else if (tag.tagType === 'closing') {
                if (stack.length === 0) {
                    // Orphaned closing tag
                    const contextInfo = getContextWithLineNumber(htmlContent, tag.position);
                    orphanedClosingTags.push({
                        position: tag.position,
                        line: contextInfo.lineNumber,
                        context: contextInfo.formattedContext
                    });
                } else {
                    // Match with most recent opening tag
                    const openingTag = stack.pop();
                }
            }
        }
        
        // Handle orphaned closing tags
        if (orphanedClosingTags.length > 0) {
            const errorMsg = {
                type: 'orphaned_closing',
                message: `${orphanedClosingTags.length} orphaned closing tag${orphanedClosingTags.length > 1 ? 's' : ''} [[/style]] found with no matching opening tag${orphanedClosingTags.length > 1 ? 's' : ''}.`,
                context: orphanedClosingTags.map(tag => 
                    `[[/style]] at line ${tag.line}\n${tag.context}`
                ).join('\n\n')
            };
            errors.push(errorMsg);
            log(`❌ ERROR: ${errorMsg.message}`);
        }
        
        // Handle unclosed opening tags (missing closing tags)
        if (stack.length > 0) {
            // Create individual errors for each unclosed opening tag
            stack.forEach(unclosedTag => {
                const contextInfo = getContextWithLineNumber(htmlContent, unclosedTag.position);
                const errorMsg = {
                    type: 'missing_closing',
                    message: `Opening tag [[style:${unclosedTag.type}]] at line ${contextInfo.lineNumber} is missing its closing tag [[/style]].`,
                    context: contextInfo.formattedContext
                };
                errors.push(errorMsg);
                log(`❌ ERROR: Opening tag [[style:${unclosedTag.type}]] at line ${contextInfo.lineNumber} missing closing tag`);
            });
        }
    }

    return { errors, warnings };
}

// Function to display style validation errors with formatted code
function showStyleValidationErrors(errors, htmlContent) {
    // Create modal HTML
    const modalHtml = `
        <div id="errorModal" style="
            position: fixed; 
            top: 0; 
            left: 0; 
            width: 100%; 
            height: 100%; 
            background: rgba(0,0,0,0.7); 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            z-index: 10000;
        ">
            <div style="
                background: white; 
                padding: 30px; 
                border-radius: 10px; 
                max-width: 80vw; 
                max-height: 80vh; 
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            ">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #e74c3c; padding-bottom: 15px;">
                    <h2 style="margin: 0; color: #e74c3c; font-size: 1.5rem;">
                        ❌ Style Tag Validation Failed
                    </h2>
                    <button onclick="closeErrorModal()" style="
                        background: #e74c3c; 
                        color: white; 
                        border: none; 
                        padding: 8px 15px; 
                        border-radius: 5px; 
                        cursor: pointer; 
                        font-size: 1rem;
                    ">✖ Close</button>
                </div>
                <p style="margin-bottom: 20px; color: #333; font-size: 1.1rem;">
                    Found <strong>${errors.length}</strong> error${errors.length > 1 ? 's' : ''} in your HTML document:
                </p>
                <div id="errorList"></div>
                <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; border-left: 4px solid #17a2b8;">
                    <p style="margin: 0; color: #17a2b8; font-weight: bold;">💡 How to fix:</p>
                    <p style="margin: 5px 0 0 0; color: #333; font-size: 0.95rem;">
                        Edit your Word or HTML document to fix the issues shown above, then try uploading again. 
                    </p>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    
    // Populate error list
    const errorList = document.getElementById('errorList');
    errors.forEach((error, index) => {
        const errorDiv = document.createElement('div');
        errorDiv.style.marginBottom = '25px';
        errorDiv.style.padding = '15px';
        errorDiv.style.border = '1px solid #dc3545';
        errorDiv.style.borderRadius = '5px';
        errorDiv.style.backgroundColor = '#fff5f5';
        
        // Handle structured error object or legacy string format
        let errorMessage, codeContext;
        
        if (typeof error === 'object' && error.message) {
            // New structured format
            errorMessage = error.message;
            codeContext = error.codeContext || error.context || '';
        } else {
            // Legacy string format (fallback)
            const parts = error.split('\n\nCode context:\n');
            errorMessage = parts[0];
            codeContext = parts[1] || '';
        }
        
        errorDiv.innerHTML = `
            <h4 style="margin: 0 0 10px 0; color: #dc3545; font-size: 1.1rem;">
                Error ${index + 1}:
            </h4>
            <p style="margin: 0 0 15px 0; color: #333; font-size: 1rem; line-height: 1.4;">
                ${errorMessage}
            </p>
            ${codeContext ? `
                <div style="margin-top: 15px;">
                    <p style="margin: 0 0 8px 0; font-weight: bold; color: #495057; font-size: 0.95rem;">Code context:</p>
                    <pre style="
                        background: #2d3748; 
                        border: 1px solid #4a5568; 
                        border-radius: 6px; 
                        padding: 16px; 
                        margin: 0; 
                        font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace; 
                        font-size: 0.85rem; 
                        line-height: 1.4; 
                        color: #e2e8f0; 
                        white-space: pre-wrap; 
                        word-wrap: break-word; 
                        overflow-x: auto;
                    ">${codeContext}</pre>
                </div>
            ` : ''}
        `;
        
        errorList.appendChild(errorDiv);
    });
}

function closeErrorModal() {
    const modal = document.getElementById('errorModal');
    if (modal) {
        modal.remove();
    }
}

// Main conversion function
async function convertDocument() {
    const webhookUrl = document.getElementById('webhookUrl').value;
    const fileInput = document.getElementById('document');
    let learningOutcome = ''; // Default empty since input field was removed

    if (!webhookUrl || !fileInput.files[0]) {
        log(MESSAGES.MISSING_FIELDS);
        return;
    }

    // Validate file type before processing
    if (!validateFileType()) {
        return;
    }

    // Start progress tracking
    updateProgress(10, '🔄 Starting conversion...');
    log(MESSAGES.CONVERSION_START);

    try {
        const file = fileInput.files[0];
        updateProgress(20, '📄 Reading file...');
        log(`📄 Reading file: ${file.name} (${file.size} bytes)`);

        const htmlContent = await file.text();
        updateProgress(30, '✅ File loaded, validating...');
        log(`✅ File content loaded (${htmlContent.length} characters)`);

        // CLIENT-SIDE STYLE TAG VALIDATION
        updateProgress(40, '🔍 Validating style tags...');
        log('🔍 Performing client-side style tag validation...');
        const validation = validateStyleTags(htmlContent);
        
        if (validation.errors.length > 0) {
            resetProgress();
            log('❌ Style tag validation failed!');
            
            log(`Found ${validation.errors.length} total error${validation.errors.length > 1 ? 's' : ''}`);
            validation.errors.forEach((error, index) => {
                const errorType = error.type ? `[${error.type}]` : '';
                log(`${index + 1}. ${errorType} ${error.message || error}`);
            });
            
            // Show detailed error message to user with formatted code
            showStyleValidationErrors(validation.errors, htmlContent);
            
            log('💡 Upload cancelled - please fix style tag issues and try again');
            return; // Stop processing here
        }
        
        if (validation.warnings.length > 0) {
            updateProgress(50, '⚠️ Validation completed with warnings');
            log(`⚠️ Style tag validation completed with ${validation.warnings.length} warning(s):`);
            validation.warnings.forEach((warning, index) => {
                log(`${index + 1}. ${warning}`);
            });
        } else {
            updateProgress(50, '✅ Validation passed');
            log('✅ Style tag validation passed - no errors found');
        }

        // Auto-detect LO number from H1 headings or filename
        updateProgress(60, '🔍 Processing file details...');
        learningOutcome = detectLearningOutcome(file.name, htmlContent);

        const payload = {
            htmlContent: htmlContent,
            fileName: file.name,
            learningOutcome: learningOutcome
        };

        updateProgress(70, '📤 Sending to n8n...');
        log('📤 Sending to n8n...');

        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        updateProgress(80, '📥 Processing response...');
        log(`📥 Response received: ${response.status} ${response.statusText}`);

        if (!response.ok) {
            resetProgress();
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        updateProgress(90, '🔄 Parsing results...');
        const result = await response.json();
        latestResult = result; // Store for download functionality

        updateProgress(100, '✅ Conversion complete!');
        log('✅ Conversion successful!');

        // Display results
        displayResults(result);

        // Reset progress after a short delay to show completion
        setTimeout(() => {
            resetProgress();
        }, 2000);

    } catch (error) {
        resetProgress();
        log(`❌ Conversion failed: ${error.message}`);
        console.error('Conversion error:', error);
    }
}

// Progress bar functions
function updateProgress(percentage, message) {
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const buttonText = document.getElementById('buttonText');
    
    if (progressBar && progressFill && buttonText) {
        progressBar.style.display = 'block';
        progressFill.style.width = percentage + '%';
        buttonText.textContent = message;
    }
}

function resetProgress() {
    const progressBar = document.getElementById('progressBar');
    const progressFill = document.getElementById('progressFill');
    const buttonText = document.getElementById('buttonText');
    
    if (progressBar && progressFill && buttonText) {
        progressBar.style.display = 'none';
        progressFill.style.width = '0%';
        buttonText.textContent = '🚀 Convert Document';
    }
}

// Results display function
function displayResults(result) {
    // Store result globally for download
    latestResult = result;

    const resultsDiv = document.getElementById('results');
    const fileList = document.getElementById('fileList');

    fileList.innerHTML = '';

    // Handle different response structures
    let actualData = result;
    
    // Check if response is wrapped (common with n8n)
    if (result.data) {
        actualData = result.data;
    } else if (Array.isArray(result) && result.length > 0) {
        actualData = result[0];
    }

    if (actualData.success && actualData.folderPath) {
        // Display folder location and summary
        const folderInfo = document.createElement('div');
        folderInfo.style.padding = '20px';
        folderInfo.style.margin = '10px 0';
        folderInfo.style.backgroundColor = '#d4edda';
        folderInfo.style.borderRadius = '5px';
        folderInfo.style.border = '1px solid #c3e6cb';

        folderInfo.innerHTML = `
            <h4>📁 Files Generated Successfully!</h4>
            <p><strong>Total Files:</strong> ${actualData.totalFiles}</p>
            <p><strong>TAR archive:</strong> ${actualData.folderName}.tar</p>
            <p><strong>Generated:</strong> ${new Date(actualData.processingDate).toLocaleString()}</p>
            <p>You can click <strong>Generated HTML Files</strong> below to view or download individual HTML files, or download in the <strong>Step 4: Download Results</strong> section.</p>
        `;

        fileList.appendChild(folderInfo);

        // Display generated HTML files list
        if (actualData.files && actualData.files.length > 0) {
            const filesListDiv = document.createElement('div');
            filesListDiv.style.padding = '20px';
            filesListDiv.style.margin = '10px 0';
            filesListDiv.style.backgroundColor = '#f8f9fa';
            filesListDiv.style.borderRadius = '5px';
            filesListDiv.style.border = '1px solid #dee2e6';

            let filesHTML = '<button onclick="toggleGeneratedFiles()" style="background: linear-gradient(135deg, #2F5496, #1F3763); color: white; padding: 15px; width: 100%; border: none; border-radius: 8px; font-size: 1.1rem; font-weight: bold; cursor: pointer; margin: 10px 0; display: flex; justify-content: space-between; align-items: center;"><span id="filesToggleText">📄 Generated HTML Files (Click to show)</span> <span id="filesToggleIcon">➕</span></button>';
            filesHTML += '<div id="filesContainer" style="display: none; padding: 20px; background-color: #f8f9fa; border-radius: 0 0 8px 8px; border: 1px solid #dee2e6;">';

            actualData.files.forEach((file, index) => {
                filesHTML += `
                    <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px; margin: 5px 0; background: white; border-radius: 5px; border: 1px solid #e0e0e0;">
                        <div style="flex: 1;">
                            <strong>${file.fileName}</strong>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-info" style="padding: 5px 10px; font-size: 0.8rem;" onclick="previewFile(${index})">
                                👁️ Preview
                            </button>
                            <button class="btn btn-secondary" style="padding: 5px 10px; font-size: 0.8rem;" onclick="viewFileCode(${index})">
                                📝 View Code
                            </button>
                            <button class="btn btn-success" style="padding: 5px 10px; font-size: 0.8rem;" onclick="downloadSingleFile(${index})">
                                💾 Download
                            </button>
                        </div>
                    </div>
                `;
            });

            filesHTML += '</div>'; // Close filesContainer
            filesListDiv.innerHTML = filesHTML;
            fileList.appendChild(filesListDiv);
        }

        // Add download section
        const downloadStepDiv = document.createElement('div');
        downloadStepDiv.style.padding = '15px';
        downloadStepDiv.style.margin = '10px 0';
        downloadStepDiv.style.backgroundColor = '#e7f3ff';
        downloadStepDiv.style.borderRadius = '5px';
        downloadStepDiv.style.border = '1px solid #0066cc';
        downloadStepDiv.style.textAlign = 'center';

        downloadStepDiv.innerHTML = `
            <div class="step-header">
                <div class="step-number">4</div>
                <h3 class="step-title">Download Results</h3>
            </div>
            <div class="alert alert-success">
                <p><strong>✅ Processing Complete!</strong> Choose your download option below.</p>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin: 1rem 0;">
                <button class="btn btn-warning" onclick="downloadAsTar()">
                    📦 Download TAR Archive (${actualData.totalFiles} Files)
                </button>
            </div>
        `;

        fileList.appendChild(downloadStepDiv);
        resultsDiv.style.display = 'block';
        
    } else {
        // Handle old format or errors
        const errorDiv = document.createElement('div');
        errorDiv.style.padding = '20px';
        errorDiv.style.margin = '10px 0';
        errorDiv.style.backgroundColor = '#f8d7da';
        errorDiv.innerHTML = `
            <h4>❌ Unexpected Response Format</h4>
            <p>The workflow may be using an older format. Check the debug log for details.</p>
        `;
        fileList.appendChild(errorDiv);
        resultsDiv.style.display = 'block';
    }
}

// File preview and download functions
function previewFile(index) {
    if (!latestResult || !latestResult.files || !latestResult.files[index]) {
        log('❌ File not found for preview');
        return;
    }

    const file = latestResult.files[index];
    const previewWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');

    if (previewWindow) {
        let htmlContent;
        if (file.downloadUrl && file.downloadUrl.startsWith('data:')) {
            const base64Data = file.downloadUrl.split(',')[1];
            htmlContent = atob(base64Data);
        } else if (file.content) {
            htmlContent = file.content;
        } else {
            htmlContent = '<p>No content available for preview</p>';
        }

        previewWindow.document.write(htmlContent);
        previewWindow.document.close();
        log(`👁️ Opened preview for: ${file.fileName}`);
    } else {
        log('❌ Could not open preview window. Please allow popups for this site.');
    }
}

function viewFileCode(index) {
    if (!latestResult || !latestResult.files || !latestResult.files[index]) {
        log('❌ File not found for code view');
        return;
    }

    const file = latestResult.files[index];
    const codeWindow = window.open('', '_blank', 'width=900,height=700,scrollbars=yes,resizable=yes');

    if (codeWindow) {
        let htmlContent;
        if (file.downloadUrl && file.downloadUrl.startsWith('data:')) {
            const base64Data = file.downloadUrl.split(',')[1];
            htmlContent = atob(base64Data);
        } else if (file.content) {
            htmlContent = file.content;
        } else {
            htmlContent = 'No content available';
        }

        codeWindow.document.write('<!DOCTYPE html><html><head><title>Source Code: ' + file.fileName + '</title>');
        codeWindow.document.write('<link rel="preconnect" href="https://fonts.googleapis.com">');
        codeWindow.document.write('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>');
        codeWindow.document.write('<link href="https://fonts.googleapis.com/css2?family=Google+Sans+Mono:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">');
        codeWindow.document.write('<style>body{font-family:"Google Sans Mono",Consolas,Monaco,"SF Mono","Cascadia Code","Roboto Mono",monospace;margin:20px;background:#f8f9fa}');
        codeWindow.document.write('.header{background:#2F5496;color:white;padding:15px;margin:-20px -20px 20px -20px}');
        codeWindow.document.write('pre{background:white;padding:20px;border-radius:5px;border:1px solid #dee2e6;overflow-x:auto;white-space:pre-wrap;font-size:16px;line-height:1.5;font-family:"Google Sans Mono",Consolas,Monaco,"SF Mono","Cascadia Code","Roboto Mono",monospace}');
        codeWindow.document.write('.copy-btn{background:#2F5496;color:white;border:none;padding:8px 16px;border-radius:4px;cursor:pointer;margin-bottom:10px}');
        codeWindow.document.write('</style></head><body>');
        codeWindow.document.write('<div class="header"><h2>Source Code: ' + file.fileName + '</h2></div>');
        codeWindow.document.write('<button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById(\'code\').textContent)">Copy Code</button>');
        codeWindow.document.write('<pre id="code">' + htmlContent.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</pre>');
        codeWindow.document.write('</body></html>');
        codeWindow.document.close();
        log('Code view opened for: ' + file.fileName);
    } else {
        log('Could not open code view window. Please allow popups.');
    }
}

function downloadSingleFile(index) {
    if (!latestResult || !latestResult.files || !latestResult.files[index]) {
        log('❌ File not found for download');
        return;
    }

    const file = latestResult.files[index];

    let htmlContent;
    if (file.downloadUrl && file.downloadUrl.startsWith('data:')) {
        const base64Data = file.downloadUrl.split(',')[1];
        htmlContent = atob(base64Data);
    } else if (file.content) {
        htmlContent = file.content;
    } else {
        log('❌ No content available for download');
        return;
    }

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = file.fileName;
    downloadLink.style.display = 'none';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    window.URL.revokeObjectURL(url);
    log(`💾 Downloaded: ${file.fileName}`);
}

// TAR archive creation functions
function downloadAsTar() {
    if (!latestResult || !latestResult.files || latestResult.files.length === 0) {
        log('❌ No files available for TAR download');
        return;
    }

    log('📦 Creating TAR archive...');

    try {
        const folderName = latestResult.folderName;
        const tarData = [];

        // Create README file content
        const readmeContent = `# ${folderName} - Generated HTML Files
                
Generated on: ${new Date().toLocaleString()}
Total files: ${latestResult.files.length}
Source: CMP Document Converter

## File Structure:
${latestResult.files.map(f => `- ${f.fileName}`).join('\n')}

## Usage:
These HTML files are ready to be uploaded to Brightspace or your LMS.
Each file represents a section from your original document.

## Extraction:
Use 7-Zip, WinRAR, or similar tool to extract this TAR archive.
`;

        // Add README to TAR
        addFileToTar(tarData, 'README.txt', readmeContent);
        log('📄 Added README.txt to TAR');

        // Add each HTML file to TAR
        latestResult.files.forEach(file => {
            const base64Data = file.downloadUrl.split(',')[1];
            const htmlContent = atob(base64Data);

            addFileToTar(tarData, `${folderName}/${file.fileName}`, htmlContent);
            log(`📄 Added to TAR: ${file.fileName}`);
        });

        // Add TAR end-of-archive marker (two 512-byte zero blocks)
        tarData.push(new Uint8Array(512));
        tarData.push(new Uint8Array(512));

        log('🔄 Generating TAR file...');

        // Create TAR file blob
        const tarBlob = new Blob(tarData, { type: 'application/x-tar' });

        // Download TAR file
        const downloadUrl = window.URL.createObjectURL(tarBlob);
        const downloadLink = document.createElement('a');
        downloadLink.href = downloadUrl;
        downloadLink.download = `${folderName}.tar`;
        downloadLink.style.display = 'none';

        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        window.URL.revokeObjectURL(downloadUrl);

        log(`✅ TAR download started: ${folderName}.tar`);

    } catch (error) {
        log(`❌ TAR creation failed: ${error.message}`);
    }
}

// Helper function to add a file to TAR data
function addFileToTar(tarData, fileName, content) {
    const fileData = new TextEncoder().encode(content);
    const header = createTarHeader(fileName, fileData.length);

    tarData.push(header);
    tarData.push(fileData);

    // Pad to 512-byte boundary
    const padding = 512 - (fileData.length % 512);
    if (padding !== 512) {
        tarData.push(new Uint8Array(padding));
    }
}

// Create TAR header (512 bytes)
function createTarHeader(fileName, fileSize) {
    const header = new Uint8Array(512);
    const encoder = new TextEncoder();

    // File name (100 bytes)
    const nameBytes = encoder.encode(fileName);
    header.set(nameBytes.slice(0, 100), 0);

    // File mode (8 bytes) - 644 in octal
    const mode = '0000644\0';
    header.set(encoder.encode(mode), 100);

    // Owner ID (8 bytes)
    const uid = '0000000\0';
    header.set(encoder.encode(uid), 108);

    // Group ID (8 bytes)
    const gid = '0000000\0';
    header.set(encoder.encode(gid), 116);

    // File size (12 bytes)
    const size = fileSize.toString(8).padStart(11, '0') + '\0';
    header.set(encoder.encode(size), 124);

    // Modification time (12 bytes)
    const mtime = Math.floor(Date.now() / 1000).toString(8).padStart(11, '0') + '\0';
    header.set(encoder.encode(mtime), 136);

    // Type flag (1 byte) - regular file
    header[156] = 48; // '0' for regular file

    // Calculate and set checksum
    const checksum = calculateTarChecksum(header);
    const checksumStr = checksum.toString(8).padStart(6, '0') + '\0 ';
    header.set(encoder.encode(checksumStr), 148);

    return header;
}

// Calculate TAR checksum
function calculateTarChecksum(header) {
    // Clear checksum field for calculation
    for (let i = 148; i < 156; i++) {
        header[i] = 32; // space character
    }

    let sum = 0;
    for (let i = 0; i < 512; i++) {
        sum += header[i];
    }

    return sum;
}

// Toggle functions
function toggleGeneratedFiles() {
    const container = document.getElementById('filesContainer');
    const icon = document.getElementById('filesToggleIcon');
    const text = document.getElementById('filesToggleText');
    
    if (container.style.display === 'none') {
        container.style.display = 'block';
        icon.textContent = '➖';
        text.textContent = '📄 Generated HTML Files (Click to hide)';
        log('📂 Revealed generated files');
    } else {
        container.style.display = 'none';
        icon.textContent = '➕';
        text.textContent = '📄 Generated HTML Files (Click to show)';
        log('📁 Hidden generated files');
    }
}

// Initialize page functionality
function initializePage() {
    // Load saved webhook URL
    const savedUrl = localStorage.getItem('webhookUrl');
    if (savedUrl) {
        document.getElementById('webhookUrl').value = savedUrl;
    }

    // Initialize collapsible functionality
    const collapsibles = document.querySelectorAll('.collapsible');
    collapsibles.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
                content.classList.remove('active');
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.classList.add('active');
            }
        });
    });

    // Save webhook URL to localStorage
    document.getElementById('webhookUrl').addEventListener('change', function () {
        localStorage.setItem('webhookUrl', this.value);
    });

    // Validate file type immediately when file is selected
    document.getElementById('document').addEventListener('change', function () {
        validateFileType();
    });
}

// SSO Authentication check
async function checkSSOAuthentication() {
    console.log('🔐 Checking SSO authentication...');
    
    try {
        const isAuthenticated = await window.ssoAuth.initialize();
        
        if (isAuthenticated) {
            const userInfo = window.ssoAuth.getUserInfo();
            console.log('✅ SSO Authentication successful:', userInfo.name);
            
            // Show user info in header
            showUserInfo(userInfo);
            return true;
        } else {
            console.log('❌ SSO Authentication required');
            showLoginPrompt();
            return false;
        }
    } catch (error) {
        console.error('❌ SSO Authentication error:', error);
        showAuthError(error.message);
        return false;
    }
}

// Show user information in the header
function showUserInfo(userInfo) {
    const header = document.querySelector('.header');
    if (header) {
        const userDiv = document.createElement('div');
        userDiv.style.cssText = `
            position: absolute;
            top: 20px;
            right: 20px;
            background: rgba(255, 255, 255, 0.9);
            padding: 10px 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            font-size: 14px;
        `;
        userDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span>👤 ${userInfo.name}</span>
                <button onclick="window.ssoAuth.logout()" style="
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                ">Logout</button>
            </div>
        `;
        header.style.position = 'relative';
        header.appendChild(userDiv);
    }
}

// Show login prompt
function showLoginPrompt() {
    document.body.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                text-align: center;
                max-width: 400px;
                width: 90%;
            ">
                <h1 style="color: #333; margin-bottom: 20px;">🔐 Authentication Required</h1>
                <h2 style="color: #007bff; margin-bottom: 30px;">CMP Document Converter</h2>
                <p style="color: #666; margin-bottom: 30px; line-height: 1.5;">
                    Please sign in with your Saskatchewan Polytechnic account to access the CMP Document Converter.
                </p>
                <button onclick="window.ssoAuth.login()" style="
                    background: linear-gradient(135deg, #007bff, #0056b3);
                    color: white;
                    border: none;
                    padding: 15px 30px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: transform 0.2s;
                    box-shadow: 0 4px 15px rgba(0,123,255,0.3);
                " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
                    🚀 Sign In with Microsoft
                </button>
                <p style="color: #888; font-size: 14px; margin-top: 20px;">
                    Contact Learning Technologies if you need access
                </p>
            </div>
        </div>
    `;
}

// Show authentication error
function showAuthError(errorMessage) {
    document.body.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
            <div style="
                background: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                text-align: center;
                max-width: 400px;
                width: 90%;
            ">
                <h1 style="color: #dc3545; margin-bottom: 20px;">❌ Authentication Error</h1>
                <p style="color: #666; margin-bottom: 20px;">${errorMessage}</p>
                <button onclick="location.reload()" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 6px;
                    cursor: pointer;
                ">Try Again</button>
            </div>
        </div>
    `;
}

// Initialize when page loads
window.onload = async function() {
    // Check SSO authentication first
    const isAuthenticated = await checkSSOAuthentication();
    
    if (isAuthenticated) {
        // Initialize the main application
        initializePage();
        
        // Set the last updated date in the footer
        const lastUpdatedElement = document.getElementById('lastUpdated');
        if (lastUpdatedElement) {
            const buildDate = new Date('2025-08-07'); // Updated for SSO implementation
            lastUpdatedElement.textContent = buildDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        }
    }
    // If not authenticated, the login prompt is already shown by checkSSOAuthentication
};

// Debug: Log that the script has loaded
console.log('CMP Document Converter main script loaded');
console.log('Available functions:', {
    log: typeof log,
    clearLog: typeof clearLog,
    testWebhook: typeof testWebhook,
    validateFileType: typeof validateFileType,
    allowDrop: typeof allowDrop,
    handleDrop: typeof handleDrop,
    triggerFileSelect: typeof triggerFileSelect,
    convertDocument: typeof convertDocument
});