#### Project Setup

To start the project, in the root create .env with these two variables, with your own values.

MONGO_URI
JWT_SECRET

After that run this command

```bash
npm install && npm start
```

SETUP STEPS:

1. Uncomment addAdminUser() function in app.js to create first admin user
2. Kindly provide token you get from login in bearer token for authorisation
3. Import Postman JSON file from project to check APIs
