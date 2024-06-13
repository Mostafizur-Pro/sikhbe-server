import express from "express";
import { StudentRoutes } from "../modules/Student/student.routes";

const router = express.Router();

const moduleRoutes = [
  // {
  //   path: "/",
  //   route: authRoutes,
  // },

  {
    path: "/student",
    route: StudentRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
