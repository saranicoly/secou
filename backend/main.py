from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from elevationAPI import elevation, elevation_along_path
from calculate import calculate_route

app = FastAPI()

# Configurar CORS
origins = [
    "http://localhost:8100",  # Origem do seu frontend Ionic
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/get_route", status_code=201)
def send_adresses(origin: str, destination: str):
    return calculate_route(origin, destination)

@app.get("/api/google-maps-api-key")
async def get_google_maps_api_key():
    api_key = os.environ.get("GCP_KEY")
    if api_key:
        print(f"GCP_KEY found: {api_key}")
        return {"apiKey": api_key}
    else:
        print("GCP_KEY not found or is None")
        return {"apiKey": None}
