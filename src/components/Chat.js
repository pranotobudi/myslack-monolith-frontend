import React, { useRef, useEffect } from 'react';
import styled from "styled-components";
import InfoIcon from '@mui/icons-material/Info';
import { Button } from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ChatInput from './ChatInput';
import Message from './Message';
import { selectRoomId, selectRoomName, selectRoomMessage, selectUserMongo } from '../features/appSlice'
import { createRoom, appendMessage, updateUserMongo } from "../features/appSlice";
import { useSelector, useDispatch } from "react-redux";
import { auth } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Chat({websocket, newMsg}) {
    const dispatch = useDispatch();
    const chatRef = useRef(null);
    const roomId = useSelector(selectRoomId);
    const roomName = useSelector(selectRoomName);
    const roomMessages = useSelector(selectRoomMessage);
    const userMongo = useSelector(selectUserMongo);
    const [user] = useAuthState(auth);
    console.log("Chat-selectRoomId: ", roomId);
    console.log("Chat-selectRoomName: ", roomName);
    console.log("Chat-New Incoming Message: ", newMsg);
    console.log("Chat-New userMongo: ", userMongo);
    console.log("Chat-New userMongo.rooms: ", userMongo.rooms);

    // - chat show up if user have roomAccess
    // - if user don't have roomAccess show roomRegister button
    // - if user register: 
    //     - update user database
    //     - reload user again
    // - user state need to be on redux

    React.useEffect(function effectFunction() {
        async function fetchMessages(){
            if ( !roomMessages[roomId] ){
                dispatch(createRoom({
                    roomId: roomId,
                }))        
            }
            // if (roomMessages[roomId].length === 0){
            // roomMessages is an object, roomId is its property. roomId is an array of messages objects. 
            if (roomMessages[roomId] == null){
                    
                    // if (roomId in roomMessages[].length === 0){

                var url = new URL(`${process.env.REACT_APP_EXTERNAL_HOST}/messages`)
                var params = {room_id:roomId}
                console.log("Chat.js - roomID", roomId)
                url.search = new URLSearchParams(params).toString();
                    
                const response = await fetch(url);
                const json = await response.json();
                console.log("response messages : ", json["data"])

                
                json["data"] && json["data"].map((msg)=>{
                        console.log(`json["data"].map(msg): `, msg)
                        dispatch(appendMessage({
                            roomId: roomId, 
                            newMsg: msg,
                        }))        
                })    
                
            }    
        }
        fetchMessages();
    }, [roomId, dispatch, roomMessages, user]); 
    // second parameter is dependency: effect will activate if the value in the list change

    // scroll view
    useEffect(()=>{
        console.log("Chat.js - INSIDE useEffect - useRef ")
        chatRef?.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, );
// }, [roomId]); // with this line, first loading component doesn't executed because roomId not available, this case nothing to do with roomId.       


    const updateUserRooms = async () => {
        // update user room with new join room
        let newRooms
        if (userMongo.rooms){
            newRooms = [...userMongo.rooms]
        }else{
            newRooms = []
        }
        console.log("inside updateUserRooms, userMongoRooms: ", userMongo.rooms)
        console.log("inside updateUserRooms, newRooms: ", newRooms)
        newRooms.indexOf(roomId) === -1 ? newRooms.push(roomId) : console.log("This item already exists");
        // newRooms.push(roomId)
        console.log("inside updateUserRooms, updated newRooms: ", newRooms)
        
        var url = new URL(`${process.env.REACT_APP_EXTERNAL_HOST}/updateUserRooms`)
        const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id:userMongo.id,
            email: userMongo.email,
            username:userMongo.username,
            user_image:userMongo.user_image,
            rooms:newRooms,        
        })
        };
        console.log("updateUserRooms request body", requestOptions.body)
        const response = await fetch(url, requestOptions);
        const json = await response.json();
        console.log("response messages : ", json["data"])
        // updateUserMongo(json["data"]);
        dispatch(updateUserMongo({
        userMongo: json["data"],
        })) 

    }

    return (
        <ChatContainer>
            {roomId && roomName && roomMessages &&  (
                <>
                    <Header>
                        <HeaderLeft>
                            <h4>
                                <strong>#{roomName}</strong>
                            </h4>
                            <StarBorderIcon />
        
                        </HeaderLeft>
                        <HeaderRight>
                            <p>
                                <InfoIcon /> Details
                            </p>
                        </HeaderRight>
        
                    </Header>
                    {/* 
                        condition: 
                        user don't have rooms at all OR 
                        have room but don't have this specific room 
                    */}
                    {(!userMongo.rooms || userMongo.rooms.indexOf(roomId) === -1) ?(
                        <JoinButton>
                            <Button type="submit" onClick={updateUserRooms}>
                            Join This Room
                            </Button>
                        </JoinButton>
        
                        ):(
                    <>
                        <ChatMessages>
                            {/* this to handle backend data */}
                            {
                                roomMessages[roomId]?<>Yes available</>:<>Not availabe</>
                                    
                            }
                            { 
                                // roomMessages could be undefined because async, 
                                // so only executed if available, otherwise it will throw error
                                roomMessages[roomId]?.map((chat) => {
                                    // console.log("Chat.js chat: ", chat)
                                    return (
                                        <Message 
                                            key={chat["id"]}
                                            message={chat["message"]}
                                            timestamp={chat["timestamp"]}
                                            username={chat["username"]}
                                            userImage={chat["user_image"]}
                                        />
                                    );
                                })
                                // <p>{roomMessages.length}</p>
                            }
            
                            <ChatBottom ref={chatRef} />
                        </ChatMessages>
            
                        <ChatInput 
                            chatRef={chatRef}
                            channelName={roomName}
                            channelId={roomId}
                            websocket={websocket}
                            userMongo={userMongo}
                        />
                    </>)}
                </>                    
            )}
        </ChatContainer>
    )
}

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid lightgray;
`;
const HeaderLeft = styled.div`
    display: flex;
    align-items: center;
    > h4 {
        display: flex;
        text-transform: lowercase;
        margin-right: 10px;
    }
    > h4 > .MuiSvgIcon-root {
        margin-left: 10px;
        font-size: 18px;
    }
`;

const HeaderRight = styled.div`
    > p {
        display: flex;
        align-items: flex-end;
        font-size: 14px;
    }
    > p > .MuiSvgIcon-root {
        margin-right: 5px !important;
        font-size: 16px;
    }

`;

const ChatContainer = styled.div`
    flex: 0.7;
    flex-grow: 1;
    overflow-y: scroll;
    margin-top: 60px;
`;

const ChatMessages = styled.div``;

const ChatBottom = styled.div`
    padding-bottom: 200px;
`;

const JoinButton = styled.div`
    > button {
        /* display: flex;
        align-items: center; */
        color: white;
        background-color: var(--slack-color);
    }
`;