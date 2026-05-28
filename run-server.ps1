# Script PowerShell per avviare un server Web locale nativo (senza dipendenze)
# Risolve le restrizioni CORS dei browser quando si caricano moduli Javascript (ESM) da file://

$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

try {
    $listener.Start()
    Clear-Host
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "          ATLANTE GEOSTORICO - SERVER WEB LOCALE          " -ForegroundColor Yellow
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host "Server avviato con successo!" -ForegroundColor Green
    Write-Host "Apri il browser su: " -NoNewline
    Write-Host "http://localhost:$port/" -ForegroundColor Cyan
    Write-Host "Premi [CTRL + C] nella finestra di comando per fermare il server." -ForegroundColor Gray
    Write-Host "==========================================================" -ForegroundColor Cyan
    Write-Host ""
} catch {
    Write-Error "Impossibile avviare il server. Assicurati che la porta $port sia libera."
    Exit
}

# Funzione per mappare le estensioni ai MIME Type corretti
function Get-MimeType($filePath) {
    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
    switch ($ext) {
        ".html" { return "text/html; charset=utf-8" }
        ".htm"  { return "text/html; charset=utf-8" }
        ".css"  { return "text/css; charset=utf-8" }
        ".js"   { return "application/javascript; charset=utf-8" }
        ".json" { return "application/json; charset=utf-8" }
        ".png"  { return "image/png" }
        ".jpg"  { return "image/jpeg" }
        ".jpeg" { return "image/jpeg" }
        ".gif"  { return "image/gif" }
        ".svg"  { return "image/svg+xml" }
        ".ico"  { return "image/x-icon" }
        default { return "application/octet-stream" }
    }
}

# Ciclo principale di ascolto delle richieste
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Estrae il percorso del file
        $urlPath = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($urlPath)) {
            $urlPath = "index.html"
        }
        
        # Risolve il percorso locale del file nel workspace del server
        $localPath = Join-Path $PSScriptRoot $urlPath
        
        # Se punta a una directory, prova a cercare index.html
        if (Test-Path $localPath -PathType Container) {
            $localPath = Join-Path $localPath "index.html"
        }
        
        if (Test-Path $localPath -PathType Leaf) {
            # Legge il file in bytes
            $bytes = [System.IO.File]::ReadAllBytes($localPath)
            
            # Imposta MIME Type ed intestazioni
            $response.ContentType = Get-MimeType $localPath
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 200
            
            # Intestazioni di cache e CORS
            $response.Headers.Add("Access-Control-Allow-Origin", "*")
            $response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate")
            
            # Scrive sul flusso di risposta
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "[200] $($request.HttpMethod) - /$urlPath" -ForegroundColor Green
        } else {
            # File non trovato
            $msg = "404 - Risorsa non trovata"
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($msg)
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $bytes.Length
            $response.StatusCode = 404
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            Write-Host "[404] $($request.HttpMethod) - /$urlPath" -ForegroundColor Red
        }
    } catch {
        # Gestisce disconnessioni improvvise del client
    } finally {
        if ($null -ne $response) {
            try { $response.Close() } catch {}
        }
    }
}
