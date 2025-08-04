// Debug the "too many brackets" patterns specifically
function testTooManyBrackets() {
    const testCases = [
        '<p>[[[style:example]]]</p>',     // Too many opening brackets
        '<p>[[style:example]]]]</p>',     // Too many closing brackets  
        '<p>[[[/style]]]</p>',           // Too many opening brackets on end tag
        '<p>[[/style]]]]</p>',           // Too many closing brackets on end tag
        '<p>[[style:correct]]</p>',      // Correct format (should not match)
        '<p>[[/style]]</p>'              // Correct format (should not match)
    ];
    
    // Test the "too many brackets" patterns specifically
    const tooManyPatterns = [
        /\[\[\[+style:\s*[\w]+\]\]\]/gi,      // [[[style:xx]]] - too many opening brackets
        /\[\[style:\s*[\w]+\]\]\]+/gi,        // [[style:xx]]]] - too many closing brackets
        /\[\[\[+\/style\]\]\]/gi,             // [[[/style]]] - too many opening brackets on end tag
        /\[\[\/style\]\]\]+/gi                // [[/style]]]] - too many closing brackets on end tag
    ];
    
    console.log('Testing "too many brackets" patterns:');
    
    testCases.forEach((testCase, index) => {
        console.log(`\nTest ${index + 1}: ${testCase}`);
        let foundError = false;
        
        tooManyPatterns.forEach((pattern, patternIndex) => {
            // Reset regex lastIndex to avoid issues with global flag
            pattern.lastIndex = 0;
            const matches = testCase.match(pattern);
            if (matches) {
                console.log(`  ❌ Pattern ${patternIndex + 8} matched: ${matches[0]}`);
                foundError = true;
            }
        });
        
        if (!foundError) {
            console.log('  ✅ No "too many brackets" errors found');
        }
    });
    
    // Also test individual patterns more carefully
    console.log('\n--- Individual Pattern Testing ---');
    
    const testString = '<p>[[[style:example]]]</p>';
    console.log(`Testing: ${testString}`);
    
    const pattern1 = /\[\[\[+style:\s*[\w]+\]\]\]/gi;
    const match1 = pattern1.exec(testString);
    console.log('Pattern 1 result:', match1);
    
    const pattern2 = /\[\[\[style:\s*[\w]+\]\]\]/gi; // Simplified version
    const match2 = pattern2.exec(testString);
    console.log('Pattern 2 (simplified) result:', match2);
}

testTooManyBrackets();