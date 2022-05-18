import * as http from "http";
import app from "./server/app.js";

const port = process.env.PORT || 3000;

app.set("port", port);
const server = http.createServer(app);

server.listen(port);



