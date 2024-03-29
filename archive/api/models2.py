

# ! working instance of ruleset with one to many relationship (should be many to many)

class User(SQLAlchemyBase):
    __tablename__ = "user"
    
    user_id = Column(Integer, Identity(), primary_key=True, index=True)
    # ! changing derby name to username but will have it appear as derby_name in frontend.
    # derby_name = Column(String, unique=True)
    username = Column(String, unique=True)
    hashed_password = Column(String)
    email = Column(String, unique=True, index=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    facebook_name = Column(String, nullable=True)
    about = Column(String, nullable=True)
    primary_number = Column(Integer, nullable=True)
    secondary_number = Column(Integer, nullable=True)
    level = Column(String, nullable=True)
    ruleset_id = Column(Integer, ForeignKey("ruleset.ruleset_id"), nullable=True)
    position_id = Column(Integer, ForeignKey("position.position_id"), nullable=True)
    location_id = Column(Integer, ForeignKey("location.location_id"), nullable=True)
    associated_leagues = Column(String, nullable=True)

class Ruleset(SQLAlchemyBase):
    __tablename__ = "ruleset"

    ruleset_id = Column(Integer, primary_key=True)
    wftda = Column(Boolean)
    usars = Column(Boolean)  
    banked_track = Column(Boolean)
    short_track = Column(Boolean) 
    user = relationship("User", backref="ruleset")

#! end of working instance ruleset 


class Insurance(SQLAlchemyBase):
    __tablename__ = "insurance"  
    insurance_id = Column(Integer, primary_key=True)
    WFTDA = Column(String)
    USARS = Column(String)
    other = Column(String)
    user = relationship("UserInsurance", back_populates="insurance")

# class Location(SQLAlchemyBase):
#     __tablename__ = "location"

#     location_id = Column(Integer, primary_key=True)
#     city = Column(String)
#     state = Column(String)    
#     user = relationship("UserLocation", back_populates="location")
    
    
class User(SQLAlchemyBase):
    __tablename__ = "user"
    # ! note other user items are already in user table 
    
    insurance = relationship("UserInsurance", back_populates="user")
    # location = relationship("UserLocation", back_populates="user")
  
    
    # ! it may be more efficient to have played rulesets and maybe associated leagues in a table? Check that out later. 
    
    # class UserRuleset(SQLAlchemyBase):
    # __tablename__ = "user_ruleset"

    # user_id = Column(String, ForeignKey("user.user_id"), primary_key=True)
    # ruleset_id = Column(Integer, ForeignKey("ruleset.ruleset_id"), primary_key=True)
    # user = relationship("User", back_populates="ruleset")
    # ruleset = relationship("Ruleset", back_populates="user")
    # # ! note that backref seems to be working better 
    # users = relationship("Users", backref="rulesets")
    # ruleset = relationship("Rulesets")
    
# class UserPosition(SQLAlchemyBase):
#     __tablename__ = "user_position"

#     user_id = Column(String, ForeignKey("user.user_id"), primary_key=True)
#     position_id = Column(Integer, ForeignKey("position.position_id"), primary_key=True)
#     user = relationship("User", back_populates="position")
#     position = relationship("Position", back_populates="user")
    
class UserInsurance(SQLAlchemyBase):
    __tablename__ = "user_insurance"

    user_id = Column(String, ForeignKey("user.user_id"), primary_key=True)
    insurance_id = Column(Integer, ForeignKey("insurance.insurance_id"), primary_key=True)
    user = relationship("User", back_populates="insurance")
    insurance = relationship("Insurance", back_populates="user")
    # user = relationship("User", backref="insurance")
    # insurance = relationship("Insurance")

    
    
# class UserLocation(SQLAlchemyBase):
#     __tablename__ = "user_location"

#     user_id = Column(String, ForeignKey("user.user_id"), primary_key=True)
#     location_id = Column(Integer, ForeignKey("location.location_id"), primary_key=True)
#     user = relationship("User", back_populates="location")
#     location = relationship("Location", back_populates="user")
    # user = relationship("User", backref="location")
    # location = relationship("Location")

# class UserLeagueAssociation(Base):
#     __tablename__ = "user_league_associations"

#     user_id = Column(String, ForeignKey("users.user_id"), primary_key=True)
#     league_id = Column(Integer, ForeignKey("leagues.league_id"), primary_key=True)
#     user = relationship("User", backref="associated_leagues")
#     league = relationship("League")
    
        # items = relationship("Item", back_populates="owner") 
      
class Event(SQLAlchemyBase):
    __tablename__ = "event"
    # ! note other user items are already in Event table 
    address_id = Column(Integer, ForeignKey("address.id"), nullable=False)
    jersey_colors = Column(String)
        
# class Address(SQLAlchemyBase):
#     __tablename__ = "address"

#     address_id = Column(Integer, primary_key=True)
#     street_address = Column(String)
#     city = Column(String)
#     state = Column(String)
#     zip_code = Column(String)
    
# class EventAddress(SQLAlchemyBase):
#     __tablename__ = "event_address"

#     event_id = Column(String, ForeignKey("event.event_id"), primary_key=True)
#     address_id = Column(Integer, ForeignKey("address.address_id"), primary_key=True)
#     event = relationship("Event", back_populates="address")
#     address = relationship("Adress", back_populates="event")
    
    
# class EventDetail(SQLAlchemyBase):
#     __tablename__ = "event_detail"

#     event_det_id = Column(Integer, Identity(), primary_key=True)
#     event_id = Column(Integer, ForeignKey("event.event_id"), primary_key=True, index=True, unique=True)
#     # event = relationship(
#     #     "Event", back_populates="details", uselist=False, polymorphic_identity="type"
#     # )
#     events = relationship("Event", back_populates="detail")



# ****************NOTES BELOW THIS ******************
# from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
# from sqlalchemy.orm import relationship


# class User(Base):
#     __tablename__ = "users"

#     id = Column(Integer, primary_key=True, index=True)
#     email = Column(String, unique=True, index=True)
#     hashed_password = Column(String)
#     is_active = Column(Boolean, default=True)

#     items = relationship("Item", back_populates="owner")


# class Item(Base):
#     __tablename__ = "items"

#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, index=True)
#     description = Column(String, index=True)
#     owner_id = Column(Integer, ForeignKey("users.id"))

#     owner = relationship("User", back_populates="items")
    