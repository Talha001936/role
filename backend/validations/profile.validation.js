
const Joi = require('joi');

const updateProfileSchema = Joi.object({
  name: Joi.string().min(2).max(50),
  email: Joi.string().email(),
  currentPassword: Joi.string()
}).min(1).custom((value, helpers) => {
  if (value.email && !value.currentPassword) {
    return helpers.error('any.custom', { message: 'Current password is required to change email' });
  }
  return value;
}).messages({
  'any.custom': '{{#message}}'
});

module.exports = { updateProfileSchema };