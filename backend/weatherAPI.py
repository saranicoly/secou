import requests
import os

OPEN_WEATHER_KEY = os.environ['OPEN_WEATHER_KEY']

LAT_REC = -8.067500
LON_REC = -34.916667

def getCurrentWeatherData(lat, lon):
    url = f'https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPEN_WEATHER_KEY}'

    requestReturn = requests.get(url)
    requestReturn = requestReturn.json()
    
    return requestReturn

getCurrentWeatherData(LAT_REC, LON_REC)