# linkedin-backend
# market-place-backend-mongoDB
```jsx
npm i
```
## API for profiles
```jsx
https://buildweek3-backend.herokuapp.com/profiles
```

## POST product method requiremnts
```jsx
{
        "firstName": "",
        "surName": "",
        "email": "",
        "bio": "",
        "title": "",
        "area": "",
        "image": "",
        "username": "should be unique",
}
```

## API for upload profile image to cloudinary*
```jsx
https://buildweek3-backend.herokuapp.com/profiles/${profileId}/image
```
* Image should be single
* If you uploading with Postman form-data name should be "image" 

## API for profile experiences part
```jsx
https://buildweek3-backend.herokuapp.com/profiles/${profileId}/experiences
```
## POST experiences to profile method requiremnts
```jsx
{
    "role": "",
    "company":"",
    "startDate": "2002-12-09",
    "endDate": "2002-12-09",
    "description": "",
    "username":"should be unique",
    "area":"",
    "image": ""
}
```

## API for upload experience image to cloudinary*
```jsx
https://buildweek3-backend.herokuapp.com/profiles/${profileId}/experiences/${experienceId}/image
```
* Image should be single
* If you uploading with Postman form-data name should be "image" 

