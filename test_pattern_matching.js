// Test if our malformed patterns are working
function testPatternMatching() {
    const testHTML = `
        <p>[[style:read]</p>
        <p>[style:activity]]</p>
        <p>[[style:example</p>
        <p>[[/style]</p>
        <p>[/style]]</p>
        <p>[[/style</p>
        <p>[[[style:toomany]]]</p>
        <p>[[style:toomany]]]]</p>
        <p>[[[/style]]]</p>
        <p>[[/style]]]]</p>
        <p>[[style:correct]]</p>
        <p>[[/style]]</p>
    `;

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
        /\[\[\[+\/style\]\]\]/gi,             // [[[/style]]] - too many opening brackets on end tag
        /\[\[\/style\]\]\]+/gi                // [[/style]]]] - too many closing brackets on end tag
    ];

    console.log('Testing pattern matching on HTML content:');
    console.log(testHTML);
    console.log('\n--- Results ---');

    let totalMatches = 0;
    malformedPatterns.forEach((pattern, index) => {
        const matches = [...testHTML.matchAll(pattern)];
        if (matches.length > 0) {
            console.log(`Pattern ${index}: Found ${matches.length} matches`);
            matches.forEach(match => {
                console.log(`  - "${match[0]}" at position ${match.index}`);
            });
            totalMatches += matches.length;
        } else {
            console.log(`Pattern ${index}: No matches`);
        }
    });

    console.log(`\nTotal malformed patterns found: ${totalMatches}`);
    
    // Also test what the opening/closing tag detection would find
    const openingPattern = /\[\[style:\s*([\w]+)\]\]/gi;
    const closingPattern = /\[\[\/style\]\]/gi;
    
    const openingMatches = [...testHTML.matchAll(openingPattern)];
    const closingMatches = [...testHTML.matchAll(closingPattern)];
    
    console.log(`\nValid opening tags found: ${openingMatches.length}`);
    console.log(`Valid closing tags found: ${closingMatches.length}`);
    
    openingMatches.forEach(match => {
        console.log(`  - Opening: "${match[0]}"`);
    });
    
    closingMatches.forEach(match => {
        console.log(`  - Closing: "${match[0]}"`);
    });
}

testPatternMatching();