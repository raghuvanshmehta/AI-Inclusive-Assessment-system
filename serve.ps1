<#
.SYNOPSIS
  Zero-dependency Local HTTP Web Server for AI Inclusive Assessment System.
.DESCRIPTION
  Runs on Windows PowerShell using System.Net.HttpListener. 
  Serves HTML, CSS, JavaScript, and SVG files directly to http://localhost:8000.
#>

$port = 8000
$prefix = "http://localhost:$port/"
$root = $PSScriptRoot

if (-not $root) {
    $root = Get-Location
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add($prefix)

try {
    $listener.Start()
} catch {
    Write-Host "[!] Could not start listener on port $port. It might already be in use." -ForegroundColor Yellow
    $port = 8080
    $prefix = "http://localhost:$port/"
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " AI INCLUSIVE ASSESSMENT SYSTEM - FRONTEND SERVER" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Running at: $prefix" -ForegroundColor White
Write-Host " Root dir  : $root" -ForegroundColor Gray
Write-Host " Press Ctrl+C in this PowerShell window to stop the server." -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

# Open default browser
Start-Process $prefix

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".svg"  = "image/svg+xml"
    ".jpg"  = "image/jpeg"
    ".ico"  = "image/x-icon"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrWhiteSpace($urlPath)) {
            $urlPath = "index.html"
        }

        # Normalize slashes for Windows
        $localPath = Join-Path $root ($urlPath -replace '/', '\')

        if (Test-Path $localPath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localPath).ToLower()
            $mime = "application/octet-stream"
            if ($mimeTypes.ContainsKey($ext)) {
                $mime = $mimeTypes[$ext]
            }

            $response.ContentType = $mime
            $response.AddHeader("Cache-Control", "no-cache")

            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }

        $response.Close()
    } catch {
        # Handle termination cleanly
        break
    }
}

$listener.Stop()
Write-Host "Server stopped." -ForegroundColor Gray
