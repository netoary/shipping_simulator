# import libs
import googlemaps
import os

from flask import Flask, request
from flask_mongoengine import MongoEngine
from haversine import haversine
from dotenv import load_dotenv
from flask_cors import CORS

# load geocoding token
load_dotenv()
GKEY = os.getenv('GKEY')
MONGO_PW = os.getenv('MONGO_PW')

gmaps = googlemaps.Client(key=GKEY)

app = Flask(__name__)
CORS(app)
app.config['MONGODB_SETTINGS'] = {
    'host': os.environ['MONGODB_HOST'],
    'username': 'admin',
    'password': MONGO_PW,
    'db': 'webapp'
}

db = MongoEngine()
db.init_app(app)

# Model do banco
class AddressTable(db.Document):
    address = db.StringField(required=True)
    lat = db.FloatField()
    lng = db.FloatField()


# Busca no banco um endereço
# Se não encontrar bate na api de geocoding e salva no banco o endereço e coordenadas
def getGeocode(address):
    databaseData = AddressTable.objects(address__gte=address).first() 
    if databaseData == None:
        geocode = gmaps.geocode(address)
        lat = geocode[0]['geometry']['location']['lat']
        lng = geocode[0]['geometry']['location']['lng']
        AddressTable(address=address, lat=lat, lng=lng).save()
    else:
        lat = databaseData.lat
        lng = databaseData.lng
    return lat, lng


"""
# Rota de cálculo
# Recebe os dados do pedido
# Retorna os dados do operador mais bararto e mais rápido

"""
@app.route('/full', methods=['GET', 'POST'])
def full():
    # Variáveis auxiliares
    # foi uma decisão de projeto foi definir no dicionário "dic_op" as taxas cobradas por cada operador
    # uma possível evolução é salvar esses dados no banco e criar uma página de inserção de novo operador logístico
    dic_op = {
        'op_1': {'divider': 6000, 'multipliers': [(1.2, 1), (2.4, 3), (5, 4)]},
        'op_2': {'divider': 5000, 'multipliers': [(1, 1), (1.8, 2), (4, 5)]}
    }
    price_ops = {}
    result = {}
    counter = 0

    # Dados do pedido
    body = request.json['body']
    height = float(body['height'])
    width = float(body['width'])
    length = float(body['length'])
    collection_address = body['collection_address']
    delivery_address = body['delivery_address']

    # Busca no banco os endereços de coleta e entrega,
    # Se não encontrar bate na api de geocoding e salva no banco o endereço e coordenadas
    collection_lat, collection_lng = getGeocode(collection_address)
    delivery_lat, delivery_lng = getGeocode(delivery_address)
    
    # Calcula a distância de entrega
    distance = haversine((collection_lat, collection_lng), (delivery_lat, delivery_lng))

    cubic_weight = height * width * length

    # Cálculo dos custos, em cada iteração definir o operador mais barato e mais rápido
    for operator, value in dic_op.items():
        if cubic_weight / value['divider'] < 6:
            cubic_weight_price = 6
        else:
            cubic_weight_price = cubic_weight / value['divider']
        if distance <= 100:
            final_price = cubic_weight_price * value['multipliers'][0][0]
            final_time = value['multipliers'][0][1]
        elif distance <= 500:
            final_price = cubic_weight_price * value['multipliers'][1][0]
            final_time = value['multipliers'][1][1]
        else:
            final_price = cubic_weight_price * value['multipliers'][2][0]
            final_time = value['multipliers'][2][1]

        price_ops[operator] = {'price': final_price, 'time': final_time}
        
        if counter == 0:
            result['faster'] = {'operator': operator, 'price': final_price, 'time': final_time}
            result['cheaper'] = {'operator': operator, 'price': final_price, 'time': final_time}
            counter = 1
        else:
            if final_time < result['faster']['time']:
                result['faster'] = {'operator': operator, 'price': final_price, 'time': final_time}

            if final_price < result['cheaper']['price']:
                result['cheaper'] = {'operator': operator, 'price': final_price, 'time': final_time}

    return result


@app.route("/")
def homepage():
    return 'hello world'


if __name__ == "__main__":
    app.run(debug=True, port=5000)