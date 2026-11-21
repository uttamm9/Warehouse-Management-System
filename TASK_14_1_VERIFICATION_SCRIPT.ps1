# Task 14.1 Verification Script
# Complete Inbound Workflow with PLC Sensor Integration
# This script performs automated checks to verify the system is ready for testing

Write-Host "`n=== Task 14.1 Verification Script ===" -ForegroundColor Cyan
Write-Host "Checking PLC Sensor Integration Implementation`n" -ForegroundColor Cyan

$checks = @()
$passed = 0
$failed = 0
$warnings = 0

# Function to add check result
function Add-Check {
    param(
        [string]$Name,
        [bool]$Pass,
        [string]$Message,
        [bool]$IsWarning = $false
    )
    
    $script:checks += [PSCustomObject]@{
        Name = $Name
        Pass = $Pass
        Message = $Message
        IsWarning = $IsWarning
    }
    
    if ($IsWarning) {
        $script:warnings++
        Write-Host "⚠️  WARN: $Name - $Message" -ForegroundColor Yellow
    } elseif ($Pass) {
        $script:passed++
        Write-Host "✅ PASS: $Name" -ForegroundColor Green
    } else {
        $script:failed++
        Write-Host "❌ FAIL: $Name - $Message" -ForegroundColor Red
    }
}

Write-Host "1. Checking File Structure...`n" -ForegroundColor Cyan

# Check if key files exist
$files = @(
    @{Path="desktop\services\rackSensor.service.js"; Name="Rack Sensor Service"},
    @{Path="desktop\plc\plcService.js"; Name="PLC Service"},
    @{Path="desktop\plc\plcLogger.js"; Name="PLC Logger"},
    @{Path="desktop\allocation.service.js"; Name="Allocation Service"},
    @{Path="desktop\services\__tests__\e2e.inbound.workflow.test.js"; Name="E2E Test File"}
)

foreach ($file in $files) {
    $exists = Test-Path $file.Path
    Add-Check -Name $file.Name -Pass $exists -Message "File not found: $($file.Path)"
}

Write-Host "`n2. Checking Database Schema...`n" -ForegroundColor Cyan

# Check for Prisma schema file
$schemaExists = Test-Path "prisma\schema.prisma"
Add-Check -Name "Prisma Schema File" -Pass $schemaExists -Message "schema.prisma not found"

if ($schemaExists) {
    $schemaContent = Get-Content "prisma\schema.prisma" -Raw
    
    # Check for PLC-specific fields in SystemLog
    $hasPlcOperation = $schemaContent -match "plcOperation"
    $hasPlcAddress = $schemaContent -match "plcAddress"
    $hasRackId = $schemaContent -match "rackId"
    
    Add-Check -Name "SystemLog.plcOperation field" -Pass $hasPlcOperation -Message "plcOperation field not found in schema"
    Add-Check -Name "SystemLog.plcAddress field" -Pass $hasPlcAddress -Message "plcAddress field not found in schema"
    Add-Check -Name "SystemLog.rackId field" -Pass $hasRackId -Message "rackId field not found in schema"
}

Write-Host "`n3. Checking Implementation Details...`n" -ForegroundColor Cyan

# Check rack sensor service implementation
if (Test-Path "desktop\services\rackSensor.service.js") {
    $rackSensorContent = Get-Content "desktop\services\rackSensor.service.js" -Raw
    
    $hasMapping = $rackSensorContent -match "RACK_SENSOR_MAPPING"
    $hasActivate = $rackSensorContent -match "activateRackSensor"
    $hasDeactivate = $rackSensorContent -match "deactivateRackSensor"
    $hasSharedSensor = $rackSensorContent -match "S1-R08.*shared.*true"
    
    Add-Check -Name "Rack-to-Sensor Mapping" -Pass $hasMapping -Message "RACK_SENSOR_MAPPING constant not found"
    Add-Check -Name "activateRackSensor method" -Pass $hasActivate -Message "activateRackSensor method not found"
    Add-Check -Name "deactivateRackSensor method" -Pass $hasDeactivate -Message "deactivateRackSensor method not found"
    Add-Check -Name "Shared sensor configuration" -Pass $hasSharedSensor -Message "Shared sensor mapping (S1-R08 to S1-R11) not found"
}

# Check allocation service integration
if (Test-Path "desktop\allocation.service.js") {
    $allocContent = Get-Content "desktop\allocation.service.js" -Raw
    
    $hasRackSensorImport = $allocContent -match "rackSensor"
    $hasActivationCall = $allocContent -match "activateRackSensor"
    
    Add-Check -Name "Allocation Service Integration" -Pass ($hasRackSensorImport -and $hasActivationCall) -Message "Sensor activation not integrated in allocation service"
}

# Check PLC logger enhancements
if (Test-Path "desktop\plc\plcLogger.js") {
    $loggerContent = Get-Content "desktop\plc\plcLogger.js" -Raw
    
    $hasSensorActivate = $loggerContent -match "sensorActivate"
    $hasSensorDeactivate = $loggerContent -match "sensorDeactivate"
    $hasSensorError = $loggerContent -match "sensorError"
    
    Add-Check -Name "PLC Logger sensor methods" -Pass ($hasSensorActivate -and $hasSensorDeactivate -and $hasSensorError) -Message "Sensor-specific logging methods not found"
}

