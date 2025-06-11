from flask import request, Response
from flask_restful import Resource, Api
from app.extensions import mongo
from datetime import datetime
from bson.json_util import dumps

def register_api(app):
    api = Api(app)
    api.add_resource(SensorData, '/api/sensordata')

class SensorData(Resource):
    def post(self):
        data = request.get_json()
        required = ['Temperature', 'Air_Humidity', 'Soil_Moisture', 'device_id']
        if not all(k in data for k in required):
            return {"message": "Missing fields"}, 400

        print("Received data:", data)

        # Tambahkan timestamp saat ini jika tidak dikirim dari client
        if 'timestamp' in data:
            try:
                data['timestamp'] = datetime.fromisoformat(data['timestamp'])
            except ValueError:
                return {"message": "Invalid timestamp format"}, 400
        else:
            data['timestamp'] = datetime.utcnow()

        print("Processed data:", data)
        mongo.db.sensordata.insert_one(data)
        return {"message": "Data inserted"}, 201

    def get(self):
        cursor = mongo.db.sensordata.find().sort("timestamp", -1)
        return Response(dumps(cursor), mimetype='application/json')
