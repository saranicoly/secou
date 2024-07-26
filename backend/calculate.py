import googlemaps
import re
import requests
import os
from datetime import datetime, date
from elevationAPI import elevation

OPEN_WEATHER_KEY = '4715d6e4db67c9bc3c3efaf9199676ff' #os.environ['OPEN_WEATHER_KEY']
GCP_KEY = 'AIzaSyCgvw_HvPKWDALPND_TFFD6xQbV7DRNW8E' #os.environ['GCP_API_KEY']

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

def get_weather(time, lat=-8.0514, lng=-34.9459):

    current_hour = int(str(datetime.now()).split(' ')[1].split(':')[0])
    if int(time) in range(current_hour-2, current_hour+2, 1):
        url = f'https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lng}&exclude=alerts&appid={OPEN_WEATHER_KEY}'
        requestReturn = requests.get(url).json()
        weather_id = str(requestReturn['current']['weather'][0]['id'])
        if weather_id in dados:
            return dados[weather_id]
        return 0
    
    url = f'https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lng}&appid={OPEN_WEATHER_KEY}'

    requestReturn = requests.get(url).json()

    current_day_data = []
    for data in requestReturn['list']:
        if data['dt_txt'].split(' ')[0] == str(date.today()):
            current_day_data.append(data)

    forecasted_hours = [data['dt_txt'].split(' ')[1].split(':')[0] for data in current_day_data]
    
    time_distance = [abs(int(time)-int(hour)) for hour in forecasted_hours]

    index_min_time_distance = time_distance.index(min(time_distance))

    weather_id = str(current_day_data[index_min_time_distance]['weather'][0]['id'])
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

def calculate_route(origin, destination, time):

    current_hour = int(str(datetime.now()).split(' ')[1].split(':')[0])
    if int(time) in range(current_hour-2, current_hour+2, 1):
        departure_time = datetime.now()
    else:
        departure_time = datetime.fromisoformat(f'{str(date.today())} {time}:00:00.000')
        
    directions_result = gmaps.directions(origin, destination, mode="walking", departure_time=departure_time)
    directions_result = set(extract_street_names(directions_result))

    weather_streets = {}
    for street in directions_result:
        lat, lng = get_geolocation(f'{street}, recife').values()
        weather = get_weather(time, lat, lng)
        elevation = get_elevation(lat, lng)

        probability = calculate_probability(weather, elevation)

        if probability>50:
            weather_streets[street] = True
        else:
            weather_streets[street] = False

    return weather_streets
time = 14

print(type(timed))