import express from "express";
import { authController } from "./auth.controller";
import {
  authenticateAdminToken,
  authenticateClientToken,
  authenticateEmployeeToken,
  // authenticateUserToken,
} from "./auth.middleware";

const router = express.Router();

router.post("/login", authController.login);
// router.post("/admin-login", authController.adminLogin);
// router.post("/change-password", authController.changePassword);
// router.post("/admin_change-password", authController.adminChangePassword);
// router.get(
//   "/admin/profile",
//   authenticateAdminToken,
//   authController.getAdminProfile
// );
// router.get(
//   "/employee/profile",
//   authenticateEmployeeToken,
//   authController.getEmployeeProfile
// );
// router.get(
//   "/client/profile",
//   authenticateClientToken,
//   authController.getClientProfile
// );
// router.get(
//   "/user/profile",
//   // authenticateUserToken,
//   authController.getUserProfile
// );

// router.post("/forgot", authController.forgotPassword);
// router.post("/verify-otp", authController.verifyOtp);
// router.post("/reset-password", authController.resetPassword);

export const authRoutes = router;

/*
i will send welcome message in masking SMS used API
provide backend and frontend code

*/