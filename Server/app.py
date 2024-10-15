from flask import Flask,make_response,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from models import db,Group,Attendance,Member,MemberEvent,Event
from flask_restful import Resource,Api
from sqlalchemy.exc import SQLAlchemyError

app=Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] ="sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
app.json.compact=False

migrate=Migrate(app,db)
db.init_app(app)
api=Api(app)

if __name__ == "__main__":
    app.run(port=5555,debug=True)