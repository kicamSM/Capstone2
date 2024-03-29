
from pydantic import BaseModel, EmailStr, field_validator, Field
from datetime import datetime, date, time
from typing import Union, Optional, Any, Annotated, List, Literal, TypeAlias
from pydantic.utils import GetterDict
# !just added below will see if it works
# from . import models
import re

# ! THIS IS MY PYDANTIC MODEL

# ? userRulesets pydantic model 
# todohttps://www.gormanalysis.com/blog/many-to-many-relationships-in-fastapi/

SECRET_KEY = "0e4f3587ea32a1b62169336a04a71efc160b34c93c3f03bdc1895c6058dbbcec"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

print("schemas.py is running")

#  **** Token schemas for testing Authentication *** 

class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: str | None = None
#     # ! note that for authentication it seems that I must have a username field so may have to adjust that from derby_name

#  **** User Pydantic Models  *** 

# **** user ruleset pyndantic models

class UserRuleset(BaseModel):
    # id: int
    user_id: int
    ruleset_id: int

    class Config:
        from_attributes = True
        # getter_dict = UserRulesetGetter
        
class UserPosition(BaseModel):
    user_id: int
    position_id: int

    class Config:
        from_attributes = True

# class UserMessage(BaseModel):
#     # user_id: int
#     sender_id: int
#     message_id: int
#     participant_ids: list[int]
#     # ! pull participant ids off and stick all ids on to chat 

    class Config:
        from_attributes = True
        
# *** end user ruleset pydantic models ***

# class UserBase(BaseModel): 
#     user_id: int = Field(default_factory=lambda: 0)
#     # derby_name: str
#     username: str
#     email: str     
    
class UserCreate(UserBase):
    password: str
    
class UserDelete(BaseModel): 
    user_id: int 
    password: str
    
class Ruleset(BaseModel): 
    ruleset_id: int = Field(default_factory=lambda: 0)
    name: str
    
    @field_validator('name')
    def validate_rulesets(cls, v):
        ruleset_list = [
        'WFTDA', 'USARS', 'banked track', 'short track'
        ]
        if v not in ruleset_list:
            raise ValueError("Invalid ruleset")
        return v  

    class Config:
        from_attributes = True

class Position(BaseModel): 
    position_id: int = Field(default_factory=lambda: 0)
    position: str
    
    @field_validator('position')
    def validate_rulesets(cls, v):
        position_list = [
        'jammer', 'pivot', 'blocker'
        ]
        if v not in position_list:
            raise ValueError("Invalid position")
        return v  

    class Config:
        from_attributes = True
        
        
class UserInsurance(BaseModel):
    user_id: int
    insurance_id: int
    insurance_number: str

    class Config:
        from_attributes = True
        
class Insurance(BaseModel): 
    insurance_id: int = Field(default_factory=lambda: 0)
    type: str
    insurance_number: str
    # todo unsure about this above line 
    
    @field_validator('type')
    def validate_insurance(cls, v):
        insurance_list = [
        'WFTDA', 'USARS', 'other'
        ]
        if v not in insurance_list:
            raise ValueError("Invalid insurance")
        return v  

    class Config:
        from_attributes = True
        
class InsuranceOutput(BaseModel): 
    insurance_id: int = Field(default_factory=lambda: 0)
    type: str
    
    @field_validator('type')
    def validate_insurance(cls, v):
        insurance_list = [
        'WFTDA', 'USARS', 'other'
        ]
        if v not in insurance_list:
            raise ValueError("Invalid insurance")
        return v 
    
class UserGroup(BaseModel):
    user_id: int
    group_id: int

    class Config:
        from_attributes = True 
    
class Group(BaseModel): 
    group_id: int = Field(default_factory=lambda: 0)
    name: str
    
    # class Config:
    #     from_attributes = True 
    
class CreateGroup(BaseModel): 
    name: str
    participant_ids: list[int]
    
    # class Config:
    #     from_attributes = True 
    
class Message(BaseModel): 
    message_id: int = Field(default_factory=lambda: 0)
    chat_id: int
    message: str
    date_time: str
    sender_username: str
    sender_id: int
  

    # class Config:
    #     from_attributes = True
        
class Chat(BaseModel):
    chat_id: int = Field(default_factory=lambda: 0)
    # name: str
    group_id: int
    # participant_ids: list[int]
    # type: str
    # group_id: int
    
    class Config:
        from_attributes = True
        
class ChatObject(BaseModel): 
    chat_id: int
    name: str
    
#     @field_validator('type')
#     def validate_us_states(cls, v):
#         group_list = [
#         'team', 'event', 'user'
#         ]

#         if v.upper() not in group_list:
#             raise ValueError("Invalid Group Code")
#         return v 


# ! just added this to handle the isnurance number    
# class InsuranceUpdate(Insurance): 
#     insurance_number = str 

