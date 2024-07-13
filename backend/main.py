from fastapi import FastAPI
from elevationAPI import elevation, elevation_along_path

app = FastAPI()


@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/get_route", status_code=201)
def send_adresses(start: str, destination: str):
    return {
        "R. Acdo. Hélio Ramos": False,
        "Av. Prof. Artur de Sá": True,
        "R. Gen. Polidoro": False
    }
