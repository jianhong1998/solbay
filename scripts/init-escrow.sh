url="http://localhost:3001/escrow"

echo "Sending request to $url"
curl -sS -X POST --url $url >> /dev/null