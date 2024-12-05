const express = require("express");
const bodyParser = require('body-parser');
const formData = require("express-form-data");
const os = require("os");


const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(bodyParser.json()) 
app.use(bodyParser.urlencoded({extended:true}))
const options = {
    uploadDir: os.tmpdir(),
    autoClean: true
};
app.use(formData.parse(options));


app.use("/api/tasks", require("./router.js"));   

app.listen(port, ()=>{
    console.log(`Application is listening on ${port}`);
});