$path = "c:\appliaction\APPLIACTION\server"
if (Test-Path $path) {
    Remove-Item -Path $path -Recurse -Force
    Write-Host "Server folder removed successfully"
} else {
    Write-Host "Server folder not found"
}
