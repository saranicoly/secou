import googlemaps
import re
import requests
import os
from datetime import datetime

gmaps = googlemaps.Client(key='AIzaSyCgvw_HvPKWDALPND_TFFD6xQbV7DRNW8E')

OPEN_WEATHER_KEY = os.environ['OPEN_WEATHER_KEY']

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

def get_weather(address):
    geocode_result = gmaps.geocode(address)
    # lat = geocode_result[0]['geometry']['location']['lat']
    # lng = geocode_result[0]['geometry']['location']['lng']
    lat = -8.0514
    lng = -34.9459

    url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lng}&appid={OPEN_WEATHER_KEY}'

    requestReturn = requests.get(url).json()
    weather_id = requestReturn['weather'][0]['id']

    if weather_id in dados:
        return dados[weather_id]
    return 0

def calculate_route(origin, destination):
    now = datetime.now()

    directions_result = gmaps.directions(origin, destination, mode="walking", departure_time=now)
    directions_result = set(extract_street_names(directions_result))

    weather_streets = {}
    for street in directions_result:
        weather = get_weather(street)
        weather_streets[street] = weather

    return directions_result

teste = calculate_route("rua santo urbano, recife", "rua engenheiro vasconcelos bittencourt, recife")
