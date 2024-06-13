import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { generateNextStudentProfileId } from "../../../utils/generateId";
import { connection } from "../../config";
import { formattedDate } from "../../../shared/formattedDate";
import bcrypt from "bcryptjs";

const createStudent = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const generateId = await generateNextStudentProfileId();
      const studentData = req.body;
      const hashedPassword = await bcrypt.hash(studentData.password, 10);
      const newStudent = {
        profile_id: generateId,
        name: studentData.name,
        email: studentData.email,
        password: hashedPassword,
        role: "student",
        phone: studentData.phone,
        image:
          "https://www.vhv.rs/dpng/d/15-155087_dummy-image-of-user-hd-png-download.png",
        status: "publish",
        created_at: formattedDate,
        updated_at: formattedDate,
      };

      const query = "INSERT INTO student SET ?";
      connection.query(query, newStudent, (error: any, results: any) => {
        if (error) {
          console.error("Error creating new student:", error.message);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Student created fail, check your number and email",
            errorMessages: [
              {
                path: req.originalUrl,
                message: error.message,
              },
            ],
          });
        }

        const createdClientId = results.insertId;
        sendResponse(res, {
          statusCode: httpStatus.CREATED,
          success: true,
          message: "Student created successfully",
          data: { id: createdClientId },
        });

        // Optionally, handle SMS sending in a separate async function
      });
    } catch (error) {
      next(error);
    }
  }
);

export const StudentController = {
  createStudent,
};
