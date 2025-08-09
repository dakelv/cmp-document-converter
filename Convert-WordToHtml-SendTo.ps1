# CMP Document Converter - SendTo PowerShell Script
# Place in SendTo folder for right-click → Send to → Convert to HTML
# Usage: Right-click Word document → Send to → Convert Word to HTML

param(
    [Parameter(Mandatory=$true, ValueFromPipeline=$true)]
    [string[]]$FilePath
)

# Hide PowerShell window for SendTo usage
Add-Type -AssemblyName System.Windows.Forms

# Check if Pandoc is installed
if (-not (Get-Command "pandoc" -ErrorAction SilentlyContinue)) {
    [System.Windows.Forms.MessageBox]::Show(
        "Pandoc not found. Please install from: https://pandoc.org/installing.html", 
        "Pandoc Not Found", 
        [System.Windows.Forms.MessageBoxButtons]::OK, 
        [System.Windows.Forms.MessageBoxIcon]::Error
    )
    exit 1
}

# Track successful conversions
$successCount = 0
$failedCount = 0

foreach ($file in $FilePath) {
    if (Test-Path $file) {
        $fullPath = Resolve-Path $file
        $extension = [System.IO.Path]::GetExtension($fullPath).ToLower()
        
        # Only process Word files
        if ($extension -notin @('.docx', '.doc')) {
            [System.Windows.Forms.MessageBox]::Show(
                "Unsupported file type: $extension. Please select Word documents (.docx, .doc).", 
                "Invalid File Type", 
                [System.Windows.Forms.MessageBoxButtons]::OK, 
                [System.Windows.Forms.MessageBoxIcon]::Warning
            )
            continue
        }
        
        $directory = Split-Path $fullPath -Parent
        $filename = [System.IO.Path]::GetFileNameWithoutExtension($fullPath)
        $outputFile = Join-Path $directory "$filename.html"
        
        try {
            Set-Location $directory
            
            # Show progress
            Write-Host "🔄 Converting: $([System.IO.Path]::GetFileName($fullPath))" -ForegroundColor Yellow
            
            # Run pandoc
            $process = Start-Process -FilePath "pandoc" -ArgumentList @(
                "`"$fullPath`"",
                "-s",
                "-o", "`"$outputFile`"",
                "--extract-media=.",
                "--ascii"
            ) -Wait -PassThru -NoNewWindow
            
            if ($process.ExitCode -eq 0 -and (Test-Path $outputFile)) {
                $successCount++
                Write-Host "✅ Created: $([System.IO.Path]::GetFileName($outputFile))" -ForegroundColor Green
            } else {
                $failedCount++
                Write-Host "❌ Failed: $([System.IO.Path]::GetFileName($fullPath))" -ForegroundColor Red
            }
        }
        catch {
            $failedCount++
            Write-Host "❌ Error: $_" -ForegroundColor Red
        }
    } else {
        $failedCount++
        Write-Host "❌ File not found: $file" -ForegroundColor Red
    }
}

# Show completion summary
$message = "Conversion complete!`n`n"
if ($successCount -gt 0) {
    $message += "✅ Successfully converted: $successCount file(s)\n"
}
if ($failedCount -gt 0) {
    $message += "❌ Failed: $failedCount file(s)\n"
}

[System.Windows.Forms.MessageBox]::Show(
    $message, 
    "CMP Document Converter", 
    [System.Windows.Forms.MessageBoxButtons]::OK, 
    [System.Windows.Forms.MessageBoxIcon]::Information
)

# Open the output folder if successful
if ($successCount -gt 0 -and $FilePath.Count -eq 1) {
    $directory = Split-Path (Resolve-Path $FilePath[0]) -Parent
    Start-Process "explorer.exe" $directory
}