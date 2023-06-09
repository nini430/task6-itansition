import { ObjectSchema, object, string } from 'yup';

interface InameValidation {
  name: string;
}

const initialValues: InameValidation = {
  name: '',
};

const validationSchema: ObjectSchema<InameValidation> = object({
  name: string()
    .required('Name is empty!')
    .matches(/^([^0-9!@#$%^&*()_+=]*)$/, 'No  Characters or numbers'),
});

export { initialValues, validationSchema };
