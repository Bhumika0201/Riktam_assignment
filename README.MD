#### Project Setup

To start the project, in the root create .env with these two variables, with your own values.

MONGO_URI
JWT_SECRET

After that run this command

```bash
npm install && npm start
```

PROBLEM STATEMENT
Technical Assignment Task:
Build a simple application which provides web services to facilitate group chat and manage data.
Admin APIs (only admin can add users)

- Manage Users (create user, edit user)
  Any User (normal user, admin user) –
  Authentication APIs (login, logout)
  Groups (Normal User) –
  Manage groups (create, delete, search and add members, etc). All users are visible to all users.
  Group Messages (Normal User)
- Send messages in group
- Likes message, etc

SETUP STEPS:

1. Uncomment addAdminUser() function in app.js to create first admin user
2. Kindly provide token you get from login in bearer token for authorisation
3. Import Postman JSON file from project to check APIs
