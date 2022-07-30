import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import styled from "styled-components";

import { addMessage, updateRoomMessage } from "../redux/modules/chat";
import ChatList from "./ChatList";
import { Input } from "../elements/Inputs";
import { MainBtn } from "../elements/Buttons";

// 채팅 모달 > 채팅방
const ChatRoom = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { roomId } = useParams();
  const user = useSelector((state) => state.user.user);
  const inputRef = useRef();
  let stompClient = useRef(null);

  // 웹소켓 연결 요청 & 구독 요청
  const socketConnect = () => {
    const webSocket = new SockJS(`${process.env.REACT_APP_CHAT_URL}/wss-stomp`);
    stompClient.current = Stomp.over(webSocket);
    stompClient.current.connect(
      {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        type: "TALK",
      },
      () => {
        stompClient.current.subscribe(
          `/sub/chat/room/${roomId}`,
          (response) => {
            const messageFromServer = JSON.parse(response.body);
            dispatch(addMessage(messageFromServer));
          },
          { Authorization: `Bearer ${localStorage.getItem("token")}` }
        );
        // document.getElementsByName("chat")[0].disabled = false;
        // inputRef.current.disabled = false;
      }
    );
  };

  // 웹소켓 연결 해제
  const socketDisconnect = () => {
    stompClient.current.disconnect();
    stompClient.current = null;
  };

  // 메시지 전송
  const sendMessage = (event) => {
    event.preventDefault();

    const message = event.target.chat.value;

    if (message === "" || message.trim(" ") === "") return false;

    const messageObj = {
      roomId: roomId,
      senderId: user.id,
      message: event.target.chat.value,
      isRead: false,
      type: "TALK",
      nickname: user.nickname,
    };

    stompClient.current.send(
      `/pub/chat/message`,
      { Authorization: `Bearer ${localStorage.getItem("token")}` },
      JSON.stringify(messageObj)
    );

    dispatch(
      updateRoomMessage({ ...messageObj, index: location.state.index ?? 0 })
    );
    event.target.chat.value = null;
  };

  useEffect(() => {
    // 채팅방 전환 시 기존 연결 해제 후 새 연결 요청
    if (stompClient.current) {
      socketDisconnect();
    }
    socketConnect();

    // inputRef.current.value = "";
    // inputRef.current.disabled = true;
    // document.getElementsByName("chat")[0].disabled = true;

    // 언마운트 시 연결 해제
    return () => {
      if (stompClient.current) socketDisconnect();
    };
  }, [roomId]);

  return (
    <>
      <ChatInputWrap>
        <form onSubmit={sendMessage}>
          <ChatInput
            ref={inputRef}
            name="chat"
            autoComplete="off"
            placeholder="메시지를 입력해주세요."
          />
          <SendButton>보내기</SendButton>
        </form>
      </ChatInputWrap>
      <ChatList />
    </>
  );
};

const ChatInputWrap = styled.div`
  margin: 30px;
  border-radius: 15px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
`;
const ChatInput = styled(Input)`
  border: none;
  width: calc(100% - 100px);
  &:focus {
    outline: none;
  }
`;
const SendButton = styled(MainBtn)`
  padding: 10px 20px;
  font-size: ${({ theme }) => theme.fontSizes.m};
`;

export default ChatRoom;
