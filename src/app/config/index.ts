import mysql from "mysql2";
import mysql1 from "mysql2/promise";

export const connection = mysql.createConnection({
  host: "localhost",
  // user: "nedujbgc_admin_bprofile",
  // password: "businessProfile123",
  // database: "nedujbgc_bprofile",
  user: "root",
  password: "",
  database: "sikhbe",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const pool = mysql1.createPool({
  host: "localhost",
  // user: "nedujbgc_admin_bprofile",
  // password: "businessProfile123",
  // database: "nedujbgc_bprofile",
  user: "root",
  password: "",
  database: "sikhbe",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const config = {
  node_env: "production",
  port: 5000,
  bycrypt_salt_round: 12,
  jwt_secret: "secret", // Ensure jwt_secret is of type string
  jwt_expires_in: "3d",
  jwt_refresh_token: "very very secret", // Ensure jwt_refresh_token is of type string
  jwt_refresh_expires_in: "750d",
};

// export const smsAPI = {
//   SMS_API_URL:
//     "https://api.boom-cast.com/boomcast/WebFramework/boomCastWebService/OTPMessage.php",
//   // USERNAME: "bProfile",
//   // PASSWORD: "bprofile@76#",
//   USERNAME: "bPROFILE",
//   PASSWORD: "616b1f6ab935bb9adbb8b693b6ba8f15",
// };

// export const smsAPI_Mask = {
//   SMS_API_URL:
//     "http://api.boom-cast.com/boomcast/WebFramework/boomCastWebService/externalApiSendTextMessage.php?",
//   USERNAME: "bPROFILE",
//   PASSWORD: "616b1f6ab935bb9adbb8b693b6ba8f15",
// };

// export const sslAPI = {
//   STORE_ID: "bprofileorglive",
//   STORE_PASSWD: "66669BB67985444701",
// };
