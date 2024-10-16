from flask import Flask,make_response,request,jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

from models import db,Group,Attendance,Member,MemberEvent,Event
from flask_restful import Resource,Api
from sqlalchemy.exc import SQLAlchemyError

app=Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] ="sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True 

migrate=Migrate(app,db)
db.init_app(app)
api=Api(app)

class HomeMembers(Resource):
    def get(self):
        members_dict = [member.to_dict(only=('first_name', 'last_name')) | {'group_name': member.group.name} for member in Member.query.all()]
        return make_response(members_dict, 200)
    
class HomeMember_name(Resource):
    def get(self, name):
        members = Member.query.filter(Member.first_name == name).first()
        if members:
            member_dict = members.to_dict(only=('first_name', 'last_name')) |  {'group_name': members.group.name}
            response = make_response(member_dict, 200)
            return response
        else:
            response_body = {
                "error": "member not found"
            }
            return make_response(response_body, 404)

class AdminRegistry(Resource):
    def post(self):
            data = request.get_json()
        
        # Check for required fields
            required_fields = ['first_name', 'last_name', 'group_id']
        
            for field in required_fields:
                if field not in data:
                    return {'error': f'Missing field: {field}'}, 400
        
        # Fetch the group instance
            group = Group.query.get(data['group_id'])
            if not group:
                return {'error': 'Group not found.'}, 404
            new_member = Member(
            first_name=data['first_name'],
            last_name=data['last_name'],
            group=group,  # Assign the group instance
            dob=data.get('dob'),
            location=data.get('location'),
            phone=data.get('phone'),
            occupation=data.get('occupation'),
            is_student=data.get('is_student', False),
            will_be_coming=data.get('will_be_coming', False),
            is_visitor=data.get('is_visitor', False),
            school=data.get('school')
        )
            try:
                db.session.add(new_member)
                db.session.commit()
                return make_response(new_member.to_dict(), 201)
            except Exception as e:
                db.session.rollback()
                return {'error': str(e)}, 500
            
api.add_resource(HomeMembers, '/homemembers')
api.add_resource(HomeMember_name, '/homemembers/<string:name>')
api.add_resource(AdminRegistry, '/adminregistry')

if __name__ == "__main__":
    app.run(port=5555,debug=True)