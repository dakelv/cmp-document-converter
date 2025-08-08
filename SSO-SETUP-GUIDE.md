# SSO Setup Guide for CMP Document Converter

## 🎯 Overview
This guide will help you configure Azure AD/Entra ID Single Sign-On (SSO) for the CMP Document Converter application.

## 📋 Prerequisites
- Azure AD/Entra ID admin access
- Saskatchewan Polytechnic tenant access
- Ability to register applications in Azure

## 🔧 Azure Configuration Steps

### Step 1: Register Application in Azure
1. Go to **Azure Portal** (portal.azure.com) → **Azure Active Directory** → **App registrations**
2. Click **"New registration"**
3. Fill in the details:
   - **Name**: `CMP Document Converter`
   - **Supported account types**: `Accounts in this organizational directory only (Saskatchewan Polytechnic only)`
   - **Redirect URI**: 
     - Type: `Web`
     - URL: `https://ltxr.saskpolytech.ca/apps/cmp/cmp-doc-converter.html`
4. Click **"Register"**
5. **You'll now be on your app's Overview page** - this is where you'll find the left sidebar menu

### Step 2: Configure Authentication
1. **After creating your app registration**, you'll be on the app's overview page
2. In the **left sidebar menu**, look for and click **"Authentication"** (under the "Manage" section)

#### **Important: Use the "Old Experience"**
3. **At the top of the Authentication page**, you'll see an option to **"switch to the old experience"**
4. **Click "switch to the old experience"** - this provides a more complete interface with visible Save buttons

#### **Configure Authentication Settings (Old Experience)**
5. **Redirect URIs**: Should already show `https://ltxr.saskpolytech.ca/apps/cmp/cmp-doc-converter.html`
6. **Front-channel logout URL**: Enter `https://ltxr.saskpolytech.ca/apps/cmp/`
7. **Implicit grant and hybrid flows** - Check both boxes:
   - ✅ **Access tokens** (used for implicit flows)
   - ✅ **ID tokens** (used for implicit and hybrid flows)
8. **Supported account types**: Should be "Accounts in this organizational directory only (Saskatchewan Polytechnic only - Single tenant)"
9. **Click "Save"** at the top of the page

#### **Why Use Old Experience?**
The new Azure portal interface sometimes has missing Save buttons or incomplete functionality. The old experience is more reliable for configuration tasks.

### Step 3: Configure API Permissions
1. Go to **API permissions** (left sidebar)
2. You should see **User.Read** already configured
3. **Click "Add a permission"**
4. **Click "Microsoft Graph"**
5. **Click "Delegated permissions"**
6. **Search for and add these permissions**:
   - `openid` (Sign users in)
   - `profile` (View users' basic profile)
   - `email` (View users' email address)
7. **Click "Add permissions"**

#### **Admin Consent (Usually Not Required)**
8. **Check the "Admin consent required" column** for all permissions
9. **If all show "No"**: Great! Users can consent themselves during login
10. **If any show "Yes"**: Click **"Grant admin consent for Saskatchewan Polytechnic"**

#### **Final Result Should Show:**
- Microsoft Graph (4 permissions)
  - openid - No admin consent required
  - profile - No admin consent required  
  - email - No admin consent required
  - User.Read - No admin consent required

### Step 4: Create Client Secret (Optional)
1. Go to **Certificates & secrets**
2. Click **"New client secret"**
3. Add description: `CMP Document Converter Secret`
4. Set expiration: `24 months`
5. **Copy the secret value** (you won't see it again!)

### Step 5: Note Important Values
1. **Go to "Overview"** in the left sidebar
2. **Copy these values** (you'll need them for code configuration):
   - **Application (client) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
   - **Directory (tenant) ID**: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
3. **Client secret**: Only needed if using server-side token exchange (optional)

## 💻 Code Configuration

### Step 1: Update SSO Configuration
Edit `js/sso-config.js` and fill in your Azure values:

```javascript
const SSO_CONFIG = {
    // Your Azure App Registration Client ID
    clientId: '527b7156-9743-4b1d-a824-bd840e8ea699',
    
    // Your Azure tenant authority URL
    authority: 'https://login.microsoftonline.com/a9531b3d-965b-4eb8-8c10-a8f55a606e94',
    
    // Your application URL
    redirectUri: 'https://ltxr.saskpolytech.ca/apps/cmp/cmp-doc-converter.html',
    
    // Tenant ID (same as in authority URL)
    tenantId: 'a9531b3d-965b-4eb8-8c10-a8f55a606e94',
    
    // Keep these as-is unless you need different scopes
    scopes: [
        'openid',
        'profile', 
        'email',
        'User.Read'
    ],
    
    // Update with your organization's domain
    allowedDomains: [
        'saskpolytech.ca'
    ]
};
```

### Step 2: Update Server-Side Token Exchange (Optional)
If using server-side token exchange, edit `api/sso-token-exchange.aspx`:

```csharp
// Update these values
string clientId = "your-client-id";
string clientSecret = "your-client-secret"; // if using client secret
string tenantId = "your-tenant-id";
```

## 🧪 Testing Steps

### Step 1: Test Authentication Flow
1. Open the application in a browser
2. Should redirect to Microsoft login page
3. Sign in with Saskatchewan Polytechnic account
4. Should redirect back to application
5. Should show user name in top-right corner

### Step 2: Test Domain Validation
1. Try signing in with non-saskpolytech.ca email
2. Should be rejected with appropriate error message

### Step 3: Test Logout
1. Click logout button in top-right
2. Should redirect to Microsoft logout
3. Should clear all authentication data

## 🔍 Troubleshooting

### Common Issues:

#### "Can't find Save button in Azure portal"
- **Solution**: Switch to the "old experience" - look for this option at the top of the page
- **Why**: The new Azure portal interface sometimes has missing or hidden Save buttons

#### "AADSTS50011: The reply URL specified in the request does not match"
- **Solution**: Check that redirect URI in Azure matches exactly: `https://ltxr.saskpolytech.ca/apps/cmp/cmp-doc-converter.html`

#### "AADSTS700016: Application not found in directory"
- **Solution**: Verify client ID is correct and app is registered in the right tenant

#### "AADSTS65001: The user or administrator has not consented"
- **Solution**: Grant admin consent for the required permissions in Azure

#### User gets "Access Denied" after successful login
- **Solution**: Check domain validation in `sso-auth.js` - user's email domain must be in `allowedDomains` array

### Debug Mode:
Open browser console (F12) to see detailed authentication logs:
- `🔐 Checking SSO authentication...`
- `✅ SSO Authentication successful: [User Name]`
- `❌ SSO Authentication required`

## 📚 Additional Resources
- [Microsoft Identity Platform Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/)
- [Azure AD App Registration Guide](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-register-app)
- [MSAL.js Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/msal-overview)

## 🎯 Next Steps After Setup
1. Test with multiple users
2. Configure user groups/roles if needed
3. Set up monitoring and logging
4. Plan for certificate/secret rotation
5. Document user onboarding process

---

**Need Help?** Contact Learning Technologies team for assistance with Azure configuration or troubleshooting.