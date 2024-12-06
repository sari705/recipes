const Joi = require('joi');

const recipeSchema = Joi.object({
  title: Joi.string().required(),
  ingredients: Joi.array().items(Joi.string()).required(),
  steps: Joi.array().items(Joi.string()).required(),
  image_url: Joi.string().uri().optional(),
  is_public: Joi.boolean().optional(),
  category: Joi.string().optional(),
});

const validateRecipe = (req, res, next) => {
  const { error } = recipeSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

module.exports = { validateRecipe };
