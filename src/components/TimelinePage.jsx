import Header from './Header.jsx';
import NewPost from './NewPost.jsx';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useUserData } from "../contexts/userContext.jsx";
import  {Oval}  from  'react-loader-spinner'
import { TiPencil } from "react-icons/ti";
import { IconContext } from "react-icons";
import { useFormik } from "formik";
import { RiDeleteBin7Fill } from "react-icons/ri";

export default function TimelinePage() {
  const [posts, setPosts] = useState([])
  const [refreshAxios, setRefreshAxios] = useState(false)
  const [userData] = useUserData();
  const [connectError, setConnectError] = useState("")
  const [sessionUserId, setSessionUserId] = useState("")
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  let loadingAnimation = <Oval
  height={80}
  width={80}
  color="#FFFFFF"
  wrapperStyle={{}}
  wrapperClass=""
  visible={true}
  ariaLabel='oval-loading'
  secondaryColor="#000000"
  strokeWidth={2}
  strokeWidthSecondary={2}/>

  const elem = useRef("");
  const config = {
    headers: {
        "Authorization": `Bearer ${userData.token}` //Padrão da API (Bearer Authentication)
    }
  }

    useEffect(() => {

      const request = axios.get("https://projeto17-linkr-backend.herokuapp.com/timeline", config);
      setLoading(true)
      request.then((response) =>{
              setPosts(response.data);
              setLoading(false)
      }).catch((err) =>{
          setConnectError(err)
          console.error(err)
          
      });

  },[refreshAxios]);
  
 useEffect(() => {
  const requestId = axios.get("https://projeto17-linkr-backend.herokuapp.com/userId", config);
  requestId.then((response)=>{
    setSessionUserId(response.data.id)
  }).catch((err)=>{
    setConnectError(err)
    console.error(err)
  })
 }, [])



  function AllPosts({id, username, pictureUrl, link, article, urlTitle, urlDescription, urlImage, userId}){
    const [edit, setEdit] = useState(false)
    const [loadingEdit, setLoadingEdit] = useState(false)

    function showEdit(id){
      console.log(id)
      setEdit(!edit)
    }

function sendText(event){
  event.preventDefault()

  const dados = {text: elem.current.value}
  setLoadingEdit(true)
  const request = axios.put(`https://projeto17-linkr-backend.herokuapp.com/post/${id}`,dados, config);
  request.then((response) => {
    console.log(response)
    setLoadingEdit(false)
    setEdit(false)
    setRefreshAxios(!refreshAxios)
  }).catch((err) =>{
    setConnectError(err)
    console.error(err)
  });
}
 function EditIcons(){
  if(sessionUserId !== userId){
    return(
      <></>
    )
  }
  if(sessionUserId === userId){
    return(
      <>
        <TiPencil onClick={() => showEdit(id)}></TiPencil>
        <RiDeleteBin7Fill onClick={()=> alert(`deletar post id` + id)}></RiDeleteBin7Fill>
      </>
    )
  }
}
    return(
      <IconContext.Provider value={{ color: "#FFFFFF", fontSize:"16px"}}>
        <Posts>
          <div>
            <img src={pictureUrl}/>
          </div>
          <div className="postInfo" id={id}>
            <div className='postHeader'>
              <span>
                <h2>{username}</h2>
                {edit ? <form onSubmit={sendText}>
                          <input 
                            ref={elem}
                            type ="text" 
                            placeholder={article} 
                            //value={newText} 
                            autoFocus 
                           /*  onKeyPress={(e) => sendText(e)}  */
                           // onChange={(e)=> setNewText(e.target.value)} 
                            disabled={loadingEdit}/>
                            <button type="submit"></button>
                        </form>
                        
                      :<h3>{article}</h3>}
              </span>
              <EditIcons/>
            </div>
            <div className="urlInfo" style={{cursor:"pointer"}}onClick={()=> {(window.open(link, "_blank")) }}>
                <div>
                  <h3 style={{fontSize: "16px", marginBottom: "5px"}}>{urlTitle}</h3>
                  <h3 style={{fontSize: "11px", marginBottom: "14px"}}>{urlDescription}</h3>
                  <h3 style={{fontSize: "11px"}}>{link}</h3>
                </div>
                <div>
                  <img src={urlImage} className= "urlInfoImg"alt="" />
                </div>
            </div>
          </div>
        </Posts>
      </IconContext.Provider>
    )
  }

if(connectError!== ""){
   return(
    <>
    <Helmet>
      <style>{'body { background-color: #333333; }'}</style>
    </Helmet>
    <Header />
    <Container>
      <NewPost />
      <h1 style={{color:"#FFFFFF", fontFamily:"Oswald", marginTop:"100px", textAlign:"center", fontSize:"40px"}}>An error occured while trying to fetch the posts, please refresh the page</h1>
    </Container>
  </>
   )
}


if(posts.length===0 && loading === false){
  return(
    <>
    <Helmet>
      <style>{'body { background-color: #333333; }'}</style>
    </Helmet>
    <Header />
    <Container>
      <NewPost />
      <h1 style={{color:"#FFFFFF", fontFamily:"Oswald", marginTop:"100px"}}>There are no posts yet.</h1>
    </Container>
  </>
  )
}

  return (
    <>
      <Helmet>
        <style>{'body { background-color: #333333; }'}</style>
      </Helmet>
      <Header />
      <Container>
        <NewPost />
      
          {loading ? <><h1 style={{color:"#FFFFFF", fontFamily:"Oswald", marginTop:"100px", marginBottom:"10px"}}>Loading</h1>{loadingAnimation}</>:
          <>
              {posts.map(({id, username, pictureUrl, link, article, urlTitle, urlDescription, urlImage, userId})=> {return(
                  <AllPosts 
                    id={id}
                    username={username}
                    pictureUrl ={pictureUrl}
                    link={link}
                    article={article} 
                    urlTitle={urlTitle} 
                    urlDescription={urlDescription} 
                    urlImage={urlImage} 
                    userId={userId}
                  />
                )})} 
            </>
          }
      </Container>

    </>
  );
}

