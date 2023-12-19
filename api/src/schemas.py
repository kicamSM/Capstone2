
from pydantic import BaseModel, EmailStr, field_validator, Field
from datetime import datetime, date, time
from typing import Union, Optional, Any, Annotated, List, Literal, TypeAlias
# !just added below will see if it works
# from . import models
import re

# ! THIS IS MY PYDANTIC MODEL

print("schemas.py is running")
    
# User Pydantic Models

# states_list = [
#         'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT','DE','FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ','NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
#         ]

#  **** Token schemas for testing Authentication *** 

# class Token(BaseModel):
#     access_token: str
#     token_type: str


# class TokenData(BaseModel):
#     username: str | None = None
#     # ! note that for authentication it seems that I must have a username field so may have to adjust that from derby_name

#  **** User Pydantic Models  *** 

class UserBase(BaseModel): 
    user_id: int = Field(default_factory=lambda: 0)
    # derby_name: str
    username: str
    email: str     
    
class UserCreate(UserBase):
    password: str
    
class UserDelete(BaseModel): 
    user_id: int 
    password: str
    

class UserUpdate(UserBase):
    first_name: str
    last_name: str
    facebook_name: str
    about: str
    primary_number: int
    secondary_number: int
    level: str
    ruleset_id: int
    position_id: int
    location_id: int
    associated_leagues: str
   
    
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
    ruleset_id: Optional[int] = None
    position_id: Optional[int] = None
    location_id: Optional[int] = None
    associated_leagues: Optional[str] = None
    
    @field_validator('level', mode="before")
    @classmethod
    def level_must_be_valid(cls, value):
        if value not in ['AA', 'A', 'B', 'C', None]:
            raise ValueError('Invalid level')
        return value
    
# * note with this you dont have to have the user_id in the object but you could change this. 

class UserDelete(BaseModel):
    user_id: int
    password: str
    
class Ruleset(BaseModel): 
    ruleset_id: int = Field(default_factory=lambda: 0)
    wftda: bool
    usars: bool
    banked_track: bool
    short_track: bool


class Position(BaseModel): 
    position_id: int = Field(default_factory=lambda: 0)
    jammer: bool
    pivot: bool
    blocker: bool   
    
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
    # jersey_colors: str
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