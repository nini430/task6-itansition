import {useEffect} from 'react'
import styled from 'styled-components'
import {Input,Button} from 'antd'
import {useFormik} from 'formik'
import { initialValues, validationSchema } from '../formik-validation/nameValidation'
import { useAppDispatch, useAppSelector } from '../store'
import { addUser } from '../store/userReducer'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {
    const dispatch=useAppDispatch();
    const navigate=useNavigate();
    const {userName}=useAppSelector(state=>state.user);
    useEffect(()=>{
        if(userName) {
            navigate('/')
        }
    },[navigate,userName])

    const {dirty,errors,handleSubmit,getFieldProps,touched}=useFormik({
        initialValues,
        validationSchema,
        onSubmit:(values)=>{
            dispatch(addUser({name:values.name}));
            setTimeout(()=>{
                navigate('/')
            },1000)
        }
    })
  return (
    <WelcomeContainer>
        <NameEnterText>Please, Enter Your Name: </NameEnterText>
        <Input  {...getFieldProps('name')} placeholder='John Doe' className='input'  type='text' />
        {errors.name && touched.name && <ErrorText>{errors.name}</ErrorText>  }
        <Button onClick={()=>handleSubmit()} disabled={Object.values(errors).length>0 || !dirty}>Go</Button>
    </WelcomeContainer>
  )
}

export default Welcome;

const WelcomeContainer=styled.div`
    height:100vh;
    display:flex;
    flex-direction:column;
    justify-content: center;
    align-items: center;
    gap:5px;
`

const NameEnterText=styled.h2`
    font-size:28px;
`

const ErrorText=styled.span`
    font-size:12px;
    color:red;
`
