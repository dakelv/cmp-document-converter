// SSO Authentication Module for CMP Document Converter
// Prepared for Azure AD/Entra ID integration

class SSOAuth {
    constructor() {
        this.isAuthenticated = false;
        this.userInfo = null;
        this.accessToken = null;
        this.config = {
            // These will be configured when Azure SSO is set up
            clientId: '', // Azure App Registration Client ID
            authority: '', // Azure tenant authority URL
            redirectUri: window.location.origin,
            scopes: ['openid', 'profile', 'email']
        };
    }

    // Initialize SSO authentication
    async initialize() {
        console.log('🔐 Initializing SSO authentication...');
        
        // Check if SSO is properly configured
        if (!this.config.clientId || !this.config.authority) {
            console.log('⚠️ SSO not configured - missing clientId or authority');
            console.log('Config:', this.config);
            return false;
        }
        
        console.log('✅ SSO configuration loaded:', {
            clientId: this.config.clientId,
            authority: this.config.authority,
            redirectUri: this.config.redirectUri
        });

        // Check if user is already authenticated
        const storedAuth = this.getStoredAuth();
        if (storedAuth && !this.isTokenExpired(storedAuth.expiresAt)) {
            this.isAuthenticated = true;
            this.userInfo = storedAuth.userInfo;
            this.accessToken = storedAuth.accessToken;
            console.log('✅ User already authenticated:', this.userInfo.name);
            return true;
        }

        // Clear expired authentication
        if (storedAuth && this.isTokenExpired(storedAuth.expiresAt)) {
            console.log('⏰ Authentication expired, clearing stored data');
            this.clearAuth();
        }

        // Check for SSO callback (redirect from Azure)
        if (this.isCallback()) {
            return await this.handleCallback();
        }

        // No authentication found
        console.log('❌ No valid authentication found');
        return false;
    }

    // Check if current URL is a callback from Azure
    isCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        return urlParams.has('code') || urlParams.has('access_token') || urlParams.has('id_token') ||
               hashParams.has('access_token') || hashParams.has('id_token');
    }

    // Handle callback from Azure SSO
    async handleCallback() {
        console.log('🔄 Handling SSO callback...');

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const hashParams = new URLSearchParams(window.location.hash.substring(1));
            
            // Handle implicit flow from URL fragment (primary method)
            if (hashParams.has('access_token')) {
                const accessToken = hashParams.get('access_token');
                const idToken = hashParams.get('id_token');
                return await this.processTokens(accessToken, idToken);
            }
            
            // Handle implicit flow from query parameters (fallback)
            if (urlParams.has('access_token')) {
                const accessToken = urlParams.get('access_token');
                const idToken = urlParams.get('id_token');
                return await this.processTokens(accessToken, idToken);
            }
            
            // Handle authorization code flow (if server-side is available)
            if (urlParams.has('code')) {
                const authCode = urlParams.get('code');
                return await this.exchangeCodeForToken(authCode);
            }

            throw new Error('No valid tokens found in callback');

        } catch (error) {
            console.error('❌ SSO callback error:', error);
            this.clearAuth();
            return false;
        }
    }

    // Exchange authorization code for access token
    async exchangeCodeForToken(authCode) {
        console.log('🔄 Exchanging authorization code for tokens...');
        console.log('⚠️ Server-side token exchange not available, using implicit flow fallback');
        
        // For now, we'll skip server-side exchange and rely on implicit flow
        // This is less secure but will work without server-side setup
        return false; // This will trigger the implicit flow fallback
    }

    // Process and validate tokens
    async processTokens(accessToken, idToken) {
        console.log('🔄 Processing SSO tokens...');

        try {
            // Decode and validate ID token (contains user info)
            const userInfo = this.decodeJWT(idToken);

            // Validate token
            if (!this.validateToken(userInfo)) {
                throw new Error('Invalid token or user not authorized');
            }

            // Store authentication
            this.isAuthenticated = true;
            this.userInfo = userInfo;
            this.accessToken = accessToken;

            // Store in localStorage for persistence
            this.storeAuth({
                userInfo: userInfo,
                accessToken: accessToken,
                expiresAt: Date.now() + (userInfo.exp * 1000) // Convert to milliseconds
            });

            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);

            console.log('✅ SSO authentication successful:', userInfo.name);
            return true;

        } catch (error) {
            console.error('❌ Token processing error:', error);
            return false;
        }
    }

    // Initiate SSO login
    login() {
        console.log('🚀 Initiating SSO login...');

        // Construct Azure authorization URL
        const authUrl = new URL(`${this.config.authority}/oauth2/v2.0/authorize`);
        authUrl.searchParams.set('client_id', this.config.clientId);
        authUrl.searchParams.set('response_type', 'id_token token');
        authUrl.searchParams.set('redirect_uri', this.config.redirectUri);
        authUrl.searchParams.set('scope', this.config.scopes.join(' '));
        authUrl.searchParams.set('response_mode', 'fragment');
        authUrl.searchParams.set('state', this.generateState());
        authUrl.searchParams.set('nonce', this.generateNonce());

        // Redirect to Azure for authentication
        window.location.href = authUrl.toString();
    }

    // Logout user
    logout() {
        console.log('🔓 Logging out user...');

        this.clearAuth();

        // Construct Azure logout URL
        const logoutUrl = new URL(`${this.config.authority}/oauth2/v2.0/logout`);
        logoutUrl.searchParams.set('post_logout_redirect_uri', window.location.origin);

        // Redirect to Azure for logout
        window.location.href = logoutUrl.toString();
    }

    // Clear authentication data
    clearAuth() {
        this.isAuthenticated = false;
        this.userInfo = null;
        this.accessToken = null;
        localStorage.removeItem('sso_auth');
        sessionStorage.removeItem('sso_state');
    }

    // Store authentication data
    storeAuth(authData) {
        localStorage.setItem('sso_auth', JSON.stringify(authData));
    }

    // Get stored authentication data
    getStoredAuth() {
        const stored = localStorage.getItem('sso_auth');
        return stored ? JSON.parse(stored) : null;
    }

    // Check if token is expired
    isTokenExpired(expiresAt) {
        return Date.now() >= expiresAt;
    }

    // Decode JWT token (basic implementation)
    decodeJWT(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            return JSON.parse(jsonPayload);
        } catch (error) {
            throw new Error('Invalid JWT token');
        }
    }

    // Validate token and user authorization
    validateToken(userInfo) {
        // Basic validation
        if (!userInfo || !userInfo.email || !userInfo.name) {
            return false;
        }

        // Check if token is expired
        if (userInfo.exp && Date.now() >= userInfo.exp * 1000) {
            return false;
        }

        // Add your organization-specific validation here
        // For example, check if user's email domain is allowed
        const allowedDomains = ['saskpolytech.ca', 'yourdomain.com'];
        const userDomain = userInfo.email.split('@')[1];

        if (!allowedDomains.includes(userDomain)) {
            console.warn('❌ User domain not authorized:', userDomain);
            return false;
        }

        return true;
    }

    // Generate state parameter for security
    generateState() {
        const state = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('sso_state', state);
        return state;
    }

    // Generate nonce parameter for security (required for implicit flow)
    generateNonce() {
        const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        sessionStorage.setItem('sso_nonce', nonce);
        return nonce;
    }

    // Get current user info
    getUserInfo() {
        return this.userInfo;
    }

    // Check if user is authenticated
    isUserAuthenticated() {
        return this.isAuthenticated;
    }
}

// Create global SSO instance
window.ssoAuth = new SSOAuth();