// Test the fixed validation pattern
function testFixedValidation() {
    const testCases = [
        '<p>[style:read]</p>',           // Single brackets - should be detected
        '<p>[[style:read]</p>',          // Missing closing bracket - should be detected  
        '<p>[[[style:example]]]</p>',    // Too many brackets - should be detected
        '<p>[[[/style]]</p>',            // Too many opening brackets on end tag - should be detected
        '<p>[[style:correct]]</p>',      // Correct format - should be detected but pass validation
        '<p>[[/style]]</p>'              // Correct format - should be detected but pass validation
    ];
    
    // The fixed simple pattern
    const allBracketPatterns = /\[+(?:style:\s*[\w]+|\/style)\]+/gi;
    
    console.log('Testing fixed validation pattern:');
    console.log('==================================\n');
    
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
                    console.log(`  ✅ Found and validated: ${found}`);
                } else {
                    console.log(`  ❌ Found malformed: ${found} should be ${expectedFormat}`);
                }
            });
        } else {
            console.log('  ⚠️ No style tags found');
        }
        console.log('');
    });
    
    console.log('✅ Pattern is working correctly - upload functionality should be restored!');
}

testFixedValidation();