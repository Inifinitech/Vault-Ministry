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

        # List of groups from your frontend dropdown
        group_names = [
            "Transformers",
            "Relentless",
            "Innovators",
            "Pacesetters",
            "Ignition",
            "Gifted",
            "Visionaries",
            "Elevated"
        ]

        groups = []
        for name in group_names:
            group = Group(name=name)
            groups.append(group)
        db.session.add_all(groups)
        db.session.commit()

        print("Seeding members.py ....")

        members = []
        for i in range(30):
            member = Member(
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
                group_id=random.choice(groups).id  # Randomly select a group from groups
            )
            members.append(member)
        db.session.add_all(members)
        db.session.commit()

        print("Seeding attendances....")

        # Calculate this week's Sunday
        today = datetime.now()
        days_to_sunday = 6 - today.weekday() if today.weekday() < 6 else 0  # Ensures we always get this week's Sunday
        attendance_date = (today + timedelta(days=days_to_sunday)).strftime('%Y-%m-%d')  # Get this Sunday's date

        attendances = []
        for i in range(20):
            attendance = Attendance(
                date=attendance_date,  # This week's Sunday
                status=random.choice(['present', 'absent']),
                member_id=random.choice(members).id  # Randomly select a member id from the members list
            )
            attendances.append(attendance)
        db.session.add_all(attendances)
        db.session.commit()

        print("Seeding events")
        events = []
        for i in range(30):
            event = Event(name=church_events())
            events.append(event)
        db.session.add_all(events)
        db.session.commit()

        print("Seeding member events...")

        memberevents = []
        for i in range(50):
            memberevent = MemberEvent(
                member_id=random.choice(members).id,  # Randomly select a member
                event_id=random.choice(events).id  # Randomly select an event
            )
            memberevents.append(memberevent)
        db.session.add_all(memberevents)
        db.session.commit()

        print("Seeding users...")
        admins = []
        user = Admin(
            username=fake.user_name(),
            password='tripin'
        )
        admins.append(user)

        db.session.add_all(admins)
        db.session.commit()
