/**
 * Validation middleware factory
 * Creates middleware that validates request body against rules
 */
const validate = (rules) => {
  return (req, res, next) => {
    const errors = [];

    for (const [field, rule] of Object.entries(rules)) {
      const value = req.body[field];

      // Required check
      if (
        rule.required &&
        (value === undefined || value === null || value === "")
      ) {
        errors.push(`${field} is required`);
        continue;
      }

      // Skip further validation if field is optional and not provided
      if (!rule.required && (value === undefined || value === null)) {
        continue;
      }

      // Type check
      if (rule.type === "string" && typeof value !== "string") {
        errors.push(`${field} must be a string`);
      }

      if (rule.type === "email" && typeof value === "string") {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          errors.push(`${field} must be a valid email`);
        }
      }

      // Min length
      if (
        rule.minLength &&
        typeof value === "string" &&
        value.length < rule.minLength
      ) {
        errors.push(`${field} must be at least ${rule.minLength} characters`);
      }

      // Enum check
      if (rule.enum && !rule.enum.includes(value)) {
        errors.push(`${field} must be one of: ${rule.enum.join(", ")}`);
      }

      // Date check
      if (rule.type === "date" && value) {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          errors.push(`${field} must be a valid date`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    next();
  };
};

// Pre-defined validation rules
const registerRules = {
  email: { required: true, type: "email" },
  password: { required: true, type: "string", minLength: 6 },
  name: { required: true, type: "string", minLength: 2 },
};

const loginRules = {
  email: { required: true, type: "email" },
  password: { required: true, type: "string" },
};

const createTaskRules = {
  title: { required: true, type: "string", minLength: 1 },
  description: { required: false, type: "string" },
  status: { required: false, enum: ["TODO", "IN_PROGRESS", "DONE"] },
  dueDate: { required: false, type: "date" },
};

const updateTaskRules = {
  title: { required: false, type: "string", minLength: 1 },
  description: { required: false, type: "string" },
  status: { required: false, enum: ["TODO", "IN_PROGRESS", "DONE"] },
  dueDate: { required: false, type: "date" },
};

module.exports = {
  validate,
  registerRules,
  loginRules,
  createTaskRules,
  updateTaskRules,
};
