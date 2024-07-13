import googlemaps
import re
import os
from datetime import datetime

gmaps = googlemaps.Client(key=os.environ.get('GOOGLE_MAPS_API_KEY'))

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

def calculate_route(origin, destination):
    now = datetime.now()
    directions_result = gmaps.directions(origin, destination, mode="walking", departure_time=now)

    return set(extract_street_names(directions_result))

# teste = calculate_route("rua santo urbano, recife", "rua engenheiro vasconcelos bittencourt, recife")
