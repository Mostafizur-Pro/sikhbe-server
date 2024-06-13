import express from "express";
import { StudentController } from "./student.controller";

const router = express.Router();

router.get("/get-student", StudentController.getAllStudents);
// router.get("/download", clientController.downloadClientsExcel);
// router.get("/all", clientController.getAllClientData);
// router.get("/:id", clientController.getClientById);
router.post("/create-student", StudentController.createStudent);
// router.put("/:id", uploadClient.single("image"), clientController.updateClient);
// router.put(
//   "/emp/:id",
//   uploadClient.single("image"),
//   clientController.updateEmpClient
// );
// router.delete("/:id", clientController.deleteClient);

export const StudentRoutes = router;
