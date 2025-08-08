# SharePoint Integration Plan for CMP Document Converter

## 🎯 Overview
Integrate SharePoint as the primary storage solution for the CMP Document Converter, leveraging existing Azure AD SSO for seamless authentication and enterprise-grade file management.

## 📋 Implementation Phases

### Phase 1: SharePoint Setup & Configuration (Day 1 Morning)

#### **1.1 SharePoint Site Creation**
- **Create dedicated SharePoint site**: `CMP Document Converter`
- **URL**: `https://saskpolytech.sharepoint.com/sites/cmp-document-converter`
- **Permissions**: Restrict to Learning Technologies team + authorized users
- **Site template**: Team site or Communication site

#### **1.2 Document Library Structure**
```
📁 CMP Document Converter (Root)
├── 📁 Uploads/                    # User uploaded files
│   ├── 📁 2025-08/               # Organized by month
│   └── 📁 Archive/               # Older uploads
├── 📁 Processed/                 # Generated HTML files
│   ├── 📁 2025-08/
│   └── 📁 Archive/
├── 📁 Templates/                 # Document templates
└── 📁 Logs/                      # Processing logs
```

#### **1.3 SharePoint App Registration**
- **Register new app** in Azure AD for SharePoint access
- **Required permissions**:
  - `Sites.ReadWrite.All` - Read/write to SharePoint sites
  - `Files.ReadWrite.All` - File operations
  - `User.Read` - User information (already have)

### Phase 2: Microsoft Graph API Integration (Day 1 Afternoon)

#### **2.1 Graph API Client Setup**
```javascript
// js/sharepoint-client.js
class SharePointClient {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.graphEndpoint = 'https://graph.microsoft.com/v1.0';
        this.siteId = 'saskpolytech.sharepoint.com,site-id,web-id';
    }
}
```

#### **2.2 Core SharePoint Operations**
- **Upload files** to SharePoint document library
- **Create folders** with date-based organization
- **Download files** for processing
- **List files** and folders
- **Delete files** (with proper permissions)
- **Get file metadata** and sharing links

#### **2.3 Authentication Enhancement**
- **Extend existing SSO** to include SharePoint permissions
- **Update token scope** to include SharePoint access
- **Handle token refresh** for long-running operations

### Phase 3: File Upload Integration (Day 2 Morning)

#### **3.1 Upload Flow Modification**
```
Current Flow:
User uploads → n8n workflow → Processing → Download

New Flow:
User uploads → SharePoint storage → n8n workflow → Process from SharePoint → Save to SharePoint → Provide links
```

#### **3.2 Upload Implementation**
```javascript
async function uploadToSharePoint(file, userInfo) {
    const folderPath = `/Uploads/${getCurrentMonth()}/${userInfo.name}`;
    const fileName = `${Date.now()}_${file.name}`;
    
    // Create folder if needed
    await sharePointClient.createFolder(folderPath);
    
    // Upload file
    const uploadResult = await sharePointClient.uploadFile(
        folderPath, 
        fileName, 
        file
    );
    
    return uploadResult;
}
```

#### **3.3 Progress Tracking**
- **Upload progress bar** for large files
- **Error handling** for network issues
- **Retry mechanism** for failed uploads

### Phase 4: Processing Integration (Day 2 Afternoon)

#### **4.1 n8n Workflow Updates**
- **Modify n8n workflow** to read from SharePoint instead of direct upload
- **Add SharePoint authentication** to n8n
- **Update processing logic** to save results back to SharePoint

#### **4.2 Processing Flow**
```
1. User uploads file → SharePoint /Uploads/
2. Trigger n8n workflow with SharePoint file URL
3. n8n downloads file from SharePoint
4. Process document (split into HTML files)
5. Upload processed files to SharePoint /Processed/
6. Return SharePoint sharing links to user
```

#### **4.3 File Organization**
```javascript
const processedFolder = `/Processed/${getCurrentMonth()}/${userInfo.name}/${documentName}/`;
// Save individual HTML files:
// - 01-learning-outcome-1.html
// - 02-learning-outcome-2.html
// - media-requests.html
// - processing-log.txt
```

### Phase 5: User Interface Updates (Day 3 Morning)

#### **5.1 File Management UI**
- **File browser** showing user's uploaded files
- **Processing history** with status indicators
- **Download links** for processed files
- **Delete functionality** for old files

#### **5.2 SharePoint Integration Features**
```html
<!-- New UI sections -->
<div class="sharepoint-files">
    <h3>📁 Your Files</h3>
    <div class="file-list">
        <!-- List of user's files from SharePoint -->
    </div>
</div>

<div class="processing-history">
    <h3>📋 Processing History</h3>
    <div class="history-list">
        <!-- Previous processing jobs -->
    </div>
</div>
```

