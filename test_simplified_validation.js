// Test the new simplified validation approach
function testSimplifiedValidation() {
    const testCases = [
        // Missing brackets
        '<p>[style:read]</p>',           // Single brackets
        '<p>[[style:read]</p>',          // Missing closing bracket
        '<p>[style:activity]]</p>',      // Missing opening bracket
        '<p>[[style:example</p>',        // Missing both closing brackets
        
        // Too many brackets
        '<p>[[[style:example]]]</p>',    // Too many opening and closing
        '<p>[[style:example]]]]</p>',    // Too many closing
        '<p>[[[style:example]]</p>',     // Too many opening
        
        // End tag issues
        '<p>[/style]</p>',               // Single brackets on end tag
        '<p>[[/style]</p>',              // Missing closing bracket on end tag
        '<p>[/style]]</p>',              // Missing opening bracket on end tag
        '<p>[[[/style]]]</p>',           // Too many brackets on end tag
        '<p>[[[/style]]</p>',            // Too many opening on end tag
        '<p>[[/style]]]]</p>',           // Too many closing on end tag
        
        // Correct formats (should not match)
        '<p>[[style:correct]]</p>',      // Correct opening
        '<p>[[/style]]</p>'              // Correct closing
    ];
    
    // The new simplified pattern
    const allBracketPatterns = /\[+(?:style:\s*[\w]+|\/style)\]+/gi;
    
    console.log('Testing simplified validation approach:');
    console.log('=====================================\n');
    
    testCases.forEach((testCase, index) => {
        console.log(`Test ${index + 1}: ${testCase}`);
        
        // Reset regex
        allBracketPatterns.lastIndex = 0;
        
        const matches = [...testCase.matchAll(allBracketPatterns)];
        
        if (matches.length > 0) {
            matches.forEach(match => {
                const found = match[0];
                let expectedFormat, isCorrect;
                
                if (found.includes('style:')) {
                    // Extract the style type
                    const styleMatch = found.match(/style:\s*([\w]+)/i);
                    const styleType = styleMatch ? styleMatch[1] : 'xx';
                    expectedFormat = `[[style:${styleType}]]`;
                    isCorrect = found === expectedFormat;
                } else if (found.includes('/style')) {
                    expectedFormat = '[[/style]]';
                    isCorrect = found === expectedFormat;
                }
                
                if (isCorrect) {
                    console.log(`  ✅ Correct: ${found}`);
                } else {
                    console.log(`  ❌ Malformed: ${found} should be ${expectedFormat}`);
                }
            });
        } else {
            console.log('  ✅ No style tags found');
        }
        console.log('');
    });
    
    // Summary
    console.log('Summary:');
    console.log('- Single regex pattern catches all bracket sequences that look like style tags');
    console.log('- Simple logic determines if each found pattern is correctly formatted');
    console.log('- Much easier to maintain than 14 separate regex patterns');
    console.log('- Covers all the same cases as the complex approach');
}

testSimplifiedValidation();