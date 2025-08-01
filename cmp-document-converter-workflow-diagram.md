# CMP Document Converter Workflow Diagram

```
CMP Document Converter Workflow
===============================

┌─────────────────────────────────────────────────────────────────────────────┐
│                           INSTRUCTIONAL DESIGNER (ID) PATH                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Step 1:        │    │  Step 2:        │    │  Step 3:        │    │  Step 4:        │
│  Document       │───▶│  Format with    │───▶│  CMP            │───▶│  Quality Check  │
│  Structure      │    │  Style Tags     │    │  Communication  │    │  Before Submit  │
│  Setup          │    │                 │    │  Guidelines     │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
│                      │                      │                      │
│ • Use X.Y.Z          │ • Apply style tags   │ • Use clear         │ • Run through
│   headings (H1)      │   [[style:...]]      │   instructions      │   ID checklist
│ • Follow naming      │ • Format content     │ • No Word comments  │ • Verify structure
│   convention         │ • Add placeholders   │ • Provide context   │ • Check formatting
│                      │                      │                      │
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │   Hand over     │
                                    │   to CMP        │
                                    └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                    COURSE MATERIAL PRODUCTION (CMP) PATH                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Step 1:        │    │  Step 2:        │    │  Step 3:        │    │  Step 4:        │
│  One-Time       │───▶│  Document       │───▶│  Process HTML   │───▶│  Quality Review │
│  Setup          │    │  Conversion     │    │  with Converter │    │  & Finalization │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
│                      │                      │                      │
│ • Install Pandoc     │ • Run Pandoc        │ • Upload to web      │ • Review all files
│ • Setup PowerShell   │   command:          │   converter          │ • Insert media
│   context menu       │   pandoc input.docx │ • Download TAR       │ • Fix broken links
│   (optional)         │   -s -o output.html │   archive            │ • Complete CMP
│                      │   --extract-media=. │ • Extract files      │   checklist
│                      │   --ascii           │ • Copy media folder  │
│                      │                      │                      │
                                              │                      │
                                              ▼                      ▼
                                    ┌─────────────────┐    ┌─────────────────┐
                                    │   Generated:    │    │   Final Result: │
                                    │ • Individual    │    │ • Multiple HTML │
                                    │   HTML files    │    │   files ready   │
                                    │ • Media folder  │    │   for Brightspace│
                                    │ • Request file  │    │ • Proper styling │
                                    └─────────────────┘    │ • Working media  │
                                                          └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              KEY COMPONENTS                                 │
└─────────────────────────────────────────────────────────────────────────────┘

Input:                    Tools:                     Output:
┌─────────────────┐      ┌─────────────────┐       ┌─────────────────┐
│ • LO Word Doc   │      │ • Pandoc        │       │ • Multiple HTML │
│ • With X.Y.Z    │ ───▶ │ • CMP Document  │ ───▶  │   files         │
│   headings      │      │   Converter     │       │ • Media folder  │
│ • Style tags    │      │ • Web interface │       │ • Ready for     │
│ • Formatted     │      │                 │       │   Brightspace   │
│   content       │      │                 │       │                 │
└─────────────────┘      └─────────────────┘       └─────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            CRITICAL NOTES                                   │
└─────────────────────────────────────────────────────────────────────────────┘

⚠️  Files are NOT ready for Brightspace immediately after conversion
⚠️  Must complete full quality review and media insertion
⚠️  Word comments don't convert - use clear instructions instead
⚠️  Always test in actual Brightspace environment after upload
```

## Workflow Summary

This diagram illustrates the complete CMP Document Converter workflow, showing how:

1. **Instructional Designers (IDs)** prepare Learning Outcome Word documents with proper structure and formatting
2. **Course Material Production specialists (CMPs)** convert these documents into multiple HTML files ready for Brightspace
3. The process involves careful preparation, automated conversion tools, and thorough quality review before deployment

### Key Process Steps:

**ID Path (4 steps):**
- Document structure setup with X.Y.Z headings
- Formatting with style tags
- Clear communication guidelines
- Quality check before handover

**CMP Path (4 steps):**
- One-time Pandoc setup
- Document conversion using Pandoc command
- Processing HTML with the web converter
- Quality review and media integration

### Tools Used:
- **Pandoc**: Converts Word documents to HTML
- **CMP Document Converter**: Web interface that splits HTML into individual files
- **PowerShell**: Command-line interface for running Pandoc

### Final Output:
Multiple HTML files with proper styling, working media links, and Learning Technologies global stylesheet, ready for Brightspace upload.