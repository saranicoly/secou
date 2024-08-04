from typing import Optional
from fastapi import FastAPI, Response, status
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

@app.post("/get_route", status_code=201)
def send_adresses(saida: str, destino: str, time: Optional[int] = None):
    print(f"Received data: saida={saida}, destino={destino}, time={time}")
    return calculate_route(saida, destino, time)

@app.post("/flooding", status_code=200)
def send_flooding(street: str, level: int, response: Response):
    if level < 0 or level > 5:
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "Invalid level"}
    return {"message": "Flooding data received"}

@app.get("/api/google-maps-api-key")
async def get_google_maps_api_key():
    api_key = os.environ.get("GCP_KEY")
    if api_key:
        print(f"GCP_KEY found: {api_key}")
        return {"apiKey": api_key}
    else:
        print("GCP_KEY not found or is None")
        return {"apiKey": None}
