import http from "http";
import dotenv from "dotenv";
import app from "./app";
import { connectDB } from "./config/db";
import { initSocket } from "./sockets/socket";

dotenv.config();

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
