import { useState, useCallback } from "react";

export function useForm(initialValues = {}, onSubmit, validate) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const { name, value, type, checked } = e.target;
      const newValue = type === "checkbox" ? checked : value;

      setValues((prev) => ({
        ...prev,
        [name]: newValue,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors]
  );

  const handleBlur = useCallback(
    (e) => {
      const { name } = e.target;
      setTouched((prev) => ({
        ...prev,
        [name]: true,
      }));

      if (validate) {
        const fieldErrors = validate(values);
        if (fieldErrors[name]) {
          setErrors((prev) => ({
            ...prev,
            [name]: fieldErrors[name],
          }));
        }
      }
    },
    [values, validate]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (validate) {
        const validationErrors = validate(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
          const allTouched = Object.keys(values).reduce((acc, key) => {
            acc[key] = true;
            return acc;
          }, {});
          setTouched(allTouched);
          return;
        }
      }

      try {
        setIsSubmitting(true);
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validate, onSubmit]
  );

  const reset = useCallback(() => { setValues(initialValues); setErrors({}); setTouched({}); setIsSubmitting(false);}, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  return { values, errors, touched, isSubmitting, handleChange, handleBlur, handleSubmit, reset, setFieldValue, setFieldError, setValues,};
}

export const validators = {
  required: (value) => {
    if (!value || (typeof value === "string" && !value.trim())) return "This field is required";
    return "";
  },

  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  },

  minLength: (min) => (value) => {
    if (value && value.length < min) return `Must be at least ${min} characters`;
    return "";
  },

  maxLength: (max) => (value) => {
    if (value && value.length > max) return `Must be no more than ${max} characters`;
    return "";
  },

  password: (value) => {
    if (value && value.length < 6) return "Password must be at least 6 characters";
    return "";
  },

  match: (fieldName, fieldLabel) => (value, values) => {
    if (value !== values[fieldName]) return `Must match ${fieldLabel}`;
    return "";
  },
};

export function composeValidators(...validators) {
  return (value, values) => {
    for (const validator of validators) {
      const error = validator(value, values);
      if (error) return error;
    }
    return "";
  };
}
