//instead of starting json server as usual in our terminal 
// of system we have to neccesarily start it in vs code only 
// but not using usual json-server --watch --port portnumber dbname.json command
//once you have downloaded the folder with updated hashing password code follow below instructions
//do npm install
//in case it gives 1 high vulnerability do 
//rm -rf package-lock.json node_modules
//npm clean cache --force
//npm install
//after this do 
//npm install json-server@0.17.4 json-server-auth@2.1.0
//now you are ready to start the server itself,starting it will start the authentication and load existing data also 
//use node server.cjs to start it 
//

const jsonServer = require('json-server');
const auth = require('json-server-auth');

const app = jsonServer.create();
const router = jsonServer.router('./my_db.json');
app.db = router.db;
const middlewares = [
  jsonServer.defaults(),
  auth
];

app.use(middlewares);
app.use(router);

app.listen(5000, () => {
  console.log(' JSON Server + Auth running on http://localhost:5000');
});
