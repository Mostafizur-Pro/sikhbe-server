import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"; // for generating JWT tokens
import { config, pool } from "../../config";
import bcrypt from "bcryptjs";

const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  try {
    const connection = await pool.getConnection();

    const [studentData]: any = await connection.query(
      "SELECT * FROM student WHERE email = ?",
      [email]
    );

    const student = studentData[0];
    if (!student) {
      return res.status(401).json({ message: "Can't find email." });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Don't match password." });
    }

    connection.release();

    const token = jwt.sign(
      { adminId: student.id, email: student.email },
      // "secret",
      config.jwt_secret as string,
      { expiresIn: "1d" }
    );

    res.status(200).json({ token, student });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// const changePassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { currentPassword, newPassword, profile_id, profile } = req.body;

//   if (!currentPassword || !newPassword) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Missing required fields." });
//   }

//   try {
//     const connection = await pool.getConnection();

//     const [employeeData] = await connection.query(
//       "SELECT * FROM employee_info WHERE profile_id = ?",
//       [profile_id]
//     );
//     const [clientData] = await connection.query(
//       "SELECT * FROM client_data WHERE profile_id = ?",
//       [profile_id]
//     );

//     const employee = employeeData as Employee[];
//     const client = clientData as unknown as Employee[];

//     // Check if the retrieved data contains passwords
//     const isEmpMatch = employee && employee[0]?.password === currentPassword;
//     const isClientMatch = client && client[0]?.password === currentPassword;

//     if (isEmpMatch) {
//       await connection.query(
//         "UPDATE employee_info SET password = ? WHERE profile_id = ?",
//         [newPassword, profile_id]
//       );
//     } else if (isClientMatch) {
//       await connection.query(
//         "UPDATE client_data SET password = ? WHERE profile_id = ?",
//         [newPassword, profile_id]
//       );
//     }

//     connection.release();

//     res
//       .status(200)
//       .json({ success: true, message: "Password updated successfully." });
//   } catch (error) {
//     console.error("Error changing password:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error." });
//   }
// };

// export const adminLogin = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     const connection = await pool.getConnection();

//     const [adminData]: any = await connection.query(
//       "SELECT * FROM admin_info WHERE admin_email = ?",
//       [email]
//     );

//     const admin = adminData[0];
//     if (!admin) {
//       return res.status(401).json({ message: "Invalid credentials." });
//     }

//     const isMatch = await bcrypt.compare(password, admin.password);

//     if (!isMatch) {
//       return res.status(401).json({ message: "Invalid credentials." });
//     }

//     connection.release();

//     const token = jwt.sign(
//       { adminId: admin.id, email: admin.admin_email },
//       // "secret",
//       config.jwt_secret as string,
//       { expiresIn: "1y" }
//     );

//     res.status(200).json({ token, admin });
//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ message: "Internal Server Error." });
//   }
// };

// const getAdminProfile = (req: Request, res: Response) => {
//   const { admin }: any = req;
//   res.json({ admin });
// };
// const getEmployeeProfile = (req: Request, res: Response) => {
//   const { employee }: any = req;
//   res.json({ employee });
// };
// const getClientProfile = (req: Request, res: Response) => {
//   const { client }: any = req;
//   res.json({ client });
// };
// const getUserProfile = (req: Request, res: Response) => {
//   const { user }: any = req;
//   res.json({ user });
// };

// const adminChangePassword = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { currentPassword, newPassword, profile_id } = req.body;

//   if (!currentPassword || !newPassword) {
//     return res
//       .status(400)
//       .json({ success: false, message: "Missing required fields." });
//   }

//   try {
//     const connection = await pool.getConnection();

//     const [employeeData]: any = await connection.query(
//       "SELECT * FROM admin_info WHERE profile_id = ?",
//       [profile_id]
//     );

//     // const employee = employeeData[0]; // Assuming you expect only one employee

//     if (!employeeData) {
//       connection.release();
//       return res
//         .status(404)
//         .json({ success: false, message: "Employee not found." });
//     }

//     const isMatch = await bcrypt.compare(
//       currentPassword,
//       employeeData[0].password
//     );

//     if (!isMatch) {
//       connection.release();
//       return res
//         .status(401)
//         .json({ success: false, message: "Current password is incorrect." });
//     }

//     const hashedNewPassword = await bcrypt.hash(newPassword, 10);

//     await connection.query(
//       "UPDATE admin_info SET password = ? WHERE profile_id = ?",
//       [hashedNewPassword, profile_id]
//     );

//     connection.release();

//     res
//       .status(200)
//       .json({ success: true, message: "Password updated successfully." });
//   } catch (error) {
//     console.error("Error changing password:", error);
//     res.status(500).json({ success: false, message: "Internal Server Error." });
//   }
// };

// const forgotPassword = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { input } = req.body;
//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     const formattedDate = new Date()
//       .toISOString()
//       .slice(0, 19)
//       .replace("T", " ");

//     if (!input) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Email or number is required." });
//     }

//     try {
//       const [numberResults]: any = await pool.query(
//         "SELECT * FROM client_data WHERE number = ?",
//         [input]
//       );
//       const [emailResults]: any = await pool.query(
//         "SELECT * FROM client_data WHERE email = ?",
//         [input]
//       );

//       if (numberResults.length === 0 && emailResults.length === 0) {
//         return res
//           .status(404)
//           .json({ success: false, message: "User not found." });
//       }

//       if (numberResults.length > 0) {
//         const number = numberResults[0].number;
//         // const message = `Your OTP is ${otp}`;
//         const message = `bProfile আপনার Password Reset রিকোয়েস্টটি সম্পূর্ণ হয়েছে। আপনার password reset bProfile-এর OTP হল ${otp}. Do not share this OTP.`;
//         const params = {
//           masking: "NOMASK",
//           userName: smsAPI.USERNAME,
//           password: smsAPI.PASSWORD,
//           MsgType: "TEXT",
//           receiver: number,
//           message: message,
//         };

//         await axios.get(smsAPI.SMS_API_URL, { params });

//         const [otpResults]: any = await pool.query(
//           "SELECT * FROM otps WHERE number = ?",
//           [number]
//         );

//         if (otpResults.length > 0) {
//           await pool.query(
//             "UPDATE otps SET otp = ?, updated_at = ? WHERE number = ?",
//             [otp, formattedDate, number]
//           );
//         } else {
//           await pool.query(
//             "INSERT INTO otps (number, otp, created_at, updated_at) VALUES (?, ?, ?, ?)",
//             [number, otp, formattedDate, formattedDate]
//           );
//         }
//         if (params) {
//           await pool.query(
//             "INSERT INTO sms_otps (number, otp, created_at, updated_at) VALUES (?, ?, ?, ?)",
//             [number, otp, formattedDate, formattedDate]
//           );
//         }

//         return res
//           .status(200)
//           .json({ success: true, message: "OTP sent to your phone number." });
//       }

//       if (emailResults.length > 0) {
//         const email = emailResults[0].email;
//         // Handle email OTP sending (if applicable)
//         // Example: await sendEmailOtp(email, otp);

//         const [otpResults]: any = await pool.query(
//           "SELECT * FROM otps WHERE email = ?",
//           [email]
//         );

//         if (otpResults.length > 0) {
//           await pool.query(
//             "UPDATE otps SET otp = ?, updated_at = ? WHERE email = ?",
//             [otp, formattedDate, email]
//           );
//         } else {
//           await pool.query(
//             "INSERT INTO otps (email, otp, created_at, updated_at) VALUES (?, ?, ?, ?)",
//             [email, otp, formattedDate, formattedDate]
//           );
//         }

//         return res
//           .status(200)
//           .json({ success: true, message: "OTP sent to your email." });
//       }
//     } catch (error) {
//       console.error("Error during forgot password process:", error);
//       return res
//         .status(500)
//         .json({ success: false, message: "Internal server error." });
//     }
//   }
// );

// const verifyOtp = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { input, otp } = req.body;

//     if (!input || !otp) {
//       // Change && to ||
//       return res
//         .status(400)
//         .json({ success: false, message: "Email or number is required." });
//     }

//     const [otpResults]: any = await pool.query(
//       "SELECT * FROM otps WHERE (number = ? OR email = ?) AND otp = ?",
//       [input, input, otp]
//     );

//     // console.log("otpResults", otpResults);

//     const [numberResults]: any = await pool.query(
//       "SELECT * FROM client_data WHERE number = ? OR email = ?",
//       [input, input]
//     );

//     if (otpResults.length === 0 || numberResults.length === 0) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found." });
//     }

//     const clientProfile = numberResults[0];

//     if (otpResults) {
//       // Simplify the comparison
//       return res.status(200).json({
//         success: true,
//         message: "OTP verified successfully.",
//         data: clientProfile,
//       });
//     } else {
//       return res
//         .status(400)
//         .json({ success: false, message: "Invalid OTP. Please try again." });
//     }
//   }
// );

// const resetPassword = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { currentPassword, newPassword, profile_id, profile } = req.body;
//     console.log("data", currentPassword);
//     if (!currentPassword || !newPassword) {
//       return res
//         .status(400)
//         .json({ success: false, message: "Missing required fields." });
//     }

//     try {
//       const connection = await pool.getConnection();

//       const [clientData] = await connection.query(
//         "SELECT * FROM client_data WHERE profile_id = ?",
//         [profile_id]
//       );
//       const client = clientData as unknown as Employee[];
//       const isClientMatch = client && client[0]?.password === currentPassword;

//       if (isClientMatch) {
//         await connection.query(
//           "UPDATE client_data SET password = ? WHERE profile_id = ?",
//           [newPassword, profile_id]
//         );
//       }

//       connection.release();
//       res
//         .status(200)
//         .json({ success: true, message: "Password updated successfully." });
//     } catch (error) {
//       console.error("Error changing password:", error);
//       res
//         .status(500)
//         .json({ success: false, message: "Internal Server Error." });
//     }
//   }
// );

export const authController = {
  login,
  // adminLogin,
  // getAdminProfile,
  // changePassword,
  // adminChangePassword,
  // getEmployeeProfile,
  // getClientProfile,
  // getUserProfile,
  // forgotPassword,
  // verifyOtp,
  // resetPassword,
};
