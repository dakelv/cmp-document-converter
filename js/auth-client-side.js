// Client-side authentication for CMP Document Converter
// This is a temporary solution until server-side authentication is properly configured

class ClientSideAuth {
    constructor() {
        // Hash the access codes for basic security (not cryptographically secure, but better than plain text)
        this.validCodeHashes = [
            this.simpleHash('J1an9xi!'),    // Primary access code
            this.simpleHash('CMP-2025'),    // Secondary access code
            this.simpleHash('Test-2025')    // Testing/backup access code
        ];
    }

    // Simple hash function (not cryptographically secure, but obscures the codes)
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(36); // Convert to base36 string
    }

    // Validate access code
    validateCode(code) {
        if (!code || typeof code !== 'string') {
            return false;
        }

        const codeHash = this.simpleHash(code.trim());
        const isValid = this.validCodeHashes.includes(codeHash);
        
        // Log attempt (for debugging)
        console.log(`🔍 Authentication attempt: ${isValid ? 'SUCCESS' : 'FAILED'}`);
        
        return isValid;
    }

    // Check if user is already authenticated
    isAuthenticated() {
        const storedHash = localStorage.getItem('cmp_auth_hash');
        return storedHash && this.validCodeHashes.includes(storedHash);
    }

    // Store authentication
    setAuthenticated(code) {
        const codeHash = this.simpleHash(code.trim());
        localStorage.setItem('cmp_auth_hash', codeHash);
        localStorage.setItem('cmp_auth_time', Date.now().toString());
    }

    // Clear authentication
    clearAuthentication() {
        localStorage.removeItem('cmp_auth_hash');
        localStorage.removeItem('cmp_auth_time');
    }

    // Check if authentication has expired (optional - 24 hours)
    isAuthenticationExpired() {
        const authTime = localStorage.getItem('cmp_auth_time');
        if (!authTime) return true;
        
        const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
        return (Date.now() - parseInt(authTime)) > twentyFourHours;
    }
}

// Global authentication instance
window.cmpAuth = new ClientSideAuth();