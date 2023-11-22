import * as yup from "yup";

const UserValidation = yup.object().shape({
  profile_photo: yup.string().url().required(),
  name: yup
    .string()
    .min(3, "Minimum 3 characters.")
    .max(30, "Maximum 30 caracters.")
    .required(),
  username: yup
    .string()
    .min(3, "Minimum 3 characters.")
    .max(30, "Maximum 30 caracters.")
    .required(),
  bio: yup
    .string()
    .min(3, "Minimum 3 characters.")
    .max(1000, "Maximum 1000 caracters.")
    .required(),
});

export default UserValidation;
