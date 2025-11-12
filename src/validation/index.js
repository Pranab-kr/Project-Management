import { body } from "express-validator";

export const userRegisterationValidation = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("invalid email format"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLowercase()
      .withMessage("username must be lowercase")
      .isLength({ min: 3 })
      .withMessage("username must be at least 3 characters long"),

    body("password")
      .trim()
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 6 })
      .withMessage("password must be at least 6 characters long"),
  ];
};

export const userLoginValidation = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("invalid email format"),

    body("password").trim().notEmpty().withMessage("password is required"),
  ];
};


export const userchangeCurrentPasswordValidation = () => {
  return [
    body("oldPassword").trim().notEmpty().withMessage("old password is required"),

    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("new password is required")
      .isLength({ min: 6 })
      .withMessage("new password must be at least 6 characters long"),
  ];
};

export const userForgotPasswordValidation = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("invalid email format"),
  ];
};

export const userResetForgotPasswordValidation = () => {
  return [
    body("newPassword")
      .trim()
      .notEmpty()
      .withMessage("new password is required")
      .isLength({ min: 6 })
      .withMessage("new password must be at least 6 characters long"),
  ];
};
