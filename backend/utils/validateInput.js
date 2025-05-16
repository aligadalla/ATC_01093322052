import AppError from "./AppError.js";

const validateInput = (schema, data) => {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new AppError(result.error.errors.map(err => err.message).join(", "), 400);
    }
    
    return result.data;
};
  
export default validateInput;
