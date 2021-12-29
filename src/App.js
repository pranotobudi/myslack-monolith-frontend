import React from 'react';
import styled from 'styled-components';
import './App.css';
import Header from './components/Header.js';
import Sidebar from './components/Sidebar.js';
import Chat from './components/Chat.js';
import Login from './components/Login.js';
import {
  BrowserRouter,
  Routes,
  Route,  
} from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth"
import { auth } from './firebase';
import Spinner from 'react-spinkit'
// import your route components too

// function Welcome() {
//   return <h1>Hello,</h1>;
// }

function App() {
  const [user, loading] =useAuthState(auth);

  const [userMongo, updateUserMongo] = React.useState();
 
  React.useEffect(function effectFunction() {
      async function fetchUser(){
          var url = new URL(`${process.env.REACT_APP_EXTERNAL_HOST}/userByEmail`)
          var params = {email:user.email}
          console.log("App.js - email", user.email)
          url.search = new URLSearchParams(params).toString();
              
          const response = await fetch(url);
          const json = await response.json();
          console.log("response messages : ", json["data"])
          updateUserMongo(json["data"]);
      }
      fetchUser();
  }, [user]); 
  // second parameter is dependency: effect will activate if the value in the list change
  // var currentDate = new Date()
  console.log("CURRENT TIME: ", new Date().toISOString())  
  var conn
  function dial() {
    conn = new WebSocket("ws://localhost:8080/websocket")

    conn.addEventListener("close", ev => {
      console.log(`WebSocket Disconnected code: ${ev.code}, reason: ${ev.reason}`, true)
      if (ev.code !== 1001) {
        console.log("Reconnecting in 10s", true)
        setTimeout(dial, 10000)
      }
    })
    conn.addEventListener("open", ev => {
      console.info("websocket connected");
      console.log("inside sendUserInfo...")
      try {
          // conn.send(JSON.stringify({"client_id": user.email, "text": "[USERINFO]", "room_id": ""}));
          conn.send(JSON.stringify({
            "message": "[USERINFO]",
            "room_id": "",
            "user_id": userMongo.id,
            "username":user.displayName,
            "user_image": user.photoURL,
            "timestamp": new Date().toISOString(),
        }));

      } catch (e) {
          console.error("Error adding document: .", e);
      }
    })

    // This is where we handle messages received.
    conn.addEventListener("message", ev => {
      if (typeof ev.data !== "string") {
        console.log("============================================")
        console.error("unexpected message type", typeof ev.data)
        console.log("============================================")
        return
      }
      console.log(ev.data)

    })
  }
  dial()
  // async function sendClientAuth(context){
  //   const requestOptions = {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify({ title: 'React POST Request Example' })
  //   };
  //   fetch('https://reqres.in/api/posts', requestOptions)
  //       .then(response => response.json())
  //       .then(data => this.setState({ postId: data.id }));
  
  //     var products
  //     const response = await fetch(`${process.env.EXTERNAL_HOST}/api/v1/products`)
  //     .then(res=>res.json())
  //     .then((responseJson)=>{
  //       products = responseJson["data"]
  //     })
  //     .catch((error)=>{
  //       products=[]
  //       console.log(error)
    
  //     });
    
    
  //     console.log("PRODUCTS: ", products)
      
    
  //     // const products = myDummyProducts
  //     return {
  //       props: {
  //         products,
  //       },
  //     };
  //   }

  console.log("App comp")
  if (loading){
    return (
      <AppLoading>
        <AppLoadingContents>
          <img
              src="https://cdn.cdnlogo.com/logos/s/40/slack-new.svg"
              alt=""
          />
          <Spinner 
            name="ball-spin-fade-loader"
            color="purple"
            fadeIn="none"
          />
        </AppLoadingContents>
      </AppLoading>
    )
  }
  return (
    <div className="App">
    <BrowserRouter>
      {!user ?(
            <Login />
          ):(
      <>
        <Header />
        <AppBody>
          <Sidebar websocket={conn} userMongo={userMongo} />
          <Routes>
              <Route path="/" element={<Chat websocket={conn} userMongo={userMongo} />} />
          </Routes>
        </AppBody>
      </>
      )}
    </BrowserRouter>


      {/* Let's build slack! */}
    </div>
  );
}

export default App;

const AppBody = styled.div`
  display: flex;
  height: 100vh;
`;

const AppLoading = styled.div`
  display: grid;
  place-items: center;
  height: 100vh;
  width: 100%;
`;

const AppLoadingContents = styled.div`
  text-align: center;
  padding-bottom: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > img{
    height: 200px;
    padding: 20px;    
  }

`;
