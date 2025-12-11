import { VALIDATION, FILE_UPLOAD, ERROR_MESSAGES } from "../constants";

//Validate email format
export function validateEmail(email) {
  if (!email) return "Email is required";
  if (!VALIDATION.EMAIL_REGEX.test(email)) {
    return "Please enter a valid email address";
  }
  return "";
}

//Validate password
export function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) 
    return `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`;

  return "";
}

//Validate name
export function validateName(name) {
  if (!name || !name.trim()) return "Name is required";
  if (name.trim().length < VALIDATION.NAME_MIN_LENGTH) 
    return `Name must be at least ${VALIDATION.NAME_MIN_LENGTH} characters`;

  return "";
}

//Validate post title
export function validatePostTitle(title) {
  if (!title || !title.trim()) return "Title is required";
  if (title.trim().length < VALIDATION.POST_TITLE_MIN_LENGTH) {
    return `Title must be at least ${VALIDATION.POST_TITLE_MIN_LENGTH} characters`;
  }
  if (title.length > VALIDATION.POST_TITLE_MAX_LENGTH) {
    return `Title must be no more than ${VALIDATION.POST_TITLE_MAX_LENGTH} characters`;
  }
  return "";
}

//Validate post body
export function validatePostBody(body) {
  if (!body || !body.trim()) return "Content is required";
  if (body.trim().length < VALIDATION.POST_BODY_MIN_LENGTH) 
    return `Content must be at least ${VALIDATION.POST_BODY_MIN_LENGTH} characters`;
  if (body.length > VALIDATION.POST_BODY_MAX_LENGTH) 
    return `Content must be no more than ${VALIDATION.POST_BODY_MAX_LENGTH} characters`;

  return "";
}

//Validate comment
export function validateComment(comment) {
  if (!comment || !comment.trim()) return "Comment cannot be empty";
  if (comment.length > VALIDATION.COMMENT_MAX_LENGTH) 
    return `Comment must be no more than ${VALIDATION.COMMENT_MAX_LENGTH} characters`;

  return "";
}

//Validate file size
export function validateFileSize(file) {
  if (file.size > FILE_UPLOAD.MAX_SIZE)  return ERROR_MESSAGES.FILE_TOO_LARGE;
  return "";
}

//Validate image file type
export function validateImageType(file) {
  if (!FILE_UPLOAD.ALLOWED_IMAGE_TYPES.includes(file.type))  return ERROR_MESSAGES.INVALID_FILE_TYPE;
  return "";
}

//Validate image file
export function validateImageFile(file) {
  const sizeError = validateFileSize(file);
  if (sizeError) return sizeError;

  const typeError = validateImageType(file);
  if (typeError) return typeError;

  return "";
}

//Validate multiple images
export function validateImages(files) {
  if (files.length > FILE_UPLOAD.MAX_IMAGES_PER_POST) 
    return `You can only upload up to ${FILE_UPLOAD.MAX_IMAGES_PER_POST} images`;

  for (const file of files) {
    const error = validateImageFile(file);
    if (error) return error;
  }
  return "";
}

//Validate login form
export function validateLoginForm(values) {
  const errors = {};

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;

  return errors;
}

//Validate registration form

export function validateRegisterForm(values) {
  const errors = {};

  const nameError = validateName(values.name);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(values.email);
  if (emailError) errors.email = emailError;

  const passwordError = validatePassword(values.password);
  if (passwordError) errors.password = passwordError;
  if (!values.role)  errors.role = "Please select a role";
  return errors;
}

//Validate post form
export function validatePostForm(values) {
  const errors = {};

  const titleError = validatePostTitle(values.title);
  if (titleError) errors.title = titleError;

  const bodyError = validatePostBody(values.body);
  if (bodyError) errors.body = bodyError;
  if (!values.type) errors.type = "Please select a post type";
  return errors;
}
