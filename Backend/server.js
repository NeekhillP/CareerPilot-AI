import "dotenv/config";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import app from "./src/app.js";
import connectDB from "./src/config/database.js";


connectDB();

app.listen(3000, ()=>{
    console.log("Server is running on port 3000");
})