import styled from "styled-components";
import MyPostButtons from "./MyPostButtons";
import Categories from "../shared/Categories";
import TimeCalculator from "../shared/TimeCalculator";

const PostDetail = ({ post }) => {
  return (
    post && (
      <CenterPostDiv>
        <Community>질문과 답변</Community>
        <Title>{post.title}</Title>
        <IDDiv>
          <ID>@{post.nickname}</ID>
          <CircleDiv />
          <Time>{TimeCalculator(post.modifyAt)}</Time>
          <MyPostButtons postType="qna" id={post.id} />
        </IDDiv>
        <TagDiv>
          {Categories.map((v) => {
            return v.value === post.category ? (
              <Category key={"category" + v.value}>{v.text}</Category>
            ) : null;
          })}
        </TagDiv>
        {post.image.length !== 0 ? (
          <Image alt="card" src={post.image[0]} />
        ) : null}
        <TextArea>{post.content}</TextArea>
        {post.image.map((v, i) => {
          return i !== 0 ? <Image alt="card" src={v} /> : null;
        })}
      </CenterPostDiv>
    )
  );
};

const CenterPostDiv = styled.div`
  width: 700px;
  margin-left: calc(50vw - 350px);
`;

const Community = styled.p`
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  color: #222222;
`;

const Title = styled.p`
  font-weight: 700;
  font-size: 27px;
  line-height: 36px;
  color: #222222;
`;

const IDDiv = styled.div`
  display: flex;
  gap: 16px;
  margin-top: 16px;
  align-items: center;
`;

const ID = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #afb0b3;
`;

const CircleDiv = styled.div`
  background-color: #afb0b3;
  width: 6px;
  height: 6px;
  border-radius: 6px;
`;

const Time = styled.p`
  font-weight: 400;
  font-size: 14px;
  line-height: 18px;
  color: #afb0b3;
  margin-right: 34px;
`;

const TagDiv = styled.div`
  display: flex;
  gap: 10px;
`;

const Category = styled.button`
  font-weight: 700;
  font-size: 11px;
  line-height: 14px;
  height: 29px;
  width: 77px;
  background-color: #f2f2f2;
  border: none;
  border-radius: 8px;
  margin-top: 30px;
`;

const Image = styled.img`
  width: 100%;
  object-fit: cover;
  margin: 50px auto;
`;

const TextArea = styled.div`
  border: none;
  width: 100%;
  height: auto;
  resize: none;
  overflow: hidden;
  font-weight: 400;
  font-size: 18px;
  line-height: 28px;
`;

export default PostDetail;
