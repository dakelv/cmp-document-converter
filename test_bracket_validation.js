// Test the missing bracket detection
function testMissingBrackets() {
    const testCases = [
        '<p>[[style:read]</p>',      // Missing closing bracket
        '<p>[style:activity]]</p>',   // Missing opening bracket  
        '<p>[[style:example</p>',     // Missing both closing brackets
        '<p>[[/style]</p>',          // Missing closing bracket on end tag
        '<p>[/style]]</p>',          // Missing opening bracket on end tag
        '<p>[[/style</p>',           // Missing both closing brackets on end tag
        '<p>[[style:correct]]</p>',   // Correct format
        '<p>[[/style]]</p>'          // Correct format
    ];
    
    // Test patterns (updated to match the fixed version)
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
        /(?<!\[)\[\/style\](?!\])/gi         // [/style] - only single brackets
    ];
    
    console.log('Testing missing bracket detection:');
    
    testCases.forEach((testCase, index) => {
        console.log(`\nTest ${index + 1}: ${testCase}`);
        let foundError = false;
        
        malformedPatterns.forEach((pattern, patternIndex) => {
            const matches = testCase.match(pattern);
            if (matches) {
                console.log(`  ❌ Pattern ${patternIndex} matched: ${matches[0]}`);
                foundError = true;
            }
        });
        
        if (!foundError) {
            console.log('  ✅ No errors found');
        }
    });
}

// Run the test
testMissingBrackets();