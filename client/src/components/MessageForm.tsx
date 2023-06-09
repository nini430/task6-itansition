import styled from 'styled-components';
import { AutoComplete, Button, Form, Input, message } from 'antd';
import { Dispatch, SetStateAction, useEffect } from 'react';
import { useFormik } from 'formik';

import { useAppDispatch, useAppSelector } from '../store';
import {
  getMessages,
  getUsers,
  sendMessage,
  updateChat,
} from '../store/userReducer';

import {
  initialValues,
  validationSchema,
} from '../formik-validation/messageValidation';

const MessageForm = ({socket,setSelectedUser}:{socket:any,setSelectedUser:Dispatch<SetStateAction<string>>}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useAppDispatch();
  const { users, userId, sendMessageLoading,messages} = useAppSelector(
    (state) => state.user
  );

  const {
    dirty,
    handleSubmit,
    getFieldProps,
    errors,
    touched,
    setFieldValue,
    resetForm,
    values,
  } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      if(socket) {
        dispatch(
          sendMessage({
            from: userId as string,
            to: recipientId,
            message: values.message,
            subject: values.subject,
            onSuccess: (data: any) => {
              socket.emit('send-message', {
                message: data,
                sender: userId,
              });
              messageApi.success({
                content: 'Message Sent Succesfully!',
                duration: 2,
              });
  
              resetForm({
                values: {
                  message: '',
                  subject: '',
                  to: '',
                },
              });
            },
          })
        );
      }
      }
      
  });

  const recipientId = (
    users?.find((item: any) => item.name === values.to) as any
  )?._id;
  const { TextArea } = Input;
  useEffect(() => {
    dispatch(getUsers());
  }, [dispatch]);
  useEffect(() => {
    if (recipientId) {
      dispatch(getMessages({ from: userId as string, to: recipientId }));
    }
  }, [values.to, recipientId, userId,socket,dispatch]);
 
  return (
    <StyledForm>
      {contextHolder}
      <FormText>Send Message</FormText>
      <FormGroup>
        Recipient:
        <AutoComplete
          allowClear
          onSelect={(data) => {setFieldValue('to', data); setSelectedUser(data)}}
          {...getFieldProps('to')}
          options={
            users.map((item: { name: string; _id: string }) => ({
              label: item.name,
              value: item.name,
            })) || []
          }
          style={{ width: 300 }}
          placeholder="Enter recipient here..."
        />
        {errors.to && <ErrorMessage>{errors.to}</ErrorMessage>}
      </FormGroup>
      <FormGroup>
        Title:
        <Input {...getFieldProps('subject')} style={{ width: 300 }} />
        {errors.subject && touched.subject && (
          <ErrorMessage>{errors.subject}</ErrorMessage>
        )}
      </FormGroup>
      <FormGroup>
        Message:
        <TextArea
          {...getFieldProps('message')}
          placeholder="Type your message here..."
          style={{ width: 300 }}
          rows={4}
        />
        {errors.message && touched.message && (
          <ErrorMessage>{errors.message}</ErrorMessage>
        )}
      </FormGroup>
      <Button
        loading={sendMessageLoading}
        onClick={() => handleSubmit()}
        disabled={Object.keys(errors).length > 0 || !dirty}
      >
        Send Message
      </Button>
    </StyledForm>
  );
};

const StyledForm = styled(Form)`
  width: 600px;
  background: white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 10px;
`;

const FormText = styled.h5`
  font-size: 25px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;
  font-size: 20px;
`;

const ErrorMessage = styled.span`
  font-size: 12px;
  color: red;
`;

export default MessageForm;
