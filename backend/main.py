from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from elevationAPI import elevation, elevation_along_path
from calculate import calculate_route
from pydantic import BaseModel

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

class RouteRequest(BaseModel):
    saida: str
    destino: str
    time: str

@app.post("/get_route", status_code=201)
def send_adresses(request: RouteRequest):
    print(f"Received data: {request}")
    origin = request.saida
    destination = request.destino
    time = request.time
    return calculate_route(origin, destination, time)

@app.get("/api/google-maps-api-key")
async def get_google_maps_api_key():
    api_key = os.environ.get("GCP_KEY")
    if api_key:
        print(f"GCP_KEY found: {api_key}")
        return {"apiKey": api_key}
    else:
        print("GCP_KEY not found or is None")
        return {"apiKey": None}
