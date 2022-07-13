import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import { getTechIntroDB, postDB } from "../modules/post";
import { resetFile } from "../redux/modules/image";
import CategorySelect from "../components/CategorySelect";

import ImageUpload from "../components/ImageUpload";

const WritePost = () => {
  const info = {
    review: {
      title: "사진 후기 게시물 작성 가이드",
      content: "간단한 자기소개 후...",
    },
    lookbook: {
      title: "룩북 게시물 작성 가이드",
      content: "룩북의 이미지는 최대한...",
    },
    reform: {
      title: "리폼 견적 게시물 작성 가이드",
      content: "간단한 자기소개 후...",
    },
    qna: {
      title: "질문과 답변 게시물 작성 가이드",
      content: "궁금한 내용을 상세히...",
    },
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const categoryRef = useRef();
  const regionRef = useRef();
  const titleRef = useRef();
  const contentRef = useRef();
  const introRef = useRef();

  const files = useSelector((state) => state.image.fileList);
  const intro = useSelector((state) => state.post.techIntro);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [introduction, setIntroduction] = useState(intro);
  const [category, setCategory] = useState(0);

  const { type } = useParams();
  const { id } = useParams();

  let frm = new FormData();

  const onSubmit = async () => {
    if (+categoryRef.current.value === 0) {
      alert("리폼 종류 없음");
      return false;
    }

    if (type === "reform" && +regionRef.current.value === 0) {
      alert("지역 없음");
      return false;
    }

    if (title.length < 1) {
      alert("제목 없음");
      return false;
    }

    if (content.length < 1) {
      alert("내용 없음");
      return false;
    }

    if ((type === "review" || type === "lookbook") && files.length < 1) {
      alert("사진 없음");
      return false;
    }

    // 1번 방법 => api 설계서와 동일하게 보내기
    // const frm = new frm(event.target);
    // frm.append("postCategory", type);

    // files.forEach((file) => {
    //   frm.append("file", file);
    // });
    // console.log(frm.getAll("file"));

    // 2번 방법 => file, key로 나눠서 보내기
    files.forEach((file) => {
      frm.append("file", file);
    });
    console.log(files);

    let key = {
      postCategory: type,
      category: categoryRef.current.value,
      title: titleRef.current.value,
      content: contentRef.current.value,
    };
    console.log(key);

    if (type === "reform") {
      key = { ...key, region: regionRef.current.value };
    }
    frm.append(
      "key",
      new Blob([JSON.stringify(key)], { type: "application/json" })
    );
    // frm.append("key", JSON.stringify(key));

    // formdata 확인하기
    // console.log(frm.getAll("file"));
    // for (let key of frm.keys()) {
    //   console.log(key, ":", frm.get(key));
    // }
    // for (let v of frm.values()) console.log(v);

    await dispatch(postDB(frm, type)).then(() => {
      dispatch(resetFile());
      // navigate("/" + type);
    });
  };

  const onChangeTitle = (event) => {
    setTitle(event.target.value);
    if (title.length > 14) {
      return setTitle((prev) => prev.substring(0, 15));
    }
  };
  const onChangeContent = (event) => {
    setContent(event.target.value);
  };
  const onChangeIntro = (event) => {
    setIntroduction(event.target.value);
    if (content.length > 99) {
      return setIntroduction((prev) => prev.substring(0, 100));
    }
  };

  useEffect(() => {
    // dispatch(getTechIntroDB());
  }, []);
  return (
    <Wrap>
      <FormWrap>
        <SubmitBtnDiv>
          <SubmitBtn
            onClick={() => {
              onSubmit();
            }}
            type="submit"
            value="발행"
          />
        </SubmitBtnDiv>
        <CategorySelect setCategory={setCategory} category={category} />
        <input ref={categoryRef} value={category} />
        {type === "reform" && (
          <select name="region" defaultValue={0} ref={regionRef}>
            <option value={0} disabled>
              지역
            </option>
            <option value="gyeonggi">경기권</option>
            <option value="gangwon">강원도</option>
            <option value="chungcheong">충청권</option>
            <option value="jeolla">전라권</option>
            <option value="gyeongsang">경상권</option>
          </select>
        )}
        <GuideTitleDiv>
          <GreenBox></GreenBox>
          <GuideTitle>{info[type].title}</GuideTitle>
          <GuideSubTitle>
            원할한 게시물 발행을 위해 꼭 읽어주세요!
          </GuideSubTitle>
        </GuideTitleDiv>
        <GuideContentDiv>
          {info[type].content.map((v, i) => {
            return (
              <div>
                <GuideContent key={"guideContent" + i}>{"· " + v}</GuideContent>
              </div>
            );
          })}
        </GuideContentDiv>
        {type === "lookbook" && (
          <>
            <textarea
              name="introduction"
              placeholder="브랜드 또는 디자이너에 대한 간단한 소개를 적어주세요."
              value={introduction}
              onChange={onChangeIntro}
              ref={introRef}
            />
            <span>{content.length}/100</span>
          </>
        )}
        <TitleDiv>
          <TitleSpan>제목</TitleSpan>
          <TitleInput
            name="title"
            placeholder="제목을 입력해주세요"
            value={title}
            onChange={onChangeTitle}
            ref={titleRef}
          />
          <TitleLength>{title.length}/15</TitleLength>
        </TitleDiv>
        <TitleSpan>내용</TitleSpan>
        <TextArea
          name="content"
          placeholder="여기에 내용을 적어주세요"
          value={content}
          onChange={onChangeContent}
          ref={contentRef}
        />
        <ImageUpload type={type} />
      </FormWrap>
    </Wrap>
  );
};

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: ${({ theme }) => theme.width.maxWidth};
  margin: 24px auto;
`;

const FormWrap = styled.div`
  width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const SubmitBtnDiv = styled.div``;

const SubmitBtn = styled.input`
  margin-left: 530px;
  border-radius: 15px;
  padding: 25px 60px;
  width: 170px;
  height: 74px;
  border: none;
  color: #fff;
  margin-bottom: 100px;
  background-color: ${({ theme }) => theme.colors.orange};
  font-size: ${({ theme }) => theme.fontSizes.l};
  cursor: pointer;
`;

const GuideTitleDiv = styled.div`
  margin: 24px auto 16px auto;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 76px;
  background: #f2f2f2;
  border-radius: 8px;
`;

const GreenBox = styled.div`
  width: 28px;
  height: 28px;
  background: rgba(0, 174, 30, 0.43);
  border-radius: 5px;
  margin: auto 24px auto 20px;
`;

const GuideTitle = styled.span`
  font-weight: 400;
  font-size: ${({ theme }) => theme.fontSizes.l};
  line-height: 24px;
`;

const GuideSubTitle = styled.span`
  margin-left: 15px;
  font-weight: 400;
  font-size: ${({ theme }) => theme.fontSizes.m};
  line-height: 15px;
  color: #afb0b3;
`;

const GuideContentDiv = styled.div`
  margin-bottom: 52px;
  width: 100%;
  background: #fafafa;
  border-radius: 8px;
  padding: 20px;
`;

const GuideContent = styled.span`
  font-weight: 400;
  line-height: ${({ theme }) => theme.fontSizes.m};
  line-height: 28px;
  color: rgba(34, 34, 34, 0.7);
`;

const TitleDiv = styled.div`
  position: relative;
`;

const TitleSpan = styled.span`
  font-weight: 400;
  font-size: ${({ theme }) => theme.fontSizes.l};
  line-height: 24px;
  color: #afb0b3;
`;

const TitleInput = styled.input`
  padding-left: 20px;
  border: 1px solid #afb0b3;
  border-radius: 15px;
  width: 700px;
  height: 84px;
  font-weight: 400;
  font-size: ${({ theme }) => theme.fontSizes.l};
  line-height: 24px;
`;

const TitleLength = styled.span`
  position: absolute;
  right: 19px;
  top: 56px;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizes.l};
  line-height: 24px;
  color: #afb0b3;
`;

const TextArea = styled.textarea`
  padding: 30px 20px;
  width: 700px;
  height: 761px;
  border: 1px solid #afb0b3;
  border-radius: 15px;
  font-weight: 400;
  font-size: ${({ theme }) => theme.fontSizes.l};
  line-height: 24px;
  resize: none;
`;

export default WritePost;
