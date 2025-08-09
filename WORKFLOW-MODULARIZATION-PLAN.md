# Workflow Modularization Plan

## Problem Statement
The JSON workflow file (`cmp-document-converter.json`) is becoming increasingly large and difficult to maintain, making version control and revisions challenging.

## Solution Overview
Extract JavaScript code from the monolithic JSON workflow into separate, modular files with a build system to combine them back into the n8n-compatible format.

## 1. Extract JavaScript Code to Separate Files

### Proposed File Structure
```
/src/
  ├── nodes/
  │   ├── process-upload.js
  │   ├── parse-document-sections.js
  │   ├── generate-html-files.js
  │   └── final-response.js
  ├── templates/
  │   └── html-template.js
  └── utils/
      ├── html-processors.js
      └── style-handlers.js
```

### Template Reference System
Replace large JavaScript blocks in JSON with file references:
```json
{
  "parameters": {
    "jsCode": "{{file:src/nodes/process-upload.js}}"
  }
}
```

## 2. Build System Implementation

### Build Script (build-workflow.js)
```javascript
const fs = require('fs');
const path = require('path');

function buildWorkflow() {
  const template = JSON.parse(fs.readFileSync('workflow-template.json'));
  
  // Replace {{file:path}} placeholders with actual file content
  const workflow = JSON.stringify(template).replace(
    /\{\{file:([^}]+)\}\}/g,
    (match, filePath) => {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.stringify(content).slice(1, -1); // Remove quotes
    }
  );
  
  fs.writeFileSync('cmp-document-converter.json', workflow);
}
```## 3
. Version Control Benefits

This modular approach provides:
- **Meaningful diffs**: Changes to specific functions are isolated
- **Better code organization**: Related functions grouped together
- **Easier maintenance**: Find and edit specific functionality quickly
- **Code reuse**: Share utility functions between nodes
- **Syntax highlighting**: Proper JavaScript editing experience
- **Reduced merge conflicts**: Changes in different areas don't conflict

## 4. Detailed File Structure

```
cmp-document-converter/
├── src/
│   ├── nodes/
│   │   ├── 01-webhook-trigger.json      # Simple nodes stay as JSON
│   │   ├── 02-process-upload.js
│   │   ├── 03-parse-sections.js
│   │   ├── 04-generate-html.js
│   │   └── 05-final-response.js
│   ├── templates/
│   │   ├── html-template.js
│   │   └── styles.css
│   ├── processors/
│   │   ├── html-entity-decoder.js
│   │   ├── p-tag-cleaner.js
│   │   └── style-processors/
│   │       ├── reference-style.js
│   │       ├── transcript-style.js
│   │       ├── code-style.js
│   │       └── image-style.js
│   └── utils/
│       ├── validation.js
│       └── constants.js
├── workflow-template.json               # Main structure with placeholders
├── build-workflow.js                   # Build script
├── package.json                        # Build dependencies
└── cmp-document-converter.json         # Generated final workflow
```

## 5. Implementation Strategy

### Phase 1: Extract Largest Node
- Start with "Generate HTML Files" node (Node 4) - the most complex
- Extract JavaScript code to `src/nodes/04-generate-html.js`
- Break down into smaller modules:
  - HTML template generation
  - Style processing functions
  - Content processing utilities

### Phase 2: Create Build System
- Implement `build-workflow.js` script
- Create `workflow-template.json` with placeholders
- Set up npm scripts for building

### Phase 3: Gradual Modularization
- Extract remaining JavaScript nodes one by one
- Identify common utilities and extract to shared modules
- Organize style processors into separate files

### Phase 4: Enhanced Development Workflow
- Add linting and formatting for JavaScript files
- Implement watch mode for automatic rebuilding
- Add validation to ensure generated JSON is valid## 6. Ex
ample Modular Breakdown

### Current Monolithic Structure
```json
{
  "parameters": {
    "jsCode": "// 500+ lines of JavaScript code including:\n// - HTML template generation\n// - Style processing\n// - Content transformation\n// - Error handling\n// - Validation logic"
  }
}
```

### Proposed Modular Structure
```javascript
// src/nodes/04-generate-html.js
const { htmlTemplate } = require('../templates/html-template');
const { processStyles } = require('../processors/style-processor');
const { cleanHtmlEntities } = require('../utils/html-utils');
const { validateInput } = require('../utils/validation');

// Main node logic here...
```

```javascript
// src/processors/style-processors/transcript-style.js
module.exports = {
  processTranscript: (cleanContent) => {
    const firstPMatch = cleanContent.match(/<p[^>]*>([^<]*(?:<[^>]*>[^<]*)*?)<\/p>/i);
    const buttonText = firstPMatch ? firstPMatch[1].replace(/<[^>]*>/g, '').trim() : 'Text Version of the Visual';
    const transcriptContent = cleanContent.replace(/<p[^>]*>[^<]*(?:<[^>]*>[^<]*)*?<\/p>\s*/, '').trim();
    
    return `<details name="text1">
<summary>${buttonText}</summary>
<div class="article">
<div class="articleInner">
${transcriptContent}
</div>
</div>
</details>`;
  }
};
```

## 7. Development Workflow

### Building the Workflow
```bash
npm run build          # Generate cmp-document-converter.json
npm run build:watch    # Watch for changes and rebuild
npm run validate       # Validate generated JSON
```

### Git Workflow
1. Edit modular JavaScript files
2. Run build script to generate JSON
3. Commit both source files and generated JSON
4. Generated JSON remains n8n-compatible

## 8. Benefits Summary

- **Maintainability**: Easy to find and modify specific functionality
- **Collaboration**: Multiple developers can work on different parts
- **Testing**: Individual functions can be unit tested
- **Documentation**: Each module can have focused documentation
- **Reusability**: Common utilities can be shared across nodes
- **Version Control**: Meaningful diffs and reduced conflicts

## 9. Next Steps

1. **Assess current workflow size**: Measure complexity of each node
2. **Start with Generate HTML Files node**: Extract the most complex logic first
3. **Create build system**: Implement the file replacement mechanism
4. **Gradual migration**: Move one node at a time to avoid breaking changes
5. **Add development tools**: Linting, formatting, and validation

## 10. Considerations

- **Build step required**: Developers must run build before testing
- **Two sources of truth**: Source files and generated JSON must stay in sync
- **n8n compatibility**: Generated JSON must remain fully compatible
- **Learning curve**: Team needs to understand the new structure

This modularization will significantly improve the maintainability and scalability of the workflow codebase.