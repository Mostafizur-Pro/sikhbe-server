import http from "http";
import { Server as HTTPServer } from "http";
import app from "./app";
import dotenv from "dotenv";
import { AddressInfo } from "net";

dotenv.config();

const port = process.env.PORT || 3000;

// Create an HTTP server
const server: HTTPServer = http.createServer(app);

// Start the HTTP server
server.listen(port, () => {
  const address = server.address() as AddressInfo;
  console.log(`Server is running on port ${address.port}`);
});
