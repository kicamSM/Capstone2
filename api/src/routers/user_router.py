from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Annotated
from ..dependencies import get_and_validate_current_user, get_db, hash_password
# from .. import settings
from ..settings import debug

from ..schemas.user_schema import *
from ..schemas.location_schema import *

from ..crud.user_crud import *
from ..crud.insurance_crud import *
from ..crud.location_crud import *
from ..crud.position_crud import *
from ..crud.ruleset_crud import *

router = APIRouter(
    prefix="/users",
    tags=["users"],
    dependencies=[Depends(get_and_validate_current_user)],
)

# * get /users/ 
# * returns all users  

@router.get("/", response_model=list[UserList])
def get_users(city: str = Query(None), state: str = Query(None), username: str = Query(None), skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    
    print("you are hitting users route in user_router.py !!!!!!!!!! ")
    
    
    users = crud_get_users(db, city=city, state=state, username=username, skip=skip, limit=limit)
    
    print("users in get_users crud.py", users)
    print("users[0] in get_users crud.py", users[0])
    print("users[0].image in get_users crud.py", users[0].image)

    return users

# * get /users/{userId} 
# * returns one specific user

@router.get("/{user_id}", response_model=UserDetailsPublic)
# Note: this allows us to get user information that is public information not private information so private information is not being sent back and forth through the api.
def get_user(user_id: int, db: Session = Depends(get_db)):
    print("YOU ARE HITTING THE /users/{user_id} ROUTE")
    print("user_id in USER ROUTER!!! ERROR:", user_id)
    
    user = crud_get_user_by_id(db, user_id=user_id)
    
    if user_id is None: 
        raise HTTPException(status_code=404, detail=f"User with derby name {user_id} not found.")
    
    return user

# * get /users/username/{user_id} 
# * returns username by use_id

@router.get("/username/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    print("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
    
    username = crud_get_username_by_id(db, user_id=user_id)
    
    if username is None: 
        raise HTTPException(status_code=404, detail=f"User with user id {user_id} not found.")
    
    return username

# * get /users/image/{userId} 
# * returns one image from specific user

@router.get("/image/{user_id}", response_model=UserImage)
def get_user_image(user_id: int, db: Session = Depends(get_db)):
    print("YOU ARE HITTING THE /users/{user_id} ROUTE")
    
    user = crud_get_user_by_id(db=db, user_id=user_id)
    
    if user_id is None: 
        raise HTTPException(status_code=404, detail=f"User with id {user_id} not found.")
    
    image = user.image
    if image: 
        print("image in /users/image/{user_id} exists")
        
    imageData = {"image": image}
    
    return imageData


# * put /users/{user_id} 
# * updates an existing user with rulesets and location positions
# * Note: this is not currently getting used as you broke it into two requests 


@router.put("/{user_id}", response_model=UserUpdate)
def update_user(user: UserUpdate, ruleset: list[Ruleset], position: list[Position], insurance: list[Insurance], location: Location, user_id: int, db: Session = Depends(get_db)):
    print("/users/{user_id} is running in user_router.py")
    
    existing_location = crud_get_location(db=db, location=location)
    
    if existing_location: 
        location_id = existing_location.location_id 
    else: 
        location_id = crud_create_location(db=db, location=location)
    
    user.location_id = location_id
    
    for pos in position:
        existing_position = crud_get_position(db=db, position=pos)
    
        if existing_position: 
            position_id = existing_position.position_id 
        else: 
            position_id = crud_create_position(db=db, position=pos)
    
        existing_user_position = crud_get_user_position_by_id(db, user_id=user_id, position_id=position_id)
     
        if not existing_user_position:
            new_e_u_p = crud_create_user_position(db, user_id=user_id, position_id=position_id)
 
    for rs in ruleset: 
        existing_ruleset = crud_get_ruleset(db=db, ruleset=rs) 
    
        if existing_ruleset: 
            ruleset_id = existing_ruleset.ruleset_id
        else: 
            ruleset_id = crud_create_ruleset(db=db, ruleset=rs)

        existing_user_ruleset = crud_get_user_ruleset_by_id(db, user_id=user_id, ruleset_id=ruleset_id)

        if not existing_user_ruleset:
            print("crud existing_user_ruleset does NOT exist")
            new_e_u_r = crud_create_user_ruleset(db, user_id=user_id, ruleset_id=ruleset_id)
   
    for ins in insurance: 

        existing_insurance = crud_get_insurance(db=db, insurance=ins)
      
        if existing_insurance: 
            insurance_id = existing_insurance.insurance_id

        else: 
            insurance_id = crud_create_insurance(db=db, insurance=ins)
 
        existing_user_insurance = crud_get_user_insurance_by_id(db, user_id=user_id, insurance_id=insurance_id)
     
        if not existing_user_insurance:
            new_e_u_i = crud_create_user_insurance(db, user_id=user_id, insurance_id=insurance_id, insurance_number=ins.insurance_number) 

    db_user = crud_get_user_by_id(db, user_id=user_id)    
    
    if not db_user:
        raise HTTPException(status_code=400, detail=f"User with id {user_id} doesn't exist.")
    
    return crud_update_user(db=db, user=user, user_id=user_id)

# * put /users/profile/{user_id} 
# * updates public details on profile by user_id 
# todo: positions and known rulesets are not updating when you put in less than you had originally ie. if I have blocker, pivot, jammer, I cant switch it back to just jammer.

# @router.put("/profile/{user_id}", response_model=UserUpdateProfile)
# def update_user(user: UserUpdateProfile, ruleset: list[Ruleset], position: list[Position], location: Location, user_id: int, db: Session = Depends(get_db)):
#     print("/users/profile/{user_id} is running in user_router.py")
#     # ! location_id is 0 here 
    
    
#     print("**** ruleset ****:", ruleset)
    
#     existing_location = crud_get_location(db=db, location=location)
    
#     if existing_location: 
#         location_id = existing_location.location_id 
#     else: 
#         location_id = crud_create_location(db=db, location=location)
#         print("**************** location_id in main.py***********", location_id)
    
#     user.location_id = location_id
    
#     for pos in position:
#         existing_position = crud_get_position(db=db, position=pos)
    
#         if existing_position: 
#             position_id = existing_position.position_id 
#         else: 
#             position_id = crud_create_position(db=db, position=pos)
    
#         existing_user_position = crud_get_user_position_by_id(db, user_id=user_id, position_id=position_id)
#         print("does existing_user_position exist?", existing_user_position)
#         if not existing_user_position:
#             print("crud existing_user_position does NOT exist")
#             new_e_u_p = crud_create_user_position(db, user_id=user_id, position_id=position_id)
#             # print("new existing user position:", new_e_u_p)
    
#     # !now we have a list of rulesets instead of a singlular ruleset so.... we need to loop through the list and get each ruleset
#     for rs in ruleset: 
#         existing_ruleset = crud_get_ruleset(db=db, ruleset=rs) 
    
#         if existing_ruleset: 
#             ruleset_id = existing_ruleset.ruleset_id
#         else: 
#             ruleset_id = crud_create_ruleset(db=db, ruleset=rs)

#         existing_user_ruleset = crud_get_user_ruleset_by_id(db, user_id=user_id, ruleset_id=ruleset_id)
#         print("does existing_user_ruleset exist?", existing_user_ruleset)
#         if not existing_user_ruleset:
#             print("crud existing_user_ruleset does NOT exist")
#             new_e_u_r = crud_create_user_ruleset(db, user_id=user_id, ruleset_id=ruleset_id)
#             # print("new existing user ruleset:", new_e_u_r)
            
#     # for ins in insurance: 

#     #     existing_insurance = crud_get_insurance(db=db, insurance=ins)
      
#     #     if existing_insurance: 
#     #         insurance_id = existing_insurance.insurance_id

#     #     else: 
#     #         insurance_id = crud_create_insurance(db=db, insurance=ins)
 
#     #     existing_user_insurance = crud_get_user_insurance_by_id(db, user_id=user_id, insurance_id=insurance_id)
     
#     #     if not existing_user_insurance:
#     #         new_e_u_i = crud_create_user_insurance(db, user_id=user_id, insurance_id=insurance_id, insurance_number=ins.insurance_number) 
  
#     print('user in /users/{user_id}', user)
    
#     db_user = crud_get_user_by_id(db, user_id=user_id)    
    
#     if not db_user:
#         raise HTTPException(status_code=400, detail=f"User with id {user_id} doesn't exist.")
    
#     return crud_update_profile_user(db=db, user=user, user_id=user_id)

@router.put("/profile/{user_id}", response_model=UserUpdateProfile)
def update_user(user: UserUpdateProfile, ruleset: list[Ruleset], position: list[Position], location: Location, user_id: int, db: Session = Depends(get_db)):
    if debug:
        print("/users/profile/{user_id} is running in user_router.py")
    # ! location_id is 0 here 
    
    if debug:
        print("**** ruleset ****:", ruleset)
    
    existing_location = crud_get_location(db=db, location=location)
    
    if existing_location: 
        location_id = existing_location.location_id 
    else: 
        location_id = crud_create_location(db=db, location=location)
        if debug:
            print("**************** location_id in main.py***********", location_id)
    
    user.location_id = location_id
    
    for pos in position:
        existing_position = crud_get_position(db=db, position=pos)
    
        if existing_position: 
            position_id = existing_position.position_id 
        else: 
            position_id = crud_create_position(db=db, position=pos)
    
        existing_user_position = crud_get_user_position_by_id(db, user_id=user_id, position_id=position_id)
        if debug:
            print("does existing_user_position exist?", existing_user_position)
        if not existing_user_position:
            print("crud existing_user_position does NOT exist")
            new_e_u_p = crud_create_user_position(db, user_id=user_id, position_id=position_id)
            # print("new existing user position:", new_e_u_p)
    
    # !now we have a list of rulesets instead of a singlular ruleset so.... we need to loop through the list and get each ruleset
    for rs in ruleset: 
        existing_ruleset = crud_get_ruleset(db=db, ruleset=rs) 
    
        if existing_ruleset: 
            ruleset_id = existing_ruleset.ruleset_id
        else: 
            ruleset_id = crud_create_ruleset(db=db, ruleset=rs)

        existing_user_ruleset = crud_get_user_ruleset_by_id(db, user_id=user_id, ruleset_id=ruleset_id)
        if debug:
            print("does existing_user_ruleset exist?", existing_user_ruleset)
        if not existing_user_ruleset:
            print("crud existing_user_ruleset does NOT exist")
            new_e_u_r = crud_create_user_ruleset(db, user_id=user_id, ruleset_id=ruleset_id)
            # print("new existing user ruleset:", new_e_u_r)
            
    # for ins in insurance: 

    #     existing_insurance = crud_get_insurance(db=db, insurance=ins)
      
    #     if existing_insurance: 
    #         insurance_id = existing_insurance.insurance_id

    #     else: 
    #         insurance_id = crud_create_insurance(db=db, insurance=ins)
 
    #     existing_user_insurance = crud_get_user_insurance_by_id(db, user_id=user_id, insurance_id=insurance_id)
     
    #     if not existing_user_insurance:
    #         new_e_u_i = crud_create_user_insurance(db, user_id=user_id, insurance_id=insurance_id, insurance_number=ins.insurance_number) 
    # if settings.debug:
    #     print('user in /users/{user_id}', user)
    
    db_user = crud_get_user_by_id(db, user_id=user_id)    
    
    if not db_user:
        raise HTTPException(status_code=400, detail=f"User with id {user_id} doesn't exist.")
    
    return crud_update_profile_user(db=db, user=user, user_id=user_id)

# * put /users/private/{user_id} 
# * updates private details on profile by user_id 

@router.put("/private/{user_id}", response_model=UserUpdatePrivateDetails)
def update_user(user: UserUpdatePrivateDetails, user_id: int, insurance: list[Insurance] = None, db: Session = Depends(get_db)):
    print("/users/private/{user_id} is running in user_router.py")
    print("************* USER IN USER ROUTER ************", user)
    print("************* INSURANCE IN USER ROUTER ************", insurance)
    
    if insurance is not None: 
        crud_delete_insurance_of_user(db=db, user_id=user_id)
        print("************* user_insurance deleted")
            
        for ins in insurance: 
            print("****inside ins of insurance***")

            existing_insurance = crud_get_insurance(db=db, insurance=ins)
            print("existing_insurance ***", existing_insurance)
        
            if existing_insurance: 
                insurance_id = existing_insurance.insurance_id
                # ! this is the WFTDA USARS or other but you need to chang eth value of the insurance number 
                # updated_insurance = crud_update_insurance_number
                # ! if there is an existing insurance, then delete all insurance with that user id
                # print("insurance_id because of existing insurance !!!", insurance_id)
            
            else: 
                insurance_id = crud_create_insurance(db=db, insurance=ins)
                print("insurance_id after creating insurance !!!", insurance_id)
                
    
            # existing_user_insurance = crud_get_user_insurance_by_id(db, user_id=user_id, insurance_id=insurance_id)

        
            # if not existing_user_insurance:
            # ! create new insurance of user 
            new_e_u_i = crud_create_user_insurance(db, user_id=user_id, insurance_id=insurance_id, insurance_number=ins.insurance_number) 
    
        print('user in /users/private/{user_id}', user)
    
    db_user = crud_get_user_by_id(db, user_id=user_id)    
    
    if not db_user:
        raise HTTPException(status_code=400, detail=f"User with id {user_id} doesn't exist.")
    
    return crud_update_private_user(db=db, user=user, user_id=user_id)


# * get /users/{username}/details 
# * returns one specific user

@router.get("/{username}/details", response_model=UserDetailsTeam)
def get_user_details(username: str, db: Session = Depends(get_db)):
    print("YOU ARE HITTING THE /users/{username}/details ROUTE")
    
    user = crud_get_user_details_by_username(db, username=username)
    
    if username is None: 
        raise HTTPException(status_code=404, detail=f"User with derby name {username} not found.")
    
    return user

# ! Note this test is failing but not using this for the app. Will impliment later.
# * delete /users/{user_id} 
# * deletes an existing user 

# @router.delete("/{user_id}", response_model=UserDelete)
# @router.delete("/{user_id}")
# # def delete_user(user: UserDelete, user_id: int, db: Session = Depends(get_db)):
# def delete_user(user_id: int, db: Session = Depends(get_db)):
    
#     db_user = crud_get_user_by_id(db, user_id=user_id)      
    
#     if not db_user:
#         raise HTTPException(status_code=400, detail=f"User with id {user_id} doesn't exist.")
    
#     res = crud_delete_user(db=db, user_id=user_id)
#     return res
