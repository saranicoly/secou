## Secou?

### Backend

#### Execução:
- Dentro de /backend, utilize o comando `uvicorn main:app --reload` para executar o servidor
- É possível acessar o Swagger em `http://127.0.0.1:8000/docs` ou o Redoc em `http://127.0.0.1:8000/redoc`

#### APIs utilizadas:

##### OpenWeather
- OpenWeather é uma api para obtenção de dados climáticos, os dados retornados por ela são:
    - weather (clima)
    - main (temperatura, sensação térmica, minímo e máximo)
    - clouds (% de nuvens)
    - rain (volume de chuvas nas últimas 1h e 3h)
    - visibility (visibilidade)
    - wind (velocidade e força do vento)

Documentação da API: https://openweathermap.org/current

##### Criterios de Alagamento:

Com relação ao código do openWeather:
- Se nao for 2xx, 3xx ou 5xx a chance de alagamentos é zero

### Frontend

#### Instalação:
- Primeiramente, é necessário que se tenha o Node.js instalado na máquina. Para isso, acesse o site oficial do [Node.js](https://nodejs.org/pt) e siga as instruções de instalação.
    - Para verificar se o Node.js foi instalado corretamente, execute o comando `node -v` no terminal. Caso a versão do Node.js seja exibida, a instalação foi bem sucedida.
- Em seguida, é necessário instalar o Ionic. Para isso, execute o comando `npm install -g @ionic/cli` no terminal.

#### Execução:
- Tendo o Node.js e o Ionic instalados, acesse a pasta /myApp e execute o comando `ionic serve` no terminal.
