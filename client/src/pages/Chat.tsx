import styled from 'styled-components';
import { useState } from 'react';
import { io } from 'socket.io-client';

import MessageForm from '../components/MessageForm';
import { useAppDispatch, useAppSelector } from '../store';
import { Button } from 'antd';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, updateChat } from '../store/userReducer';
import ChatHistory from '../components/ChatHistory';

const Chat = () => {
  const [selectedUser, setSelectedUser] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { userName, userId } = useAppSelector((state: any) => state.user);
  useEffect(() => {
    if (!userName) {
      navigate('/welcome');
    }
  }, [navigate, userName]);
  useEffect(() => {
    if (!socket) {
      setSocket(io('http://localhost:8900', { query: { userId } }));
    }
    return ()=>{
      socket.disconnect();
    }
  }, []);

  useEffect(() => {
    console.log('receive1');
    socket?.on('receive-message', ({ message }: { message: any }) => {
      if (selectedUser && message.message.from && selectedUser) {
         dispatch(updateChat(message));
      }
    });
  }, [socket, dispatch, selectedUser]);
  return (
    <ChatContainer>
      <WrapperContainer>
        <ProfileContainer>
          {userName}
          <Button
            onClick={() => {
              dispatch(logout());
            }}
          >
            Log Out
          </Button>
        </ProfileContainer>
        <MessageForm setSelectedUser={setSelectedUser} socket={socket} />
      </WrapperContainer>
      <ChatHistory />
    </ChatContainer>
  );
};

const ChatContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 40px;
`;

const WrapperContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: baseline;
  gap: 20px;
`;

const ProfileContainer = styled.div`
  padding: 20px;
  background: white;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default Chat;
