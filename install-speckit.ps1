param (
    [Parameter(Mandatory=$true)]
    [string]$TargetDirectory
)

$SourceWorkflows = "$PSScriptRoot\.agent\workflows"
$SourceConstitution = "$PSScriptRoot\constitution.md"

$TargetWorkflows = Join-Path $TargetDirectory ".agent\workflows"
$TargetConstitution = Join-Path $TargetDirectory "constitution.md"

# 1. Ensure Target Directory Exists
if (-not (Test-Path $TargetDirectory)) {
    Write-Host "Creating target directory: $TargetDirectory"
    New-Item -ItemType Directory -Path $TargetDirectory | Out-Null
}

# 2. Create .agent/workflows structure
if (-not (Test-Path $TargetWorkflows)) {
    Write-Host "Creating workflow directory: $TargetWorkflows"
    New-Item -ItemType Directory -Path $TargetWorkflows -Force | Out-Null
}

# 3. Copy Workflows
Write-Host "Copying Spec-Kit workflows..."
Get-ChildItem -Path $SourceWorkflows -Filter "speckit-*.md" | ForEach-Object {
    $Dest = Join-Path $TargetWorkflows $_.Name
    Copy-Item -Path $_.FullName -Destination $Dest -Force
    Write-Host "  Installed: $($_.Name)"
}

# 4. Copy Constitution Template (if not exists)
if (-not (Test-Path $TargetConstitution)) {
    Write-Host "Copying Constitution template..."
    Copy-Item -Path $SourceConstitution -Destination $TargetConstitution
} else {
    Write-Host "Skipping Constitution (already exists)."
}

Write-Host "`nSpec-Kit successfully installed in $TargetDirectory!"
Write-Host "You can now open that folder and use commands like /speckit.constitution"
