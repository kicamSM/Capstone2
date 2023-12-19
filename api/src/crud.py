from sqlalchemy.orm import Session

from . import models, schemas
from fastapi import Request
from typing import Union, Optional, Any, Annotated, List, Literal, TypeAlias

# By creating functions that are only dedicated to interacting with the database (get a user or an item) independent of your path operation function, you can more easily reuse them in multiple parts and also add unit tests for them.

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.user_id == user_id).first()

# def get_user_by_id_with_password(db: Session, user_id: int):
#     return db.query(models.User).filter(models.User.user_id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()
  
def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def get_bout_by_id(db: Session, event_id: int):
    return db.query(models.Bout).filter(models.Bout.event_id == event_id).first()

def get_bout_by_address_date_time_team_opposing_team(db: Session, bout: schemas.Bout): 
    return db.query(models.Bout).filter(models.Bout.address_id == bout.address_id, models.Bout.time == bout.time, models.Bout.date == bout.date, models.Bout.team == bout.team, models.Bout.opposing_team == bout.opposing_team).first()
    

def get_mixer_by_address_date_time_theme(db: Session, mixer: schemas.Mixer): 
    print("**** mixer ******:", mixer)
    found_mixer = db.query(models.Mixer).filter(models.Mixer.address_id == mixer.address_id, models.Mixer.time == mixer.time, models.Mixer.date == mixer.date, models.Mixer.theme == mixer.theme).first()
    print("**** found mixer ***** ", found_mixer)
    return found_mixer

def get_mixer_by_id(db: Session, event_id: int):
    return db.query(models.Mixer).filter(models.Mixer.event_id == event_id).first()


def create_user(db: Session, user: schemas.UserCreate):
# def create_user(derby_name: str, email: str, password: str, db: Session, user: schemas.UserCreate):
    print("create user in crud.py is working")
    print("user in crud.py:", user)
    password = user.password + "notreallyhashed"
    
    db_user = models.User(username=user.username, email=user.email, hashed_password=password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    return db_user

def update_user(db: Session, user: schemas.UserUpdate, user_id): 
    print("user in update user crud.py", user)
    print("you are hitting update_user in crud.py")
      
    db_user = get_user_by_id(db, user_id)
    
    user = {
    # "derby_name": user.derby_name,
    "username": user.username,
    "email": user.email,
    "first_name": user.first_name, 
    "last_name": user.last_name,
    "facebook_name": user.facebook_name, 
    "about": user.about,
    "primary_number": user.primary_number, 
    "secondary_number": user.secondary_number,
    "level": user.level,
    "ruleset_id": user.ruleset_id,
    "position_id": user.position_id,
    "location_id": user.location_id,
    "associated_leagues": user.associated_leagues
    }
    
    print("db user in update user:", db_user)
    
    for field, value in user.items():
        print("field:", field)
        print("value:", value)
        if value is not None: 
            setattr(db_user, field, value)
            print(f"Updating field: {field} with value: {value}")
    
    print("db_user UPDATED:", db_user)

    db.commit()
    # db.refresh(user)
    return user 

def delete_user(db: Session, user: schemas.UserDelete, user_id): 
    # print("user in delete user crud.py", user)
    # print("you are hitting delete_user in crud.py")
      
    # db_user = get_user_by_id_with_password(db, user_id)
    db_user = get_user_by_id(db, user_id)
    print("!!!!! db_user!!!!! ", db_user)
    print("!!!!! db_user.user_id!!!!! ", db_user.user_id)
    
    # if db_user.password is not user.password: 
    #     ValueError("Incorrect password provided for user deletion.")
        
        
    db.delete(db_user)
    db.commit()
    
    return db_user

    
# *Events CRUD 

def get_events(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.EventBase).offset(skip).limit(limit).all()

def get_bouts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Bout).offset(skip).limit(limit).all()

def get_mixers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Mixer).offset(skip).limit(limit).all()

