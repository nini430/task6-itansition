import { Collapse, Spin, Empty } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';
import { useAppSelector } from '../store';
import moment from 'moment';

const ChatHistory = () => {
    const [activeKey,setActiveKey]=useState<any>('');
  const { messages, getMessagesLoading, userId,users } = useAppSelector(
    (state) => state.user
  ) as any;
  console.log(messages);
  if (!messages || getMessagesLoading) {
    return (
      <ChatWrapper>
        <Spin />
      </ChatWrapper>
    );
  }

  if (!messages.length) {
    return (
      <ChatWrapper>
        <Empty description="Messages are empty" />
      </ChatWrapper>
    );
  }
  const handlePanelChange=(key:string|string[])=>{
    const last=key[key.length-1];
    setActiveKey(last);
  }
  return (
    <ChatHistoryContainer>
      <MessageText>Messages</MessageText>
      <Collapse
      onChange={handlePanelChange}
      activeKey={activeKey}
        items={messages.map((message: any) => {
            const lastMessage=message.messages?.[0];
          return {
            key: message.convo?._id,
            label: (
              <ChatAccordionSummaryWrapper>
                <ChatAccordionSummary>
                  {message.convo?.subject}{' '}
                  <TimeStamp>
                    {moment(message.convo?.createdAt).format('LLL')}
                  </TimeStamp>{' '}
                </ChatAccordionSummary>
                <LastMessageContainer fromMe={userId=== lastMessage?.from}>
                  {userId=== lastMessage?.from?'You':users.find((user:any)=>user._id===lastMessage?.from)?.name}:
                  {lastMessage?.message}
                </LastMessageContainer>
              </ChatAccordionSummaryWrapper>
            ),
            children: <ChatAccordionDescription>
                {message.messages?.map((mess:any)=>(
                    <Message key={mess._id}>
                        {userId===mess.from?'You':users.find((user:any)=>user._id===mess.from)?.name}:{` `}
                        {mess.message}
                        <TimeStamp>{moment(mess.createdAt).format('LLL')}</TimeStamp>
                    </Message>
                ))}
            </ChatAccordionDescription>,
          };
        })}
      />
    </ChatHistoryContainer>
  );
};

const MessageText = styled.h5`
  font-size: 19px;
  margin-bottom: 20px;
`;

const ChatHistoryContainer = styled.div`
  width: 900px;
  background: white;
  padding: 20px;
  border-radius: 10px;
  max-height:400px;
  overflow-y:auto;
`;
const ChatWrapper = styled.div`
  width: 900px;
  background: white;
  padding: 20px;
  display: flex;
  justify-content: center;
`;

const ChatAccordionSummaryWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const ChatAccordionSummary = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
`;

const TimeStamp = styled.span`
  font-weight: 400;
  color: gray;
`;

const LastMessageContainer = styled(({fromMe:boolean,...props}:any)=>(<div {...props}/>))`
  font-weight:${({fromMe})=>!fromMe?'700':'400'};
`;

const ChatAccordionDescription = styled.div`
    overflow-y: auto;
    max-height:400px;
    display:flex;
    flex-direction:column;
    gap:5px;

`;

const Message=styled.div`
    display:flex;
    justify-content: space-between;
    gap:3px;
    border:1px solid gray;
    padding:5px;
    border-radius:5px;
`

export default ChatHistory;
