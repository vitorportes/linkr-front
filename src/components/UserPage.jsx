import Header from "./Header.jsx";
import Trending from "./Trending.jsx";
import { Helmet } from "react-helmet";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUserData } from "../contexts/userContext.jsx";
import { Oval } from "react-loader-spinner";
import AllPosts from "./AllPosts.jsx";
import { useParams } from "react-router-dom";


export default function UserPage() {
  const [posts, setPosts] = useState([]);
  const [refreshAxios, setRefreshAxios] = useState(false);
  const [userData] = useUserData();
  const [connectError, setConnectError] = useState("")
  const {id} = useParams()
  const [sessionUserId, setSessionUserId] = useState("")
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("")
 
  
  let loadingAnimation = (
    <Oval
      height={80}
      width={80}
      color="#FFFFFF"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      ariaLabel="oval-loading"
      secondaryColor="#000000"
      strokeWidth={2}
      strokeWidthSecondary={2}
    />
  );

  const config = {
    headers: {
      Authorization: `Bearer ${userData.token}`, //Padrão da API (Bearer Authentication)
    },
  };

  useEffect(() => {
    const request = axios.get(
      `https://projeto17-linkr-backend.herokuapp.com/${id}`,
      config
    );
    setLoading(true);
    request
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((err) => {;
        console.error(err);
        setLoading(false)
      });
  }, [refreshAxios]);


  
  useEffect(() => {
    const request = axios.get(
        `https://projeto17-linkr-backend.herokuapp.com/${id}`,
        config
      );
    request.then((response)=>{
      setUsername(response.data.username)
    }).catch((err)=>{
      console.error(err)
    })
  }, [])

  useEffect(() => {
    const requestId = axios.get("https://projeto17-linkr-backend.herokuapp.com/userId", config);
    requestId.then((response)=>{
      setSessionUserId(response.data.id)
    }).catch((err)=>{
      setConnectError(err)
      console.error(err)
    })
  }, [])




  if (connectError !== "") {
    return (
      <>
        <Helmet>
          <style>{"body { background-color: #333333; }"}</style>
        </Helmet>
        <Header />
        <Container>
          <h1
            style={{
              color: "#FFFFFF",
              fontFamily: "Oswald",
              marginTop: "100px",
              textAlign: "center",
              fontSize: "40px",
            }}
          >
            An error occured while trying to fetch the posts, please refresh the
            page
          </h1>
        </Container>
      </>
    );
  }

  if (posts.length === 0 && loading === false) {
    return (
      <>
        <Helmet>
          <style>{"body { background-color: #333333; }"}</style>
        </Helmet>
        <Header />
        <Container>
            <ContainerPosts>
            <Title>{username}'s posts</Title>
          <h1
            style={{
              color: "#FFFFFF",
              fontFamily: "Oswald",
              marginTop: "100px",
            }}
          >
            There are no posts yet.
          </h1>
            </ContainerPosts>
          <Trending />
        </Container>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <style>{"body { background-color: #333333; }"}</style>
      </Helmet>
      <Header />
      <Container>
        <ContainerPosts>
          {loading ? (
            <>
              <h1
                style={{
                  color: "#FFFFFF",
                  fontFamily: "Oswald",
                  marginTop: "100px",
                  marginBottom: "10px",
                }}
              >
                Loading
              </h1>
              {loadingAnimation}
            </>
          ) : (
            <>
            <Title>{username}'s posts</Title>
              {posts.map(
                ({
                  id,
                  username,
                  pictureUrl,
                  link,
                  article,
                  urlTitle,
                  urlDescription,
                  urlImage,
                  userId,
                }) => {
                  return (
                    <>
                    <AllPosts
                      id={id}
                      username={username}
                      pictureUrl={pictureUrl}
                      link={link}
                      article={article}
                      urlTitle={urlTitle}
                      urlDescription={urlDescription}
                      urlImage={urlImage}
                      userId={userId}
                      sessionUserId={sessionUserId}
                      refreshAxios={refreshAxios}
                      setRefreshAxios={setRefreshAxios}
                    />
                    </>
                  );
                }
              )}
            </>
          )}
        </ContainerPosts>
        <Trending />
      </Container>
    </>
  );
}



const Container = styled.div`
  margin-top: 53px;
  display: flex;
  justify-content: center;
  box-sizing: border-box;

  @media (max-width: 935px) {
    margin-top: 19px;
  }
`;

const ContainerPosts = styled.div`
  margin-right: 25px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  @media (max-width: 935px) {
    margin-right: 0px;
  }
  
`;

const Title = styled.h1`
  color: #ffffff;
  font-family: 'Oswald';
  font-weight: 700;
  font-size: 43px;
  line-height: 64px;
  margin-bottom: 43px;

  @media (max-width: 935px) {
    font-size: 33px;
    line-height: 49px;
    margin-bottom: 19px;
    padding-left: 20px;
  }
`;