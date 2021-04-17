'''
    Terra-Pay
    Flask Web server that handles API endpoints
'''
import os
from flask import Flask, send_from_directory, request
from dotenv import load_dotenv, find_dotenv
from flask_cors import cross_origin
import sqlite3

con = sqlite3.connect('users.db', check_same_thread=False)
cur = con.cursor()

cur.execute('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(32), username VARCHAR(32));')

load_dotenv(find_dotenv())  

APP = Flask(__name__, static_folder='./build/static')

def make_error_block(message):
    return {"success":False,"message":message}, 400

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
def newUser():
    data = request.json
    if "name" not in data or "username" not in data:
        return make_error_block("Params missing")
    cur.execute('INSERT INTO users (name, username) VALUES ("%s", "%s")' % (data["name"], data["username"]))
    con.commit()
    return {'success': True}, 200

@APP.route('/getUsers', methods=['POST'])
def getUsers():
    data = cur.execute('SELECT * FROM users')
    output = [item[0] for item in data] #returns only name
    return {'success': True, "data":output}, 200

# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    APP.run(
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', "8081")),
        debug=True
    )
