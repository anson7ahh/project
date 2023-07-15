const joi = require('joi');

const validate = (data) => {
    const userSchema = joi.object({
        username: joi.string().required(),
        password: joi.string().required(),
        email: joi.string().pattern(new RegExp('gmail.com')).required().email(),
        
    });
    return userSchema.validate(data);
};
module.exports = validate;
