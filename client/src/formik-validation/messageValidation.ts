import {object,ObjectSchema,string} from 'yup'

interface MessageValidationInterface {
    to:string;
    subject:string;
    message:string;
}

const initialValues:MessageValidationInterface = {
    to:'',
    subject:'',
    message:''
}


const validationSchema:ObjectSchema<MessageValidationInterface>=object({
    to:string().required('Recipient field is required'),
    subject:string().required('Subject Field is required'),
    message: string().required('Message Field is required')
})

export {initialValues, validationSchema}