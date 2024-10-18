from flask import Flask,make_response,request,jsonify,session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from datetime import datetime, timedelta
from flask_bcrypt import Bcrypt
from sqlalchemy import func
from flask_cors import CORS

from models import db,Group,Attendance,Member,MemberEvent,Event,Admin
from flask_restful import Resource,Api
from sqlalchemy.exc import SQLAlchemyError
import os

app=Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] ="sqlite:///app.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"]=False
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True 

migrate=Migrate(app,db)
db.init_app(app)
api=Api(app)
bcrypt=Bcrypt(app)
# CORS(app)
CORS(app, resources={r"/*": {"origins": "*"}})

#secret key
app.secret_key=os.urandom(24)

# #Endpoints
# @app.before_request
# def before_login():
#     protected_endpoints=['admins']
#     if request.endpoint in protected_endpoints and request.method =='GET' and 'user_id' not in session:
#         return jsonify (
#             {
#                 "message":"Please log in"
#             }
            
#         )


class HomeMembers(Resource):
    # def get(self):
    #     members_dict = [member.to_dict(only=('first_name', 'last_name')) | {'group_name': member.group.name} for member in Member.query.all()]
    #     return make_response(members_dict, 200)
    

     def get(self):
        # if 'user_id' not in session:
        #     return {"message":"Please Login in to acess resources"}
        members_dict = []
        for member in Member.query.all():
            member_info = member.to_dict(only=('first_name', 'last_name','dob','occupation','school' ,'location','will_be_coming'))
            member_info.update({'group_name': member.group.name})
            members_dict.append(member_info)
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
                
            print("Received data:",data)    
        
        # Fetch the group instance
            group = Group.query.get(data['group_id'])
            if not group:
                return {'error': 'Group not found.'}, 404
            new_member = Member(
            first_name=data['first_name'],
            last_name=data['last_name'],
            group=group,
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
            
    def get(self):
        members = [member.to_dict(rules=('-group.members','-attendances', '-events','-memberevents',)) for member in Member.query.all()]
        return members, 200
    
class AdminMemberSearch(Resource):
    def get(self, id):
        member = Member.query.filter(Member.first_name==id).first()
        if member:
            member_dict = member.to_dict(rules=('-group.members','-attendances', '-events','-memberevents',))
            response = make_response(member_dict, 200)
            return response
        else:
            response_body = {
                "error": "member not found"
            }
            return make_response(response_body, 404)
        
    def patch(self, id):
        member = Member.query.filter(Member.id==id).first()
        if member:
            # loop to get the attributes
            data = request.get_json()
            for attr in data:
                setattr(member, attr, data[attr])

            db.session.commit()
            return make_response(jsonify(member.to_dict(rules=('-group.members','-attendances', '-events','-memberevents',))), 200)
        else:
            response_body = {"error": "Member not found"}
            response = make_response(response_body, 400)
            return response

    def delete(self, id):
        member = Member.query.filter(Member.id==id).first()
        
        # if not member:
        #     return {"error": f"Member {id} not found"}, 400
        
        db.session.delete(member)
        db.session.commit()

        response_dict = {"message": f"Member {id} deleted successfully"}
        response = make_response(response_dict, 200)
        return response
        
class AttendanceDetails(Resource):
    def get(self):
        try:
            total_members = Member.query.all()
            attendance_data = []

            for member in total_members:
                attendance = Attendance.query.filter_by(member_id=member.id).first()
                
                if attendance is not None:
                    attendance_info = {
                        'id': member.id,
                        'firstname': member.first_name,
                        'lastname': member.last_name,
                        'attendanceDate': attendance.date,
                        'present': attendance.status == 'present'
                    }
                else: 
                    attendance_info = {
                        'id': member.id,
                        'firstname': member.first_name,
                        'lastname': member.last_name,
                        'attendanceDate': 'N/A',
                        'present': attendance.status == False
                    }
                
                attendance_data.append(attendance_info)

            return jsonify(attendance_data), 200
        
        except Exception as e:
            response = {'error': str(e)}
            return make_response(response, 500)


class AttendanceReports(Resource):
    def get(self):
        try:
            total_members = Member.query.count()
            # find total number of attendances for the last month
            last_month = datetime.now() - timedelta(days=30)
            total_attendance = Attendance.query.filter(Attendance.date >= last_month).count()

            # calculate attendance percentage
            if total_members > 0:
                attendance_percentage = (total_attendance / total_members) * 100
            else: 
                attendance_percentage = 0

            # calculate absent members
            absent_members = total_members - total_attendance

            # find today's date to find the last Sunday
            today = datetime.now()
            # The last sunday
            last_sunday = today - timedelta(days=today.weekday() + 1)

            attendance_count = Attendance.query.filter(func.date(Attendance.date) == last_sunday.date()).count()
            attendance_percentage = (attendance_count / total_members) * 100 if total_members > 0 else 0

            # data to return
            report_info = {
                'totalMembers': total_members,
                'attendancePercentage': attendance_percentage,
                'absentMembers': absent_members,
                'lastSunday': last_sunday.strftime('%Y-%m-%d'),
                'currentSunday': today.strftime('%Y-%m-%d') if today.weekday() == 6 else None
            }

            return report_info, 200
        
        except Exception as e:
            return {'error': str(e)}, 500
        
class Admins(Resource):

    def get(self):
        admins_dict = [admin.to_dict(only=('id', 'username')) for admin in Admin.query.all()]
        return make_response(admins_dict, 200)
    
    def post(self):
        username=request.json["username"]
        password=request.json["password"]

        hashed_pass=bcrypt.generate_password_hash(password).decode("utf-8")
        new_user=Admin(username=username,password=hashed_pass)
        db.session.add(new_user)
        db.session.commit()
        return {
            "message":"User succesfully created"
        }
    

class Login(Resource):
    def post(self):
        username = request.json.get("username")
        password = request.json.get("password")  

        user=Admin.query.filter_by(username=username).first()
        if user and bcrypt.check_password_hash(user.password,password):
            session["user_id"]=user.id

            return make_response( {
            "message":"Login successfull"
         },200)
        return make_response({
            "message":"Invalid Credentials"
        },401)
    
class Logout(Resource):
    def post(self):
        session.pop('user_id',None)

        return jsonify({
            "message":"Logout sucessfully"
        })

           







api.add_resource(HomeMembers, '/homemembers')
api.add_resource(HomeMember_name, '/homemembers/<string:name>')
api.add_resource(AdminRegistry, '/adminregistry')
api.add_resource(AdminMemberSearch, '/adminsearch/<int:id>')
api.add_resource(AttendanceReports, '/reports')
api.add_resource(AttendanceDetails, '/attendancedetails')
api.add_resource(Admins,'/admins')
api.add_resource(Login,'/login')
api.add_resource(Logout,'/logout')



if __name__ == "__main__":
    app.run(port=5555,debug=True)