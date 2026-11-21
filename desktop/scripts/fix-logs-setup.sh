#!/bin/bash
# Fix System Logs - Complete Setup
# Run: bash desktop/scripts/fix-logs-setup.sh  (on Linux/Mac)
# Or copy the commands manually on Windows

echo "======================================"
echo "System Logs - Complete Setup Fix"
echo "======================================"
echo ""

echo "Step 1: Generating Prisma Client..."
npx prisma generate

if [ $? -ne 0 ]; then
  echo "❌ Prisma generate failed!"
  exit 1
fi

echo ""
echo "✓ Prisma client generated"
echo ""

echo "Step 2: Deploying migrations..."
npx prisma migrate deploy

if [ $? -ne 0 ]; then
  echo "❌ Migration deploy failed!"
  exit 1
fi

echo ""
echo "✓ Migrations deployed"
echo ""

echo "Step 3: Checking Prisma setup..."
node desktop/scripts/check-prisma.js

echo ""
echo "======================================"
echo "✓ Setup Complete!"
echo "======================================"
echo ""
echo "Next: Restart your backend server"
echo ""
