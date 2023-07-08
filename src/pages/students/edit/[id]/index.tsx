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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getStudentById, updateStudentById } from 'apiSdk/students';
import { Error } from 'components/error';
import { studentValidationSchema } from 'validationSchema/students';
import { StudentInterface } from 'interfaces/student';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function StudentEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<StudentInterface>(
    () => (id ? `/students/${id}` : null),
    () => getStudentById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: StudentInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateStudentById(id, values);
      mutate(updated);
      resetForm();
      router.push('/students');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<StudentInterface>({
    initialValues: data,
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
            Edit Student
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(StudentEditPage);
