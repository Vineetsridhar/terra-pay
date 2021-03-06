'''
    Terra-Pay
    Flask Web server that handles API endpoints
'''
import os
import asyncio
import threading
import json
import stripe
from fund import fund_wallet
from flask import Flask, send_from_directory, request
from dotenv import load_dotenv, find_dotenv
from flask_cors import cross_origin
import sqlite3

con = sqlite3.connect('users.db', check_same_thread=False)
cur = con.cursor()

cur.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(32), username VARCHAR(32), publicKey INTEGER);')
cur.execute('CREATE TABLE IF NOT EXISTS friend_request (id INTEGER PRIMARY KEY AUTOINCREMENT, sender VARCHAR(32), recipient VARCHAR(32), address VARCHAR(255), response INTEGER);')

load_dotenv(find_dotenv())  
stripe.api_key = os.getenv('STRIPE_SECRET_KEY')


APP = Flask(__name__, static_folder='./build/static')

def make_error_block(message):
    return {"success":False,"message":message}, 400


#Diffie Hellmann
@APP.route('/getBaseNumber', methods=['POST'])
@cross_origin() 
def getBaseNumber():
    return {"success":True, "value": 101}

@APP.route('/getPrimeNumber', methods=['POST'])
@cross_origin() 
def getPrimeNumber():
    return {"success":True, "value": 5003}

@APP.route('/getFriendRequests', methods=['POST'])
@cross_origin() 
def getAllFriendRequests():
    data = request.json
    if "username" not in data:
        return make_error_block("Params missing")
    items = cur.execute("SELECT * FROM friend_request WHERE recipient='%s' AND response=0" % data["username"])
    output = [{"sender":item[1], "recipient":item[2], "address":item[3]} for item in items]
    return {"success":True, "requests":output}

@APP.route('/getFriendResponses', methods=['POST'])
@cross_origin() 
def getFriendResponses():
    data = request.json
    if "username" not in data:
        return make_error_block("Params missing")
    items = cur.execute("SELECT * FROM friend_request WHERE recipient='%s' AND response=1" % data["username"])
    output = [{"sender":item[1], "recipient":item[2], "address":item[3]} for item in items]
    return {"success":True, "responses":output}

@APP.route('/getPublicKey', methods=['POST'])
@cross_origin() 
def getPublicKey():
    data = request.json
    if "username" not in data:
        return make_error_block("Params missing")
    items = cur.execute("SELECT * FROM users WHERE username='%s'" % data["username"])
    output = [{"sender":item[1], "recipient":item[2], "publicKey":item[3]} for item in items]
    if not len(output):
        return make_error_block("No user found")
    return {"success":True, "publicKey":output[0]["publicKey"]}


@APP.route('/initiateRequest', methods=['POST'])
@cross_origin() 
def initiateRequest():
    data = request.json
    if "sender" not in data or "recipient" not in data or "address" not in data:
        return make_error_block("Params missing")

    find = cur.execute('SELECT * FROM friend_request WHERE sender="%s" and recipient="%s";' %  (data["sender"], data["recipient"]))
    values = [item for item in find]
    if len(values) > 0:
        return make_error_block("You can only have one outgoing friend request.")

    cur.execute('INSERT INTO friend_request (sender, recipient, address, response) VALUES ("%s", "%s", "%s", 0)' % (data["sender"], data["recipient"], data["address"]))
    con.commit()

    return {"success":True}

@APP.route('/sendResponse', methods=['POST'])
@cross_origin() 
def sendResponse():
    data = request.json
    if "sender" not in data or "recipient" not in data or "address" not in data:
        return make_error_block("Params missing")
        
    cur.execute('DELETE FROM friend_request WHERE sender="%s" and recipient="%s";' %  (data["recipient"], data["sender"]))

    cur.execute('INSERT INTO friend_request (sender, recipient, address, response) VALUES ("%s", "%s", "%s", 1)' % (data["sender"], data["recipient"], data["address"]))
    con.commit()

    return {"success":True}

@APP.route('/denyRequest', methods=['POST'])
@cross_origin() 
def denyRequest():
    data = request.json
    if "sender" not in data or "recipient" not in data:
        return make_error_block("Params missing")

    cur.execute('DELETE FROM friend_request WHERE sender="%s" and recipient="%s";' %  (data["sender"], data["recipient"]))
    con.commit()

    return {"success":True}

@APP.route('/isUsernameUnique', methods=['POST'])
@cross_origin() 
def isUsernameUnique():
    if "username" not in request.json:
        return make_error_block("Params missing")
    username = request.json["username"]
    if len(username) < 4:
        return make_error_block("Your username must be at least 4 characters")
    data = cur.execute('SELECT * FROM users where username = "%s"' % username)
    output = [item for item in data]
    return {'success': True, "unique": len(output) == 0}, 200

@APP.route('/newUser', methods=['POST'])
@cross_origin() 
def newUser():
    data = request.json
    if "name" not in data or "username" not in data or "publicKey" not in data:
        return make_error_block("Params missing")
    cur.execute('INSERT INTO users (name, username, publicKey) VALUES ("%s", "%s", %d)' % (data["name"], data["username"], data["publicKey"]))
    con.commit()
    return {'success': True}, 200

@APP.route('/getUsers', methods=['POST'])
@cross_origin() 
def getUsers():
    data = cur.execute('SELECT * FROM users')
    output = [item[2] for item in data] #returns only name
    return {'success': True, "data":output}, 200


@APP.route('/fund', methods=['POST'])
@cross_origin() 
def handler_user_funding():
    '''
        Given a terra address,
        fund a certain amount from reserve
    '''
    terra_address = request.get_json()['address']
    amount = request.get_json()['amount']
    asyncio.set_event_loop(asyncio.new_event_loop())
    loop = asyncio.get_event_loop()
    result = loop.run_until_complete(fund_wallet(terra_address, float(amount)))
    return {'success': True }, 200

@APP.route('/payment', methods=['POST'])
@cross_origin()
def handle_stripe_payment():
    data = json.loads(request.data)
    # Create a PaymentIntent with the order amount and currency
    intent = stripe.PaymentIntent.create(
        amount=data['amount'],
        currency='usd'
    )
    try:
        # Send publishable key and PaymentIntent details to client
        return {'clientSecret': intent.client_secret}
    except Exception as e:
        return { 'success': False }, 403

@APP.route('/getPoolAddress', methods=['POST'])
@cross_origin() 
def getPoolAddress():
    return {'success': True, "address":"terra15hqeyv7k7zsffd3tefndep20qqz47tusfqd3u4"}, 200



# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    APP.run(
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', "8081")),
        debug=True
    )
