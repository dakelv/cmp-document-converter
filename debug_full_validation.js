// Test the exact validation logic with the same HTML content
function debugFullValidation() {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <title>Test Triple Brackets</title>
</head>
<body>
    <p>[[style:example]]</p>
    <p>Some content here</p>
    <p>[[[/style]]</p>
</body>
</html>`;

    console.log('Testing full validation with HTML content...\n');

    // Test the exact patterns from the validation function
    const malformedPatterns = [
        // Missing closing bracket: [[style:xx] (not followed by another ])
        /\[\[style:\s*[\w]+\](?!\])/gi,

        // Missing opening bracket: [style:xx]] (not preceded by another [)
        /(?<!\[)\[style:\s*[\w]+\]\]/gi,

        // Missing both closing brackets: [[style:xx (followed by < or end of string, not ]])
        /\[\[style:\s*[\w]+(?!\]\])(?=<|$)/gi,

        // Missing closing bracket on end tag: [[/style] (not followed by ])
        /\[\[\/style\](?!\])/gi,

        // Missing opening bracket on end tag: [/style]] (not preceded by [)
        /(?<!\[)\[\/style\]\]/gi,

        // Missing both closing brackets on end tag: [[/style (followed by < or end of string, not ]])
        /\[\[\/style(?!\]\])(?=<|$)/gi,

        // Single bracket patterns (legacy)
        /(?<!\[)\[style:\s*[\w]+\](?!\])/gi, // [style:xx] - only single brackets
        /(?<!\[)\[\/style\](?!\])/gi,        // [/style] - only single brackets

        // Too many brackets patterns
        /\[\[\[+style:\s*[\w]+\]\]\]/gi,      // [[[style:xx]]] - too many opening brackets
        /\[\[style:\s*[\w]+\]\]\]+/gi,        // [[style:xx]]]] - too many closing brackets
        /\[\[\[+style:\s*[\w]+\]\]/gi,        // [[[style:xx]] - too many opening, correct closing
        /\[\[\[+\/style\]\]\]/gi,             // [[[/style]]] - too many opening brackets on end tag
        /\[\[\[+\/style\]\]/gi,               // [[[/style]] - too many opening, correct closing on end tag
        /\[\[\/style\]\]\]+/gi                // [[/style]]]] - too many closing brackets on end tag
    ];

    const bracketErrors = [];

    malformedPatterns.forEach((pattern, index) => {
        console.log(`Testing pattern ${index}...`);
        let match;
        let matchCount = 0;
        
        // Reset the regex
        pattern.lastIndex = 0;
        
        while ((match = pattern.exec(htmlContent)) !== null) {
            matchCount++;
            console.log(`  Match ${matchCount}: "${match[0]}" at position ${match.index}`);
            
            // Get line number (simplified)
            const beforeMatch = htmlContent.substring(0, match.index);
            const lineNumber = beforeMatch.split('\n').length;
            
            let errorType, expectedFormat;
            switch (index) {
                case 0: errorType = 'missing_closing_bracket'; expectedFormat = '[[style:xx]]'; break;
                case 1: errorType = 'missing_opening_bracket'; expectedFormat = '[[style:xx]]'; break;
                case 2: errorType = 'missing_both_closing_brackets'; expectedFormat = '[[style:xx]]'; break;
                case 3: errorType = 'missing_closing_bracket_end'; expectedFormat = '[[/style]]'; break;
                case 4: errorType = 'missing_opening_bracket_end'; expectedFormat = '[[/style]]'; break;
                case 5: errorType = 'missing_both_closing_brackets_end'; expectedFormat = '[[/style]]'; break;
                case 6: errorType = 'single_brackets_opening'; expectedFormat = '[[style:xx]]'; break;
                case 7: errorType = 'single_brackets_closing'; expectedFormat = '[[/style]]'; break;
                case 8: errorType = 'too_many_opening_brackets'; expectedFormat = '[[style:xx]]'; break;
                case 9: errorType = 'too_many_closing_brackets'; expectedFormat = '[[style:xx]]'; break;
                case 10: errorType = 'too_many_opening_correct_closing'; expectedFormat = '[[style:xx]]'; break;
                case 11: errorType = 'too_many_opening_brackets_end'; expectedFormat = '[[/style]]'; break;
                case 12: errorType = 'too_many_opening_correct_closing_end'; expectedFormat = '[[/style]]'; break;
                case 13: errorType = 'too_many_closing_brackets_end'; expectedFormat = '[[/style]]'; break;
            }

            bracketErrors.push({
                type: errorType,
                message: `Malformed style tag: ${match[0]} should be ${expectedFormat}`,
                position: match.index,
                line: lineNumber,
                found: match[0],
                expected: expectedFormat
            });
        }
        
        if (matchCount === 0) {
            console.log(`  No matches found`);
        }
    });

    console.log(`\n--- Summary ---`);
    console.log(`Total bracket errors found: ${bracketErrors.length}`);
    
    bracketErrors.forEach((error, index) => {
        console.log(`${index + 1}. [${error.type}] ${error.message} at line ${error.line}`);
    });

    // Also test what valid patterns would find
    console.log(`\n--- Valid Pattern Check ---`);
    const validOpeningPattern = /\[\[style:\s*([\w]+)\]\]/gi;
    const validClosingPattern = /\[\[\/style\]\]/gi;
    
    const validOpening = [...htmlContent.matchAll(validOpeningPattern)];
    const validClosing = [...htmlContent.matchAll(validClosingPattern)];
    
    console.log(`Valid opening tags: ${validOpening.length}`);
    validOpening.forEach(match => console.log(`  - ${match[0]}`));
    
    console.log(`Valid closing tags: ${validClosing.length}`);
    validClosing.forEach(match => console.log(`  - ${match[0]}`));
}

debugFullValidation();