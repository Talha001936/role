const Joi = require('joi');

<<<<<<< HEAD
=======
const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('employee', 'manager').default('employee')
});

>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
const updateUserStatusSchema = Joi.object({
  status: Joi.string().valid('active', 'deactivated').required()
});

<<<<<<< HEAD
const updateUserPlanSchema = Joi.object({
  plan: Joi.string().valid('none', 'signup', 'lite', 'pro').required()
});

module.exports = { updateUserStatusSchema, updateUserPlanSchema };
=======
module.exports = { createUserSchema, updateUserStatusSchema };
>>>>>>> 6a4ee48cbd61e37af9ec683aeea461de30d17870
