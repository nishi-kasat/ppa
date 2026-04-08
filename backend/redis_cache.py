import redis
import json

redis_client = redis.Redis(host="localhost", port=6379, db=0, decode_responses=True)

def set_cache(key, data, expiry=60):
    redis_client.setex(key, expiry, json.dumps(data))

def get_cache(key):
    data = redis_client.get(key)
    if data:
        return json.loads(data)
    return None

def delete_cache(key):
    redis_client.delete(key)