#### **5.3 Enhanced User Experience**
- **Drag & drop** directly to SharePoint
- **File preview** before processing
- **Sharing options** for processed files
- **Collaborative features** (if needed)

### Phase 6: Security & Permissions (Day 3 Afternoon)

#### **6.1 Access Control**
- **User-specific folders** (users only see their own files)
- **Admin access** for Learning Technologies team
- **Audit logging** for file operations
- **Data retention policies**

#### **6.2 Security Implementation**
```javascript
// Ensure users can only access their own files
const userFolder = `/Uploads/${userInfo.upn}/`; // Use UPN for unique identification
const allowedPaths = [
    userFolder,
    `/Processed/${userInfo.upn}/`,
    `/Templates/` // Read-only access to templates
];
```

## 🔧 Technical Implementation Details

### **Required Dependencies**
```javascript
// New JavaScript modules
- js/sharepoint-client.js     // SharePoint API wrapper
- js/file-manager.js          // File management UI
- js/graph-api.js            // Microsoft Graph API client
```

### **Configuration Updates**
```javascript
// js/sso-config.js - Add SharePoint scopes
scopes: [
    'openid',
    'profile', 
    'email',
    'User.Read',
    'Sites.ReadWrite.All',    // NEW: SharePoint access
    'Files.ReadWrite.All'     // NEW: File operations
]
```

### **API Endpoints Needed**
```
GET /sites/{site-id}/drive/items/{item-id}           # Get file info
POST /sites/{site-id}/drive/items/{parent-id}/children # Upload file
PUT /sites/{site-id}/drive/items/{item-id}/content   # Update file
DELETE /sites/{site-id}/drive/items/{item-id}        # Delete file
GET /sites/{site-id}/drive/root/children             # List files
```

## 📊 Benefits of SharePoint Integration

### **For Users**
- **Persistent storage** - Files don't disappear after processing
- **File history** - Access to previously processed documents
- **Collaboration** - Share files with team members
- **Enterprise backup** - Files backed up by SharePoint
- **Mobile access** - Access files from SharePoint mobile app

### **For Administrators**
- **Centralized storage** - All files in one managed location
- **Audit trails** - Complete logging of file operations
- **Compliance** - Meets enterprise data governance requirements
- **Backup & recovery** - Enterprise-grade data protection
- **Usage analytics** - Insights into tool usage patterns

### **For System**
- **Scalability** - SharePoint handles large files and many users
- **Reliability** - Enterprise-grade uptime and performance
- **Integration** - Seamless with existing Microsoft ecosystem
- **Security** - Leverages existing Azure AD security policies

## 🧪 Testing Strategy

### **Phase 1 Testing**
- [ ] SharePoint site creation and permissions
- [ ] Document library structure
- [ ] Basic file upload/download via Graph API

### **Phase 2 Testing**
- [ ] Authentication with SharePoint scopes
- [ ] File operations (CRUD) via Microsoft Graph
- [ ] Error handling and retry logic

### **Phase 3 Testing**
- [ ] End-to-end file upload to SharePoint
- [ ] Integration with existing n8n workflow
- [ ] File organization and naming conventions

### **Phase 4 Testing**
- [ ] Complete processing workflow
- [ ] User interface functionality
- [ ] Performance with large files

### **Phase 5 Testing**
- [ ] Security and access control
- [ ] Multi-user scenarios
- [ ] Production deployment

## 🚀 Deployment Plan

### **Development Environment**
1. **Create test SharePoint site**
2. **Implement and test locally**
3. **Validate with sample documents**

### **Staging Environment**
1. **Deploy to ltxr-staging** (if available)
2. **Test with real users**
3. **Performance and security validation**

### **Production Deployment**
1. **Create production SharePoint site**
2. **Update Azure AD app permissions**
3. **Deploy updated application**
4. **User training and documentation**

## 📚 Documentation Updates Needed

- [ ] Update README.md with SharePoint integration
- [ ] Create SharePoint setup guide
- [ ] Update user instructions with new features
- [ ] Create admin guide for SharePoint management
- [ ] Update troubleshooting documentation

## 🎯 Success Metrics

- **File persistence**: Users can access previously uploaded files
- **Processing efficiency**: Faster processing with SharePoint storage
- **User satisfaction**: Improved workflow and file management
- **System reliability**: Reduced file loss and improved error handling
- **Compliance**: Meets enterprise data governance requirements

---

**Next Steps**: Start with Phase 1 (SharePoint setup) and proceed through each phase systematically. Each phase builds on the previous one, allowing for incremental testing and validation.