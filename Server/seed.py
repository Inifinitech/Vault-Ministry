import random
from app import app
from models import db,Group,Attendance,Member,Event,MemberEvent
from faker import Faker

fake = Faker()
        
def church_events():
    events=[
        "Family Gathering",
        "Community Worship",
        "Prayer Service",
        "Bible Study",
        "Youth Retreat",
        "Charity Bake Sale",
        "Praise Concert",
        "Volunteer Day",
        "Harvest Festival",
        "Mission Trip Fundraiser",

    ]   
    return random.choice(events)      

if __name__ == '__main__':
    with app.app_context():
        print('Clearing db...')
        MemberEvent.query.delete()
        Attendance.query.delete()
        Member.query.delete()
        Event.query.delete()
        Group.query.delete()


        print("Seeding groups...")

        groups=[]
        for i in range(20):
            group=Group(
                name=fake.name()
            )
            groups.append(group)
        db.session.add_all(groups)   
        db.session.commit() 


        print("Seeding members.py ....")

        members=[]
        for i in range (30):
            member=Member(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                dob=fake.date(),
                location=fake.city(),
                phone=fake.phone_number(),
                is_student=fake.boolean(chance_of_getting_true=50),
                will_be_coming=fake.boolean(chance_of_getting_true=50),
                is_visitor=fake.boolean(chance_of_getting_true=50),
                school=fake.company(),
                occupation=fake.job(),
                group_id=random.choice(groups).id#randomly selects a group from groups
                )
            members.append(member)
        db.session.add_all(members) 
        db.session.commit()   


        print("Seeding attendances....")
        attendances=[]
        for i in range(20):
            attendance=Attendance(
                date=fake.date(),
                status=random.choice(['present','absent','excused']),
                member_id=random.choice(members).id#randomly selects a memebr id from the memebrs list
            )
            attendances.append(attendance)
        db.session.add_all(attendances)   
        db.session.commit() 

        print("Seeding events")
        events=[]
        for i in range(30):
            event=Event(
               name=church_events()
            )
            events.append(event)
        db.session.add_all(events)  
        db.session.commit()  


        print("Seeding member events...")

        memberevents=[]
        for i in range(50):
            memberevent=MemberEvent(
                member_id=random.choice(members).id,  # Randomly select a member
                event_id=random.choice(events).id    # Randomly select an event
                )
            memberevents.append(memberevent)
        db.session.add_all(memberevents)  
        db.session.commit()  
            
