#!/bin/sh

chmod +x ./seed.sh

echo "Lancement du seed..."
npx drizzle-kit push
./seed.sh

echo "Lancement du serveur de développement..."
npm run dev