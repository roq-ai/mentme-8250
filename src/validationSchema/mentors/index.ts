import * as yup from 'yup';

export const mentorValidationSchema = yup.object().shape({
  professional_background: yup.string(),
  expertise: yup.string(),
  user_id: yup.string().nullable(),
});
