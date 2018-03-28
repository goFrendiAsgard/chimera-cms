echo "If required, please set:"
echo "'superAdmin username' into 'admin'"
echo "'superAdmin email' into 'admin@admin.com'"
echo "'superAdmin password' into 'admin'"
node migrate.js up && npm test