Write-Host "`n4. Checking Configuration...`n" -ForegroundColor Cyan

# Check PLC configuration
if (Test-Path "desktop\plc\plcConfig.js") {
    $configContent = Get-Content "desktop\plc\plcConfig.js" -Raw
    
    $hasSensorDelay = $configContent -match "sensorActivationDelay"
    $hasSensorTimeout = $configContent -match "sensorTimeout"
    
    Add-Check -Name "Sensor activation delay config" -Pass $hasSensorDelay -Message "sensorActivationDelay not found in config"
    Add-Check -Name "Sensor timeout config" -Pass $hasSensorTimeout -Message "sensorTimeout not found in config"
}

Write-Host "`n5. Checking Test Files...`n" -ForegroundColor Cyan

# Check if E2E test exists and has content
if (Test-Path "desktop\services\__tests__\e2e.inbound.workflow.test.js") {
    $testContent = Get-Content "desktop\services\__tests__\e2e.inbound.workflow.test.js" -Raw
    
    $hasDescribe = $testContent -match "describe"
    $hasTest = $testContent -match "test|it"
    $hasSharedSensorTest = $testContent -match "S1-R08|S1-R09|S1-R10|S1-R11"
    
    Add-Check -Name "E2E Test Structure" -Pass ($hasDescribe -and $hasTest) -Message "E2E test structure incomplete"
    Add-Check -Name "Shared Sensor Test Coverage" -Pass $hasSharedSensorTest -Message "Shared sensor racks not tested"
}

Write-Host "`n6. Checking Dependencies...`n" -ForegroundColor Cyan

# Check package.json for required dependencies
if (Test-Path "package.json") {
    $packageContent = Get-Content "package.json" -Raw
    
    $hasModbus = $packageContent -match "modbus-serial"
    $hasSerialPort = $packageContent -match "serialport"
    $hasPrisma = $packageContent -match "@prisma/client"
    
    Add-Check -Name "modbus-serial dependency" -Pass $hasModbus -Message "modbus-serial not found in package.json"
    Add-Check -Name "@prisma/client dependency" -Pass $hasPrisma -Message "@prisma/client not found in package.json"
}

Write-Host "`n7. Hardware Connectivity Check...`n" -ForegroundColor Cyan

# Check if COM ports are available
$comPorts = [System.IO.Ports.SerialPort]::getportnames()
if ($comPorts.Count -gt 0) {
    Add-Check -Name "COM Ports Available" -Pass $true -Message ""
    Write-Host "   Available COM ports: $($comPorts -join ', ')" -ForegroundColor Gray
} else {
    Add-Check -Name "COM Ports Available" -Pass $false -Message "No COM ports detected" -IsWarning $true
}

Write-Host "`n8. Database Connection Check...`n" -ForegroundColor Cyan

# Check .env file for database URL
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    $hasDatabaseUrl = $envContent -match "DATABASE_URL"
    
    Add-Check -Name "Database URL configured" -Pass $hasDatabaseUrl -Message "DATABASE_URL not found in .env"
    
    if ($hasDatabaseUrl) {
        # Try to extract database info
        if ($envContent -match 'DATABASE_URL="?postgresql://([^:]+):([^@]+)@([^:]+):(\d+)/([^"?\s]+)') {
            Write-Host "   Database: $($Matches[5]) on $($Matches[3]):$($Matches[4])" -ForegroundColor Gray
        }
    }
} else {
    Add-Check -Name "Environment file" -Pass $false -Message ".env file not found"
}

# Summary
Write-Host "`n" + ("=" * 60) -ForegroundColor Cyan
Write-Host "VERIFICATION SUMMARY" -ForegroundColor Cyan
Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "✅ Passed: $passed" -ForegroundColor Green
Write-Host "❌ Failed: $failed" -ForegroundColor Red
Write-Host "⚠️  Warnings: $warnings" -ForegroundColor Yellow
Write-Host ("=" * 60) -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host "`n✨ All critical checks passed! System is ready for testing." -ForegroundColor Green
    Write-Host "`nNext Steps:" -ForegroundColor Cyan
    Write-Host "1. Review MANUAL_TEST_PROCEDURE_TASK_14_1.md for testing instructions"
    Write-Host "2. Ensure PLC hardware is connected to a COM port"
    Write-Host "3. Configure PLC settings in the WMS application"
    Write-Host "4. Execute manual test scenarios"
} else {
    Write-Host "`n⚠️  Some checks failed. Please address the issues above before testing." -ForegroundColor Yellow
    Write-Host "`nRequired Actions:" -ForegroundColor Cyan
    $checks | Where-Object { -not $_.Pass -and -not $_.IsWarning } | ForEach-Object {
        Write-Host "  • $($_.Name): $($_.Message)" -ForegroundColor Red
    }
}

Write-Host "`n"

# Export detailed results to JSON
$results = @{
    timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    summary = @{
        passed = $passed
        failed = $failed
        warnings = $warnings
        total = $checks.Count
    }
    checks = $checks
    ready = ($failed -eq 0)
}

$results | ConvertTo-Json -Depth 10 | Out-File "task_14_1_verification_results.json"
Write-Host "Detailed results saved to: task_14_1_verification_results.json" -ForegroundColor Gray
