import random
from app import app
from models import db, Group, Attendance, Member, Event, MemberEvent, Admin
from faker import Faker
from datetime import datetime, timedelta

fake = Faker()

def church_events():
    events = [
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
        Admin.query.delete()

        print("Seeding groups...")
        groups = [Group(name=fake.name()) for _ in range(20)]
        db.session.add_all(groups)   
        db.session.commit() 

        print("Seeding members...")
        members = []
        for _ in range(30):
            member = Member(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                dob=fake.date_of_birth(minimum_age=18, maximum_age=80),  # Ensure realistic dob
                location=fake.city(),
                phone=fake.phone_number(),
                is_student=fake.boolean(chance_of_getting_true=50),
                will_be_coming=fake.boolean(chance_of_getting_true=50),
                is_visitor=fake.boolean(chance_of_getting_true=50),
                school=fake.company(),
                occupation=fake.job(),
                group_id=random.choice(groups).id
            )
            members.append(member)
        db.session.add_all(members) 
        db.session.commit()   

        print("Seeding attendances...")
        today = datetime.now()
        days_to_sunday = 6 - today.weekday() if today.weekday() < 6 else 0
        attendance_dates = [(today + timedelta(days=i)).strftime('%Y-%m-%d') for i in range(7)]  # Next week
        attendances = [
            Attendance(
                date=random.choice(attendance_dates),  # Random date within the week
                status=random.choice(['present', 'absent']),
                member_id=random.choice(members).id
            ) for _ in range(20)
        ]
        db.session.add_all(attendances)
        db.session.commit()

        print("Seeding events...")
        events = [Event(name=church_events()) for _ in range(30)]
        db.session.add_all(events)  
        db.session.commit()  

        print("Seeding member events...")
        memberevents = [
            MemberEvent(
                member_id=random.choice(members).id,
                event_id=random.choice(events).id
            ) for _ in range(50)
        ]
        db.session.add_all(memberevents)
        db.session.commit()

        print("Seeding users...")
        admins = [Admin(username=fake.user_name(), password=fake.password()) for _ in range(5)]
        db.session.add_all(admins)
        db.session.commit()

        print("Seeding completed.")
