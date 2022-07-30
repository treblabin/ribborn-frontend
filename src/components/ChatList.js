import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import moment from "moment";

import {
  cleanUpMessage,
  getMessageListDB,
  getRoomListDB,
} from "../redux/modules/chat";

// 채팅 모달 > 채팅방 > 채팅 내역
const ChatList = () => {
  const dispatch = useDispatch();
  const { roomId } = useParams();
  const scrollRef = useRef();
  const messageList = useSelector((state) => state.chat.messageList);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    dispatch(cleanUpMessage());
    dispatch(getMessageListDB(roomId));
  }, [roomId]);

  useEffect(() => {
    scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    if (messageList.length === 1) {
      dispatch(getRoomListDB());
    }
  }, [messageList]);

  return (
    <MessageWrap>
      {messageList.map((chat, index) => {
        const date = moment(chat.date).format("HH:mm");
        const isMe = chat?.senderName === user?.username;
        return (
          <>
            {chat.date.split("T")[0] !==
              messageList[index - 1]?.date?.split("T")[0] && (
              <ChatListDate key={chat.date}>
                {moment(chat.date).format("YYYY.MM.DD")}
              </ChatListDate>
            )}
            {chat.type === "TALK" ? (
              <Message key={chat.messageId} me={isMe}>
                {(chat.senderName !== messageList[index - 1]?.senderName ||
                  date !==
                    moment(messageList[index - 1]?.date).format("HH:mm")) && (
                  <NickAndDate me={isMe}>
                    <Nickname>{chat?.senderNickname}</Nickname>
                    <Date me={isMe}>{date}</Date>
                  </NickAndDate>
                )}
                <Bubble me={isMe}>{chat?.message}</Bubble>
              </Message>
            ) : (
              <Status>{chat?.message}</Status>
            )}
          </>
        );
      })}
      <div ref={scrollRef} />
    </MessageWrap>
  );
};

const MessageWrap = styled.div`
  display: flex;
  flex-flow: column;
  gap: 10px;
  padding: 30px 30px 0 30px;
  overflow-y: auto;
`;
const Message = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ me }) => me && "flex-end"};
  margin: ${({ me }) => (me ? "0 0 0 10%" : "0 10% 0 0")};
`;
const NickAndDate = styled.div`
  display: flex;
  flex-direction: ${({ me }) => me && "row-reverse"};
  justify-content: ${({ me }) => (me ? "end" : "start")};
  align-items: center;
  margin: 10px 0;
  text-align: ${({ me }) => (me ? "end" : "start")};
`;
const Nickname = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.l};
`;
const Date = styled.span`
  color: ${({ theme }) => theme.colors.gray};
  margin: ${({ me }) => (me ? "0 20px 0 0" : "0 0 0 20px")};
`;
const Bubble = styled.div`
  width: fit-content;
  margin: 0;
  background-color: #f2f2f2;
  border-radius: ${({ me }) => (me ? "15px 0 15px 15px" : "0 15px 15px 15px")};
  padding: 20px 30px;
`;
const ChatListDate = styled.div`
  text-align: center;
  margin: 30px 0;
  font-size: ${({ theme }) => theme.fontSizes.l};
`;
const Status = styled(ChatListDate)`
  font-size: ${({ theme }) => theme.fontSizes.m};
  color: ${({ theme }) => theme.colors.gray};
`;

export default ChatList;