const Container = styled.div`
  margin-top: 185px;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
`;

const Posts= styled.div`
                                width: 611px;
                                height:276px;
                                background-color: #171717;
                                box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
                                border-radius: 16px;
                                margin-bottom: 16px;
                                padding-top: 18px;
                                padding-bottom: 20px;
                                box-sizing: border-box;
                                display: flex;

                                img{
                                    margin-left: 18px;
                                    width: 53px;
                                    height: 53px;
                                    border-radius: 26.5px;
                                }

                                .postInfo{
                                    display:flex;
                                    flex-direction: column;
                                    justify-content: space-around;
                                    margin-left: 18px;
                                }

                                h2{
                                    font-size: 20px;
                                    font-weight:400;
                                    color:#FFFFFF;
                                    font-family: 'Lato', sans-serif;
                                }

                                h3{
                                    font-size: 18px;
                                    font-weight:400;
                                    font-family: 'Lato', sans-serif;
                                    color: #B7B7B7;
                                }

                                .urlInfo{
                                    width:503px;
                                    height: 155px;
                                    border: 1px solid #4D4D4D;
                                    border-radius: 11px;
                                    display: flex;
                                    justify-content: space-between;
                                    align-items: center;
                                    box-sizing:border-box;
                                    padding-left:20px;
                                }

                                .urlInfo>h3{
                                    margin-bottom: 10px;
                                }
                                .urlInfoImg{
                                    width: 155px;
                                    height: 155px;
                                    border-radius: 0px 12px 8px 0px;
                                    box-sizing: border-box;
                                    display:flex;
                                }

                                .postHeader{
                                  display:flex;
                                  align-items: center;
                                  justify-content: space-between;
                                }
`;