def create_bout(db: Session, bout: schemas.Bout):

    # db_bout = models.Bout(type=bout.type, date=bout.date, address_id=bout.address_id, time=bout.time, time_zone=bout.time_zone, theme=bout.theme, description=bout.description, level=bout.level, co_ed=bout.co_ed, ruleset=bout.ruleset, opposing_team=bout.opposing_team, team=bout.team, jersey_colors=bout.jersey_colors)
    
    db_bout = models.Bout(type=bout.type, date=bout.date, address_id=bout.address_id, time=bout.time, time_zone=bout.time_zone, theme=bout.theme, description=bout.description, level=bout.level, co_ed=bout.co_ed, ruleset=bout.ruleset, opposing_team=bout.opposing_team, team=bout.team)
     
    db.add(db_bout)
    db.commit()
    db.refresh(db_bout)
    
    return db_bout

def create_mixer(db: Session, mixer: schemas.Mixer):

    db_mixer = models.Mixer(type=mixer.type, date=mixer.date, address_id=mixer.address_id, time=mixer.time, time_zone=mixer.time_zone, theme=mixer.theme, description=mixer.description, level=mixer.level, co_ed=mixer.co_ed, ruleset=mixer.ruleset, signup_link=mixer. signup_link)
     
    db.add(db_mixer)
    db.commit()
    db.refresh(db_mixer)
    
    return db_mixer

def update_bout(db: Session, bout: schemas.BoutUpdate, event_id): 

    db_bout = get_bout_by_id(db, event_id)
    
    bout = {
    "type": bout.type,
    "date": bout.date,
    "address_id": bout.address_id,
    "time": bout.time,
    "time_zone": bout.time_zone, 
    "theme": bout.theme, 
    "description": bout.description, 
    "level": bout.level,
    "co_ed": bout.co_ed, 
    "ruleset": bout.ruleset,
    "jersey_colors": bout.jersey_colors,
    "opposing_team": bout.opposing_team, 
    "team": bout.team
    }

    for field, value in bout.items():
        if value is not None: 
            setattr(db_bout, field, value)
            print(f"Updating field: {field} with value: {value}")
            
    print("db_bout UPDATED:", db_bout)

    db.commit()

    return bout

def update_mixer(db: Session, mixer: schemas.MixerUpdate, event_id): 

    db_mixer = get_mixer_by_id(db, event_id)
    
    mixer = {
    "type": mixer.type,
    "date": mixer.date,
    "address_id": mixer.address_id,
    "time": mixer.time,
    "time_zone": mixer.time_zone,
    "theme": mixer.theme, 
    "description": mixer.description,
    "level": mixer.level,
    "co_ed": mixer.co_ed, 
    "ruleset": mixer.ruleset,
    "jersey_colors": mixer.jersey_colors,
    "signup_link": mixer.signup_link
    }

    for field, value in mixer.items():
        if value is not None: 
            setattr(db_mixer, field, value)
            print(f"Updating field: {field} with value: {value}")
            
    print("db_bout UPDATED:", db_mixer)

    db.commit()

    return mixer

def delete_bout(db: Session, bout: schemas.EventDelete, event_id): 
    # print("user in delete user crud.py", user)
    # print("you are hitting delete_user in crud.py")
      
    # db_user = get_user_by_id_with_password(db, user_id)
    db_bout = get_bout_by_id(db, event_id)
    print("!!!!! db_bout!!!!! ", db_bout)
    print("!!!!! db_bout.event_id!!!!! ", db_bout.event_id)
    
    # if db_user.password is not user.password: 
    #     ValueError("Incorrect password provided for user deletion.")
        
        
    db.delete(db_bout)
    db.commit()
    
    return db_bout

def delete_mixer(db: Session, mixer: schemas.EventDelete, event_id): 

    db_mixer = get_mixer_by_id(db, event_id)
    print("!!!!! db_mixer!!!!! ", db_mixer)
    print("!!!!! db_mixer.event_id!!!!! ", db_mixer.event_id)
    
    # if db_user.password is not user.password: 
    #     ValueError("Incorrect password provided for user deletion.")
        
        
    db.delete(db_mixer)
    db.commit()
    
    return db_mixer

#  *** CRUD addresses ***


def create_address(db: Session, address: schemas.Address):
    print("address in create_address!!!!!:", address)
    # print("****** address.name *******", address.name)
    # db_address = models.Address(name=address.name, street_address=address.street_address, city=address.city, state=address.state, zip_code=address.zip_code)
    db_address = models.Address(street_address=address.street_address, city=address.city, state=address.state, zip_code=address.zip_code)
    db.add(db_address)
    db.commit()
    db.refresh(db_address)
    
    return db_address.address_id
    # return db_address
    

