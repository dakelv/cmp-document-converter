<%@ Page Language="C#" ContentType="application/json" %>
<%@ Import Namespace="System.Net.Http" %>
<%@ Import Namespace="System.Text" %>
<%@ Import Namespace="Newtonsoft.Json" %>

<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
        // Set CORS headers
        Response.Headers.Add("Access-Control-Allow-Origin", "*");
        Response.Headers.Add("Access-Control-Allow-Methods", "POST, OPTIONS");
        Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type");
        
        if (Request.HttpMethod == "OPTIONS")
        {
            Response.StatusCode = 200;
            Response.End();
            return;
        }
        
        if (Request.HttpMethod != "POST")
        {
            Response.StatusCode = 405;
            Response.Write("{\"error\": \"Method not allowed\"}");
            return;
        }
        
        try
        {
            // Read request body
            string requestBody = "";
            using (var reader = new System.IO.StreamReader(Request.InputStream))
            {
                requestBody = reader.ReadToEnd();
            }
            
            dynamic requestData = JsonConvert.DeserializeObject(requestBody);
            string authCode = requestData.code;
            string redirectUri = requestData.redirectUri;
            
            if (string.IsNullOrEmpty(authCode))
            {
                Response.StatusCode = 400;
                Response.Write("{\"error\": \"Authorization code is required\"}");
                return;
            }
            
            // Exchange authorization code for tokens
            var tokenResponse = ExchangeCodeForTokens(authCode, redirectUri);
            
            Response.ContentType = "application/json";
            Response.Write(tokenResponse);
        }
        catch (Exception ex)
        {
            Response.StatusCode = 500;
            Response.Write("{\"error\": \"" + ex.Message + "\"}");
        }
    }
    
    private string ExchangeCodeForTokens(string authCode, string redirectUri)
    {
        // TODO: Update these values with your Azure App Registration details
        string clientId = "YOUR_CLIENT_ID";
        string clientSecret = "YOUR_CLIENT_SECRET";
        string tenantId = "YOUR_TENANT_ID";
        
        string tokenEndpoint = $"https://login.microsoftonline.com/{tenantId}/oauth2/v2.0/token";
        
        using (var client = new HttpClient())
        {
            var parameters = new List<KeyValuePair<string, string>>
            {
                new KeyValuePair<string, string>("client_id", clientId),
                new KeyValuePair<string, string>("client_secret", clientSecret),
                new KeyValuePair<string, string>("code", authCode),
                new KeyValuePair<string, string>("redirect_uri", redirectUri),
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("scope", "openid profile email User.Read")
            };
            
            var content = new FormUrlEncodedContent(parameters);
            
            var response = client.PostAsync(tokenEndpoint, content).Result;
            var responseContent = response.Content.ReadAsStringAsync().Result;
            
            if (!response.IsSuccessStatusCode)
            {
                throw new Exception($"Token exchange failed: {responseContent}");
            }
            
            return responseContent;
        }
    }
</script>