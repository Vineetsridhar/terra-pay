'''
    Terra-Pay
    Flask Web server that handles API endpoints
'''
import os
from flask import Flask, send_from_directory, request
from dotenv import load_dotenv, find_dotenv
import sqlite3

con = sqlite3.connect('users.db', check_same_thread=False)
cur = con.cursor()

cur.execute('CREATE TABLE IF NOT EXISTS users (name VARCHAR(32), username VARCHAR(32));')

load_dotenv(find_dotenv())  

APP = Flask(__name__, static_folder='./build/static')

@APP.route('/newUser', methods=['POST'])
def newUser():
    data = request.json
    if "name" not in data or "username" not in data:
        return {'success':False, 'message': "Params missing"}, 400
    cur.execute('INSERT INTO users (name, username) VALUES ("%s", "%s")' % (data["name"], data["username"]))
    con.commit()
    return {'success': True}, 200

@APP.route('/getUsers', methods=['POST'])
def getUsers():
    data = cur.execute('SELECT * FROM users')
    output = [item[0] for item in data] #returns only name
    return {'success': True, "data":output}, 200


@APP.route('/test', methods=['GET'])
def handler_user_funding():
    return {'success': True }, 200

# Note we need to add this line so we can import app in the python shell
if __name__ == "__main__":
    APP.run(
        host=os.getenv('IP', '0.0.0.0'),
        port=8081 if os.getenv('C9_PORT') else int(os.getenv('PORT', "8081")),
        debug=True
    )
