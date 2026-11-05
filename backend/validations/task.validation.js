const Joi = require('joi');

const startOfToday = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const dueDateSchema = Joi.date()
  .iso()
  .required()
  .custom((value, helpers) => {
    const picked = new Date(value);
    picked.setHours(0, 0, 0, 0);
    if (picked.getTime() < startOfToday().getTime()) {
      return helpers.error('date.min', { limit: 'today' });
    }
    return value;
  })
  .messages({
    'date.min': 'Due date cannot be earlier than today',
    'date.base': 'Due date must be a valid date',
    'any.required': 'Due date is required'
  });

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(100).required(),
  description: Joi.string().allow('').max(500).default(''),
  assignedTo: Joi.string().required(),
  status: Joi.forbidden(),
  dueDate: dueDateSchema
});

const updateTaskSchema = Joi.object({
  title: Joi.string().min(1).max(100),
  description: Joi.string().allow('').max(500),
  assignedTo: Joi.string(),
  status: Joi.forbidden(),
  dueDate: dueDateSchema.optional()
});

const updateTaskStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'in-progress', 'completed').required()
});

module.exports = { createTaskSchema, updateTaskSchema, updateTaskStatusSchema };