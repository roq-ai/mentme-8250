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
import { getMentorById, updateMentorById } from 'apiSdk/mentors';
import { Error } from 'components/error';
import { mentorValidationSchema } from 'validationSchema/mentors';
import { MentorInterface } from 'interfaces/mentor';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { UserInterface } from 'interfaces/user';
import { getUsers } from 'apiSdk/users';

function MentorEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<MentorInterface>(
    () => (id ? `/mentors/${id}` : null),
    () => getMentorById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: MentorInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateMentorById(id, values);
      mutate(updated);
      resetForm();
      router.push('/mentors');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<MentorInterface>({
    initialValues: data,
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
            Edit Mentor
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
    entity: 'mentor',
    operation: AccessOperationEnum.UPDATE,
  }),
)(MentorEditPage);
