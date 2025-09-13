const Joi = require("joi");

const userValidator = Joi.object({
  name: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name cannot exceed 100 characters",
    }),

  email: Joi.string()
    .lowercase()
    .email({ tlds: { allow: false } }) 
    .required()
    .messages({
      "string.email": "Please provide a valid email",
      "string.empty": "Email is required",
    }),
password: Joi.string()
  .min(8)
  .max(128)
  .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]+$"))
  .required()
  .messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
    "string.pattern.base": "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  }),

  role: Joi.string()
    .valid("user", "admin")
    .default("user")
    .messages({
      "any.only": "Role must be either 'user' or 'admin'",
    }),
});

module.exports = userValidator;
