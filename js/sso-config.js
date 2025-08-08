// SSO Configuration for Azure AD/Entra ID
// Update these values when Azure SSO is configured

const SSO_CONFIG = {
    // Azure App Registration details (to be filled tomorrow)
    clientId: '527b7156-9743-4b1d-a824-bd840e8ea699', // Your Azure App Registration Client ID
    authority: 'https://login.microsoftonline.com/a9531b3d-965b-4eb8-8c10-a8f55a606e94', // Your tenant authority URL

    // Redirect URI (should match what's registered in Azure)
    redirectUri: 'https://ltxr.saskpolytech.ca/apps/cmp/cmp-doc-converter.html',

    // Scopes to request from Azure
    scopes: [
        'openid',
        'profile',
        'email',
        'User.Read' // Microsoft Graph API scope for user info
    ],

    // Optional: Specific tenant restriction
    // If you want to restrict to Saskatchewan Polytechnic only
    tenantId: 'a9531b3d-965b-4eb8-8c10-a8f55a606e94', // Your organization's tenant ID

    // Domain validation (users must have email from these domains)
    allowedDomains: [
        'saskpolytech.ca',
        // Add other allowed domains here
    ],

    // Optional: Specific user groups or roles
    // These would be configured in Azure AD
    requiredRoles: [
        // 'CMP-Users',
        // 'Learning-Technologies'
    ],

    // Application settings
    app: {
        name: 'CMP Document Converter',
        version: '2.5.0',
        releaseDate: '2025-08-08',
        environment: 'production' // or 'development', 'staging'
    }
};

// Apply configuration to SSO Auth instance
if (window.ssoAuth) {
    window.ssoAuth.config = {
        clientId: SSO_CONFIG.clientId,
        authority: SSO_CONFIG.authority,
        redirectUri: SSO_CONFIG.redirectUri,
        scopes: SSO_CONFIG.scopes
    };
}

// Export for use in other modules
window.SSO_CONFIG = SSO_CONFIG;