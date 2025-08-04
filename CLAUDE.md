# N8N CMP Document Converter - Project Context

## PROJECT STRUCTURE ✅

**Working Directory**: `cmp-document-converter-github/` ⭐ **THIS IS THE CURRENT WORKING FOLDER** ⭐
**Symbolic Link**: `~/projects/my-project/n8n-cmp-workflow` → `cmp-document-converter-github/`
**Project Management**: GitHub version control
**Main Files**: `cmp-document-converter.json` + `cmp-doc-converter.html`
**Documentation**: `docs/` subfolder

⚠️ **CRITICAL**: Always work in the `cmp-document-converter-github` folder, not the root project folder.
📍 **PERMANENT ACCESS**: Use symbolic link `~/projects/my-project/n8n-cmp-workflow/` for direct access.

## CURRENT STATUS: PRODUCTION READY ✅

**Date**: July 2025
**Project**: Automated CMP workflow for Saskatchewan Polytechnic course development
**Status**: Daily production use - all features complete

## WHAT IT DOES

Converts Word documents into individual HTML files ready for Brightspace LMS:

1. **Input**: HTML document (converted from Word via Pandoc)
2. **Processing**: N8N workflow splits into sections and applies styling
3. **Output**: Individual HTML files + request tables file
4. **Result**: Ready for LMS upload

## TECHNICAL ARCHITECTURE

### N8N Workflow (5 Nodes)
```
Webhook → Process Upload → Parse Sections → Generate HTML → Response
```

### Key Features
- **Section Detection**: H1-based parsing (e.g., `3.1.2` → `03_01_02.html`)
- **Style Processing**: 15+ style types for activities, discussions, references
- **Request Extraction**: Media requests to separate file with placeholders
- **Validation**: Comprehensive error handling and content limits
- **Saskatchewan Polytechnic Styling**: External CSS integration

## STYLE SYSTEM

### Activity Styles (Sand/Green)
- `[[style:read]]`, `[[style:watch]]`, `[[style:activity]]`, `[[style:assignment]]` → Sand boxes
- `[[style:discussion]]`, `[[style:post]]` → Green boxes

### Specialized Styles
- `[[style:reference]]` → Reference accordion
- `[[style:image]]` → Figure with citation
- `[[style:imageleft]]`, `[[style:imageright]]` → Floating images
- `[[style:transcript]]` → Collapsible text
- `[[style:standout]]`, `[[style:callout]]` → Standout boxes
- `[[style:calloutRight]]` → Right sidebar
- `[[style:note]]` → CMP notes placeholder
- `[[style:request]]` → Media requests (extracted)

## PRODUCTION FILES

**Main Workflow**: `cmp-document-converter.json`
- Kiro's enhanced validation system
- Comprehensive error handling
- All style types implemented
- Production safety limits active

**HTML Interface**: `cmp-doc-converter.html`
- Professional 3-step workflow
- TAR archive downloads
- Saskatchewan Polytechnic theme

## CRITICAL TECHNICAL NOTES

### Content Limits (Active)
- **HTML Content**: 10MB maximum
- **Section Content**: 5MB per section
- **H1 Sections**: 100 maximum
- **Request Sections**: 50 maximum
- **Title Length**: 200 characters maximum

### Development Rules
1. **JSON Validation**: Always validate syntax before testing
2. **Single Source**: Work only on `cmp-document-converter.json`
3. **Variable Scope**: Switch statements share scope - unique names required
4. **Archive Protocol**: Archive old versions to maintain clean project

### Webhook URL Format
`https://learningtechnologies.app.n8n.cloud/webhook/cmp-document-upload`

## WORKFLOW PROCESS

1. **Word → HTML**: Manual conversion using Pandoc
2. **Upload**: Use `cmp-doc-converter.html` interface
3. **Processing**: Client-side error checking to ensure style tags are matched. N8N workflow handles sections and styling
4. **Download**: Individual files + request tables
5. **LMS Upload**: Files ready for Brightspace

## STAKEHOLDERS

- **SME**: Content provider
- **ID**: Creates CMP-ready documents, converts Word to HTML
- **CMP**: Uploads HTML, receives sectioned files for LMS

## SUCCESS METRICS

✅ **Complete Automation**: Word to LMS-ready files
✅ **Zero Regressions**: All features working perfectly
✅ **Production Ready**: Daily use at Saskatchewan Polytechnic
✅ **Comprehensive Validation**: Robust error handling active
✅ **All Style Types**: 15+ styling options implemented

**Status**: COMPLETE SUCCESS - Ready for daily production use