import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const NoPost = ({ category }) => {
  const navigate = useNavigate();
  const text = [
    {
      category: "review",
      text: "아직 후기를 쓴 적이 없어요!",
      button: "첫번째 후기 쓰기",
      link: "/review",
    },
    {
      category: "qna",
      text: "아직 질문과 답변에 글을 쓴 적이 없어요!",
      button: "첫번째 질문 쓰기",
      link: "/qna",
    },
    {
      category: "reform",
      text: "아직 견적을 낸 적이 없어요!",
      button: "첫번째 후기 쓰기",
      link: "/reform",
    },
    {
      category: "lookbook",
      text: "아직 룩북을 쓴 적이 없어요!",
      button: "첫번째 룩북 쓰기",
      link: "/lookbook",
    },
  ];

  return (
    <Cover>
      {text.map((v) => {
        return v.category === category ? <Text>{text.text}</Text> : null;
      })}
      {text.map((v) => {
        return v.category === category ? (
          <Button
            onClick={() => {
              navigate(v.link);
            }}
          >
            {text.button}
          </Button>
        ) : null;
      })}
    </Cover>
  );
};

const Cover = styled.div`
  justify-content: center;
  text-align: center;
`;

const Text = styled.p`
  font-weight: bold;
  margin-bottom: 30px;
`;

const Button = styled.button``;

export default NoPost;
