import { NextFunction, Request, Response } from "express";
import sendResponse from "../../../shared/sendResponse";
import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import { generateNextStudentProfileId } from "../../../utils/generateId";
import { connection } from "../../config";
import { formattedDate } from "../../../shared/formattedDate";
import bcrypt from "bcryptjs";

const getAllStudents = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Parse pagination parameters
    const page = parseInt(req.query.page as string, 10) || 1;
    const limit = parseInt(req.query.limit as string, 10) || 20;
    const startIndex = (page - 1) * limit;

    // Get search term
    const searchTerm = (req.query.searchTerm as string) || "";
    const queryParams: (string | number)[] = [];

    // Construct the base query
    let query = `SELECT * FROM student`;
    let whereClause = "";

    // Add search term to the where clause
    if (searchTerm) {
      whereClause = ` WHERE (name LIKE ? OR profile_id LIKE ? OR phone LIKE ? OR email LIKE ? OR status LIKE ?)`;
      const term = `%${searchTerm}%`;
      for (let i = 0; i < 5; i++) {
        queryParams.push(term); // Add term for matching against 5 columns
      }
    }

    // Complete the query with the where clause and pagination
    if (whereClause) {
      query += whereClause;
    }

    // Add order by and limit clause
    query += ` ORDER BY id DESC LIMIT ?, ?`;
    queryParams.push(startIndex, limit);

    // Query to get the total count for pagination
    const grandTotalQuery = `SELECT COUNT(*) AS count FROM student ${
      whereClause ? `WHERE ${whereClause.slice(7)}` : ""
    }`; // Remove leading "WHERE" from whereClause

    // Execute count query
    connection.query(
      grandTotalQuery,
      queryParams.slice(0, -2),
      (error: any, grandTotalResult: any[], fields: any) => {
        if (error) {
          console.error("Error fetching grand total:", error);
          return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: "Internal Server Error",
            errorMessages: [
              { path: req.originalUrl, message: "Error fetching grand total" },
            ],
          });
        }

        const grandTotal = grandTotalResult[0]?.count || 0;

        // Execute the main query
        connection.query(query, queryParams, (error, results) => {
          if (error) {
            console.error("Error fetching students:", error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
              success: false,
              message: "Internal Server Error",
              errorMessages: [
                { path: req.originalUrl, message: "Error fetching students" },
              ],
            });
          }

          // Send successful response with data
          res.status(httpStatus.OK).json({
            success: true,
            message: "Students fetched successfully",
            data: {
              students: results,
              pagination: {
                currentPage: page,
                totalPages: Math.ceil(grandTotal / limit),
                totalItems: grandTotal,
              },
            },
          });
        });
      }
    );
  } catch (error) {
    console.error("Error in getAllStudents:", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
      errorMessages: [
        { path: req.originalUrl, message: "Error in getAllStudents" },
      ],
    });
  }
};

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
  getAllStudents,
};
