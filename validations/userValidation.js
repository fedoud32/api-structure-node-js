const Joi = require("@hapi/joi");

const registerValidation = (data) => {
    const schema = Joi.object({
      firstName: Joi.string()
        .min(4)
        .required(),
      lastName: Joi.string()
        .min(4)
        .required(),
      email: Joi.string()
        .min(6)
        .required()
        .email(),
      password: Joi.string()
        .min(6).pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,}$/)
        
    });
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
      email: Joi.string()
        .min(6)
        .required()
        .email(),
      password: Joi.string()
        .min(8).pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/)
        
    });
    return schema.validate(data);
}

module.exports.registerValidation = registerValidation; 
module.exports.loginValidation = loginValidation; 