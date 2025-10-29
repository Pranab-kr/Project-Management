import { ApiResponce } from "../utils/api-responce.js";
import { asyncHandler } from "../utils/async-handler.js";

// const healthCheck = (req, res, next) => {
//   try {
//     res.status(200).json(new ApiResponce(200, {message: "server is running"}))
//   } catch (error) {
//     next(error);
//   }
// };

const healthCheck = asyncHandler(async (req, res, next) => {
  res.status(200).json(new ApiResponce(200, { message: "server is running" }));
});

export { healthCheck };
