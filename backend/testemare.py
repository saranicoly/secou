import requests

api_token = 'e380d7a2-ac26-48a3-a94c-fba5280b21d6'

base_url = 'https://api.marea.ooo/v2/tides'

params = {
    'latitude': '-22.9068',  
    'longitude': '-43.1729', 
    'date': '2024-08-01',    # Data no formato AAAA-MM-DD
}

headers = {
    'x-marea-api-token': api_token,
}

try:
    response = requests.get(base_url, headers=headers, params=params)
    
    if response.status_code == 200:
        tide_data = response.json()
        print("Dados de maré obtidos com sucesso:")
        print(tide_data)
    else:
        print(f"Falha ao obter dados de maré. Status code: {response.status_code}")
        print("Mensagem de erro:", response.text)
except requests.exceptions.RequestException as e:
    print(f"Erro de conexão: {e}")
