import requests

url = "http://localhost:3001/api/register"
data = {
    "username": "testuser",
    "password": "password",
    "token": "bachata2026"
}

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response Content: {response.text}")
except Exception as e:
    print(f"Error: {e}")
