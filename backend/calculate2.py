import googlemaps
import re
import requests
import os
from collections import OrderedDict
from datetime import datetime
from elevationAPI import elevation

OPEN_WEATHER_KEY = os.environ['OPEN_WEATHER_KEY']
GCP_KEY = os.environ['GCP_API_KEY']

gmaps = googlemaps.Client(key=GCP_KEY)

dados = { 
            "200": 10,
            "201": 20,
            "202": 60,
            "311": 5,
            "312": 10,
            "313": 10,
            "314": 10,
            "500": 10,
            "501": 20,
            "502": 50,
            "503": 60,
            "504": 60,
            "511": 50,
            "520": 50,
            "521": 50,
            "522": 60,
            "531": 50
        }

def get_tide_data(lat, lng):
    url = f'https://api.marea.ooo/v2/tides?latitude={lat}&longitude={lng}'
    headers = {'x-marea-api-token': 'e380d7a2-ac26-48a3-a94c-fba5280b21d6'}
    response = requests.get(url, headers=headers)
    tide_data = response.json()

    if response.status_code == 200:
        return tide_data
    else:
        print(f"Erro ao obter dados de maré: {tide_data.get('errors', 'Desconhecido')}")
        return None


def extract_street_names(directions_result):
    street_names = []
    padrao = r'<b>(.*?)</b>'
    for step in directions_result[0]['legs'][0]['steps']:
        instructions = step.get('html_instructions', '')
        if instructions:
            parts = instructions.split(' on ')
            if len(parts) > 1:
                names = re.findall(padrao, parts[1]) # Remove any HTML tags after the street name
                for name in names:
                    street_names.append(name)
            else:
                parts = instructions.split(' toward ')
                names = re.findall(padrao, parts[0]) # Get the last part before the HTML tag
                street_names.append(names[-1])

    return street_names

def get_geolocation(address):
    geocode_result = gmaps.geocode(address)

    lat = geocode_result[0]['geometry']['location']['lat']
    lng = geocode_result[0]['geometry']['location']['lng']

    # lat=-8.0514
    # lng=-34.9459

    return {'lat': lat, 'lng': lng}

def get_weather(lat=-8.0514, lng=-34.9459):
    url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={OPEN_WEATHER_KEY}'

    requestReturn = requests.get(url).json()
    weather_id = requestReturn['weather'][0]['id']

    if weather_id in dados:
        return dados[weather_id]
    return 0

def get_elevation(lat=-8.0514, lng=-34.9459):
    loc = (lat, lng)
    results = elevation(gmaps, loc)
    return results[0]['elevation']


def calculate_probability(weather, elevation, tide_height):
    if elevation > 100:
        probability_elevation = 0.1
    elif elevation < 1:
        probability_elevation = 100
    else:
        probability_elevation = 100 - elevation

    # Supondo que 0.5m seja um nível crítico para alagamento
    if tide_height > 0.5:  
        probability_tide = 50
    else:
        probability_tide = 0

    probability = weather * 0.5 + probability_elevation * 0.25 + probability_tide * 0.25

    return probability


def calculate_route(origin, destination):
    now = datetime.now()

    directions_result = gmaps.directions(origin, destination, mode="walking", departure_time=now)
    streets = extract_street_names(directions_result)
    # Remove duplicates from the streets list, keeping the order
    directions_result = list(dict.fromkeys(streets).keys())

    weather_streets = OrderedDict()
    for street in directions_result:
        lat, lng = get_geolocation(f'{street}, recife').values()
        weather = get_weather(lat, lng)
        elevation = get_elevation(lat, lng)

        probability = calculate_probability(weather, elevation)

        if probability>50:
            weather_streets[street] = True
        else:
            weather_streets[street] = False

    return weather_streets
