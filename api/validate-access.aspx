<%@ Page Language="C#" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Web.Script.Serialization" %>

<script runat="server">
protected void Page_Load(object sender, EventArgs e)
{
    // Set response type
    Response.ContentType = "application/json";
    
    // Enable CORS if needed
    Response.AddHeader("Access-Control-Allow-Origin", "*");
    Response.AddHeader("Access-Control-Allow-Methods", "POST");
    Response.AddHeader("Access-Control-Allow-Headers", "Content-Type");
    
    if (Request.HttpMethod == "POST")
    {
        try
        {
            // Read the request body
            string requestBody = new StreamReader(Request.InputStream).ReadToEnd();
            
            // Parse JSON (simple approach)
            var serializer = new JavaScriptSerializer();
            dynamic data = serializer.DeserializeObject(requestBody);
            
            // Valid access codes - Saskatchewan Polytechnic CMP Converter
            string[] validCodes = {
                "J1an9xi!",           // Primary access code
                "CMP-2025",           // Secondary access code  
                "Test-2025"           // Testing/backup access code
            };
            
            string submittedCode = data["code"].ToString();
            
            // Check if code is valid
            if (Array.Exists(validCodes, code => code == submittedCode))
            {
                Response.StatusCode = 200;
                Response.Write("{\"success\": true, \"message\": \"Access granted\"}");
                
                // Optional: Log successful access (without storing the code)
                // System.Diagnostics.Debug.WriteLine($"CMP Converter access granted at {DateTime.Now}");
            }
            else
            {
                Response.StatusCode = 401;
                Response.Write("{\"success\": false, \"message\": \"Invalid access code\"}");
                
                // Optional: Log failed attempts (for security monitoring)
                // System.Diagnostics.Debug.WriteLine($"CMP Converter access denied at {DateTime.Now}");
            }
        }
        catch (Exception ex)
        {
            Response.StatusCode = 500;
            Response.Write("{\"success\": false, \"error\": \"Server error\"}");
            
            // Log server errors
            System.Diagnostics.Debug.WriteLine($"CMP Converter validation error: {ex.Message}");
        }
    }
    else
    {
        Response.StatusCode = 405;
        Response.Write("{\"success\": false, \"error\": \"Method not allowed\"}");
    }
    
    Response.End();
}
</script>