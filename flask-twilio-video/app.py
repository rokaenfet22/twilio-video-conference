import os
from dotenv import load_dotenv
from flask import Flask, render_template, request, abort
from twilio.jwt.access_token import AccessToken 
from twilio.jwt.access_token.grants import VideoGrant

# app verifies user and then generates access token for user. Requires to be made in python, to access .env
# user authentication to be done here

"""load_dotenv()
account_sid = os.environ.get('TWILIO_ACCOUNT_SID')
api_key_sid  = os.environ.get('TWILIO_API_KEY_SID')
api_key_secret  = os.environ.get('TWILIO_API_KEY_SECRET')"""
account_sid = "AC41bea7d63de8d62fcccf5c9fe09ad43b"
api_key_sid = "SKe1a97112baf54dce25ba37bd39ee8fe8"
api_key_secret = "Dk481eWQibqcWNmVw9zsdqrSadE5H5fo"


app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html')

@app.route("/login",methods=["POST"])
def login():
    username = request.get_json(force=True).get("username")
    if not username: abort(401)
    token = AccessToken(account_sid, api_key_sid, api_key_secret, identity=username)
    token.add_grant(VideoGrant(room="My Room"))
    return {"token": token.to_jwt()}

"""
{
    "token": <token>
}
"""