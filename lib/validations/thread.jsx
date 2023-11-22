import * as yup from "yup";

const ThreadValidation = yup.object().shape({
  thread: yup.string().required().min(3, "Minimum 3 characters."),
  accountId: yup.string().required(),
});

const CommentValidation = yup.object().shape({
  thread: yup.string().required().min(3, "Minimum 3 characters."),
});

export { ThreadValidation, CommentValidation };
