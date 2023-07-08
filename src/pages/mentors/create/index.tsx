import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createMentor } from 'apiSdk/mentors';
import { Error } from 'components/error';
import { mentorValidationSchema } from 'validationSchema/mentors';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { MentorInterface } from 'interfaces/mentor';

function MentorCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: MentorInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createMentor(values);
      resetForm();
      router.push('/mentors');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<MentorInterface>({
    initialValues: {
      professional_background: '',
      expertise: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: mentorValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Mentor
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="professional_background" mb="4" isInvalid={!!formik.errors?.professional_background}>
            <FormLabel>Professional Background</FormLabel>
            <Input
              type="text"
              name="professional_background"
              value={formik.values?.professional_background}
              onChange={formik.handleChange}
            />
            {formik.errors.professional_background && (
              <FormErrorMessage>{formik.errors?.professional_background}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="expertise" mb="4" isInvalid={!!formik.errors?.expertise}>
            <FormLabel>Expertise</FormLabel>
            <Input type="text" name="expertise" value={formik.values?.expertise} onChange={formik.handleChange} />
            {formik.errors.expertise && <FormErrorMessage>{formik.errors?.expertise}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'mentor',
    operation: AccessOperationEnum.CREATE,
  }),
)(MentorCreatePage);
