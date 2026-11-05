const Joi = require('joi');

const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('employee', 'manager').default('employee')
});

const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'deactivated').required()
});

module.exports = { createUserSchema, updateUserStatusSchema };