import * as yup from 'yup';

export const studentValidationSchema = yup.object().shape({
  academic_background: yup.string(),
  career_aspirations: yup.string(),
  user_id: yup.string().nullable(),
});
