Add-Type -AssemblyName System.Drawing

$dir = Join-Path $PSScriptRoot "..\src-tauri\icons"
$files = Get-ChildItem -Path $dir -Filter *.png

foreach ($f in $files) {
    $src = [System.Drawing.Image]::FromFile($f.FullName)
    $bmp = New-Object System.Drawing.Bitmap $src.Width, $src.Height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.Clear([System.Drawing.Color]::Transparent)
    $g.DrawImage($src, 0, 0, $src.Width, $src.Height)
    $g.Dispose()
    $src.Dispose()
    $bmp.Save($f.FullName, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $bytes = [System.IO.File]::ReadAllBytes($f.FullName)
    Write-Output "$($f.Name): colorType=$($bytes[25])"
}
