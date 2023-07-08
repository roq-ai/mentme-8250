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
import { createStudent } from 'apiSdk/students';
import { Error } from 'components/error';
import { studentValidationSchema } from 'validationSchema/students';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';
import { StudentInterface } from 'interfaces/student';

function StudentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: StudentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createStudent(values);
      resetForm();
      router.push('/students');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<StudentInterface>({
    initialValues: {
      academic_background: '',
      career_aspirations: '',
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: studentValidationSchema,
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
            Create Student
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="academic_background" mb="4" isInvalid={!!formik.errors?.academic_background}>
            <FormLabel>Academic Background</FormLabel>
            <Input
              type="text"
              name="academic_background"
              value={formik.values?.academic_background}
              onChange={formik.handleChange}
            />
            {formik.errors.academic_background && (
              <FormErrorMessage>{formik.errors?.academic_background}</FormErrorMessage>
            )}
          </FormControl>
          <FormControl id="career_aspirations" mb="4" isInvalid={!!formik.errors?.career_aspirations}>
            <FormLabel>Career Aspirations</FormLabel>
            <Input
              type="text"
              name="career_aspirations"
              value={formik.values?.career_aspirations}
              onChange={formik.handleChange}
            />
            {formik.errors.career_aspirations && (
              <FormErrorMessage>{formik.errors?.career_aspirations}</FormErrorMessage>
            )}
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
    entity: 'student',
    operation: AccessOperationEnum.CREATE,
  }),
)(StudentCreatePage);
