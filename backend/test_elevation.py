import googlemaps
from elevationAPI import elevation, elevation_along_path  
import os

API_KEY = os.environ['GCP_API_KEY']

def test_elevation():
    client = googlemaps.Client(key=API_KEY)
    locations = [
        (34.052235, -118.243683),  # Los Angeles, CA
        (40.712776, -74.005974),   # New York, NY
        (37.774929, -122.419418),  # San Francisco, CA
    ]
    results = elevation(client, locations)
    
    # Verificar se os resultados foram retornados
    if results:
        print("Elevation data fetched successfully.")
        for result in results:
            print(result)
    else:
        print("No elevation data found.")

if __name__ == "__main__":
    test_elevation()