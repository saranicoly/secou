from fastapi import FastAPI
from elevationAPI import elevation, elevation_along_path
from calculate import calculate_route

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/get_route", status_code=201)
def send_adresses(origin: str, destination: str):
    streets = calculate_route(origin, destination)
    response = {}
    for street in streets:
        response[street] = False
    
    return response
