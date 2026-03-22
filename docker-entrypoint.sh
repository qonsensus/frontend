#!/bin/sh
set -e

# Validate required env vars
if [ -z "$API_URL" ]; then
  echo "ERROR: API_URL environment variable is not set"
  exit 1
fi

# Write runtime config
cat <<EOF > /usr/share/nginx/html/config.js
window.__APP_CONFIG__ = {
  apiUrl: "${API_URL}"
};
EOF

echo "Config written:"
cat /usr/share/nginx/html/config.js

exec nginx -g "daemon off;"