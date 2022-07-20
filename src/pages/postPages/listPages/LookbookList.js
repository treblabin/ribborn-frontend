import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import styled from "styled-components";

import CardB from "../../../components/card/CardB";
import Sort from "../../../components/category/Sort";
import {
  getLookbookListDB,
  cleanUpPostList,
  loadDoneReset,
} from "../../../redux/modules/post";
import { MainBtn, SubBtn, Category } from "../../../elements/Buttons";
import Categories from "../../../shared/Categories";

const LookbookList = () => {
  const dispatch = useDispatch();
  const postList = useSelector((state) => state.post.PostList);
  const loadedEverything = useSelector((state) => state.post.loadedEverything);
  const isLogin = useSelector((state) => state.user.isLogin);
  const user = useSelector((state) => state.user.user);

  const [sort, setSort] = useState("likeCount");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(0);
  const [loading, setLoading] = React.useState(true);

  const [inViewRef, inView] = useInView();

  const onClickCategory = (event) => {
    setCategory(event.target.id);
  };

  useEffect(() => {
    dispatch(loadDoneReset());
    if (page === 0) {
      setLoading(true);
      dispatch(getLookbookListDB(category, sort, page)).then((res) => {
        setLoading(false);
      });
    } else {
      setPage(0);
    }
  }, [category, sort]);

  useEffect(() => {
    if (inView && !loading && !loadedEverything) {
      setPage(page + 1);
    }
  }, [inView]);

  useEffect(() => {
    setLoading(true);
    dispatch(getLookbookListDB(category, sort, page)).then((res) => {
      setLoading(false);
    });
  }, [page]);

  React.useEffect(() => {
    return () => {
      dispatch(cleanUpPostList());
    };
  }, []);

  return (
    <Wrap>
      <TopWrap>
        <LCategory category={category}>
          {Categories.map((v) => {
            return (
              <SubBtn id={v.value} onClick={onClickCategory}>
                {v.text}
              </SubBtn>
            );
          })}
        </LCategory>
        <Sort setSort={setSort} sort={sort} />
      </TopWrap>
      {isLogin && +user.userType === 1 && (
        <Link to="/write/lookbook">
          <MainBtn style={{ marginBottom: "30px" }}>룩북 올리기</MainBtn>
        </Link>
      )}
      <Grid>
        {postList.map((postObj, index) =>
          index === postList.length - 1 ? (
            <CardB
              postObj={postObj}
              key={"lookbookPosts" + postObj.id}
              hot={index < 6 && sort === "popular"}
              isMain={false}
              inViewRef={inViewRef}
            />
          ) : (
            <CardB
              postObj={postObj}
              key={"lookbookPosts" + postObj.id}
              hot={index < 6 && sort === "popular"}
              isMain={false}
            />
          )
        )}
      </Grid>
    </Wrap>
  );
};
const Wrap = styled.div`
  max-width: ${({ theme }) => theme.width.listWidth};
  margin: 0 auto 60px auto;
  padding: 0 40px;
`;
const TopWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 60px;
`;
const LCategory = styled(Category)`
  margin: 30px 0;
`;
const Grid = styled.div`
  display: grid;
  grid-gap: 40px;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  margin: 20px auto;
`;

export default LookbookList;