def get_addresses(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Address).offset(skip).limit(limit).all()

def get_address(db: Session, address: schemas.Address):
    return db.query(models.Address).filter(models.Address.street_address == address.street_address, models.Address.city == address.city, models.Address.state == address.state, models.Address.zip_code == address.zip_code).first()

def get_address_by_id(db: Session, address_id: int):
    return db.query(models.Address).filter(models.Address.address_id == address_id).first()
# def get_user_by_id(db: Session, user_id: int):
#     return db.query(models.User).filter(models.User.user_id == user_id).first()

#  *** CRUD rulesets ***

def get_rulesets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Ruleset).offset(skip).limit(limit).all()

def get_ruleset(db: Session, ruleset: schemas.Ruleset):
    
    test = db.query(models.Ruleset).filter(models.Ruleset.wftda == ruleset.wftda, models.Ruleset.usars == ruleset.usars, models.Ruleset.banked_track == ruleset.banked_track, models.Ruleset.short_track == ruleset.short_track).first()
    
    print("&&& test &&&", test)
  
    return test

def get_ruleset_by_id(db: Session, ruleset_id: int):
    return db.query(models.Ruleset).filter(models.Ruleset.ruleset_id == ruleset_id).first()

# def create_ruleset(db: Session, wftda: bool, usars: bool, banked_track: bool, short_track:bool):
def create_ruleset(db: Session, ruleset: schemas.Ruleset):
#     print("ruleset in create_ruleset!!!!!:", wftda, usars, banked_track, short_track)
    # print("****** address.name *******", address.name)
    # db_address = models.Address(name=address.name, street_address=address.street_address, city=address.city, state=address.state, zip_code=address.zip_code)
    # db_ruleset = models.Ruleset(wftda=ruleset.wftda, usars=ruleset.usars, banked_track=ruleset.banked_track, short_track=ruleset.short_track)
    db_ruleset = models.Ruleset(wftda=ruleset.wftda, usars=ruleset.usars, banked_track=ruleset.banked_track, short_track=ruleset.short_track)
    db.add(db_ruleset)
    db.commit()
    db.refresh(db_ruleset)
    
    return db_ruleset.ruleset_id
    # return db_address
    
#  *** CRUD positions ***
    
def get_positions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Position).offset(skip).limit(limit).all()

def get_position(db: Session, position: schemas.Position):
    
    # test = db.query(models.Ruleset).filter(models.Ruleset.wftda == ruleset.wftda, models.Ruleset.usars == ruleset.usars, models.Ruleset.banked_track == ruleset.banked_track, models.Ruleset.short_track == ruleset.short_track).first()
    
    # print("&&& test &&&", test)
  
    # return test
    
    return db.query(models.Position).filter(models.Position.jammer == position.jammer, models.Position.pivot == position.pivot, models.Position.blocker == position.blocker).first()

def get_position_by_id(db: Session, position_id: int):
    return db.query(models.Position).filter(models.Position.position_id == position_id).first()

def create_position(db: Session, position: schemas.Position):
    # print("****** address.name *******", address.name)
    # db_address = models.Address(name=address.name, street_address=address.street_address, city=address.city, state=address.state, zip_code=address.zip_code)
    # db_ruleset = models.Ruleset(wftda=ruleset.wftda, usars=ruleset.usars, banked_track=ruleset.banked_track, short_track=ruleset.short_track)
    db_position = models.Position(jammer=position.jammer, pivot=position.pivot, blocker=position.blocker)
    db.add(db_position)
    db.commit()
    db.refresh(db_position)
    
    return db_position.position_id

#  *** CRUD locations ***

def get_locations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Location).offset(skip).limit(limit).all()

def get_location(db: Session, location: schemas.Location):
    print("hitting location in crud")
    
    return db.query(models.Location).filter(models.Location.city == location.city, models.Location.state == location.state).first()

def get_location_by_id(db: Session, location_id: int):
    return db.query(models.Location).filter(models.Location.location_id == location_id).first()

def create_location(db: Session, location: schemas.Location):
    
    db_location = models.Location(city=location.city, state=location.state)
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    
    return db_location.location_id
   