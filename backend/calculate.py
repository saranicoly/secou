import googlemaps
import re
import requests
import os
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

def calculate_probability(weather, elevation):
    if elevation>100:
        probability_elevation = 0.1
    elif elevation<1:
        probability_elevation = 100
    else:
        probability_elevation = 100-elevation
    
    probability = weather*0.7 + probability_elevation*0.3

    return probability

def calculate_route(origin, destination):
    now = datetime.now()

    directions_result = gmaps.directions(origin, destination, mode="walking", departure_time=now)
    directions_result = set(extract_street_names(directions_result))

    weather_streets = {}
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
