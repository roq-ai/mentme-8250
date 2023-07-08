import * as yup from 'yup';

export const corporateRecruiterValidationSchema = yup.object().shape({
  user_id: yup.string().nullable(),
});