class UserUpdate(UserBase):
    phone_number: str
    first_name: str
    last_name: str
    facebook_name: str
    additional_info: str
    about: str
    primary_number: int
    secondary_number: int
    level: str
    ruleset: Ruleset = None
    position: Position = None
    insurance: Insurance = None
    message: Message = None
    location_id: int
    associated_leagues: str
    # ruleset_id: int
    # position_id: int
    
    @field_validator('phone_number', mode="before")
    @classmethod
    def phone_number_must_be_valid(cls, value):
        phone_regex = r"^\d{10}$"  
        if not re.match(phone_regex, value):
            raise ValueError("Invalid phone number format. Please enter a 10-digit number")
        return value
   
    
# class UserDetailsPublic(UserBase): 
#     facebook_name: Optional[str] = ""
#     about: Optional[str] = ""
#     primary_number: Optional[int] = 0
#     level: Optional[str] = ""
#     associated_leagues: Optional[str] = ""
#     ruleset_id: Optional[int] = 0

class UserDetailsPublic(UserBase): 
    facebook_name: Optional[str] = None 
    about: Optional[str] = None 
    primary_number: Optional[int] = None
    level: Optional[str] = None 
    ruleset: Optional[list[UserRuleset]] = None
    position: Optional[list[UserPosition]] = None
    insurance: Optional[list[UserInsurance]] = None
    location_id: Optional[int] = None
    associated_leagues: Optional[str] = None
    # ruleset_id: Optional[int] = None
    # position_id: Optional[int] = None
    
    @field_validator('level', mode="before")
    @classmethod
    def level_must_be_valid(cls, value):
        if value not in ['AA', 'A', 'B', 'C', None]:
            raise ValueError('Invalid level')
        return value
    
class UserDetailsPrivate(UserDetailsPublic): 
    phone_number: Optional[str] = None
    first_name: Optional[str] = None 
    last_name: Optional[str] = None 
    additional_info: Optional[str] = None
    secondary_number: Optional[int] = None
    
# * note with this you dont have to have the user_id in the object but you could change this. 

class UserDelete(BaseModel):
    user_id: int
    password: str
    

class Location(BaseModel):
    location_id: int = Field(default_factory=lambda: 0)
    city: str
    state: str
    
    @field_validator('state')
    def validate_us_states(cls, v):
        states_list = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT','DE','FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ','NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
        ]

        if v.upper() not in states_list:
            raise ValueError("Invalid State Code")
        return v   
    

    
# Event Pydantic Models



class EventBase(BaseModel):
    event_id: int = Field(default_factory=lambda: 0)
    type: str
    date: str
    address_id: int
    time: str
    time_zone: str
    theme: str
    description: str
    level: str
    co_ed: bool
    ruleset: str
    floor_type: str
    jersey_colors: str
    # address: Address
    
    class Config:
        from_attributes = True
    
    @field_validator('level', mode="before")
    @classmethod
    def level_must_be_valid(cls, value):
        if value not in ['AA',  'AA/A', 'A', 'A/B', 'B', 'B/C', 'C', 'All Levels']:
            raise ValueError('Invalid level')
        return value
    
    @field_validator('ruleset', mode="before")
    @classmethod
    def ruleset_must_be_valid(cls, value):
        if value not in ['WFTDA',  'USARS', 'Banked Track', 'Short Track']:
            raise ValueError('Invalid ruleset')
        return value


class Address(BaseModel):
    address_id: int = Field(default_factory=lambda: 0)
    # name: Optional[str]
    # name: str
    street_address: str
    city: str
    state: str
    zip_code: str
    # events: EventBase
    
    @field_validator('state')
    @classmethod
    def validate_us_states(cls, value):
        states_list = [
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT','DE','FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ','NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
        ]
        if value.upper() not in states_list:
            raise ValueError("Invalid State Code")
        return value
    
class Bout(EventBase):
    opposing_team: str
    team: str
    

class Mixer(EventBase):
    signup_link: str
    
    
# class Address(BaseModel):
#     address_id: Field(default_factory=lambda: 0)
#     name: Optional[int]
#     street_address: str
#     city: str
#     state: str
#     zip_code: str
    
#     @field_validator('state')
#     @classmethod
#     def validate_us_states(cls, value):
#         states_list = [
#         'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT','DE','FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ','NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
#         ]
#         if value.upper() not in states_list:
#             raise ValueError("Invalid State Code")
#         return value
    


# class EventAddress(BaseModel):
#     event_id: int
#     address_id: int
#     event: 
#     address: 
    

class BoutUpdate(EventBase):
    opposing_team: str
    team: str
     
class MixerUpdate(EventBase):
    signup_link: str
    
class EventDelete(BaseModel): 
    event_id: int 

class MessageDelete(BaseModel): 
    message_id: int
    
# class MessageWithUser(Message): 
#     message: Message
#     user_id: int
    
class MessageObject(BaseModel): 
    message_id: int
    # user_id: int
    sender_id: int
    sender_username: str
    participant_ids: list[int]
    message: str
    date_time: str
    
    @property
    def user_id(self):
        return self.sender_id

    
    
class Test(BaseModel): 
    info: str