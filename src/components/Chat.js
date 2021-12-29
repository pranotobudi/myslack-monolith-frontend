import React, { useState, useRef, useEffect } from 'react';
import styled from "styled-components";
import InfoIcon from '@mui/icons-material/Info';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ChatInput from './ChatInput';
import Message from './Message';
import { firebaseConfig } from '../firebase';
import { initializeApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, Timestamp, query, orderBy } from "firebase/firestore"; 
import {useCollection, useDocument} from "react-firebase-hooks/firestore";
import { useSelector } from "react-redux"
import { selectRoomId, selectRoomName } from '../features/appSlice'


export default function Chat({websocket, userMongo}) {
    const chatRef = useRef(null);
    const roomId = useSelector(selectRoomId);
    const roomName = useSelector(selectRoomName);
    console.log("Chat-selectRoomId: ", roomId);
    console.log("Chat-selectRoomName: ", roomName);

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

        // snapshotListen is a listener for real-time event update in the firestore
    // const [roomMessages, loading, error] = useCollection(
    //     // only getDocs IF roomId available. because if roomId not available it will throw eror. 
    //     roomId && query(collection(db, "rooms", roomId, "messages"), orderBy("timestamp")), {
    //         snapshotListenOptions: { includeMetadataChanges: true },
    //       }
    // );

    // useEffect(()=>{
    //     chatRef?.current?.scrollIntoView({
    //         behavior: "smooth",
    //     });
    // }, [roomId, loading]);
    // second parameter is dependency: effect will activate if the value in the list change
    // console.log(roomMessages);

    const [roomMessages, updateRoomMessages] = React.useState([]);
 
    React.useEffect(function effectFunction() {
        async function fetchMessages(){
            var url = new URL(`${process.env.REACT_APP_EXTERNAL_HOST}/messages`)
            var params = {room_id:roomId}
            console.log("Chat.js - roomID", roomId)
            url.search = new URLSearchParams(params).toString();
                
            const response = await fetch(url);
            const json = await response.json();
            console.log("response messages : ", json["data"])
            updateRoomMessages(json["data"]);
        }
        fetchMessages();
    }, [roomId]); 
    // second parameter is dependency: effect will activate if the value in the list change
    useEffect(()=>{
        chatRef?.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [roomId]);
    
    return (
        <ChatContainer>
            {roomId && roomName && (
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
                <ChatMessages>
                    {/* this to handle firestore data */}
                    {/* { 
                        // roomMessages could be undefined because async, 
                        // so only executed if available, otherwise it will throw error
                        roomMessages?.docs.map((chat) => {
                            // doc.data() is never undefined for query doc snapshots
                            const {message, timestamp, user, userImage} = chat.data();
                            // const chatMessage = {id:doc.id, message:message, timestamp:timestamp, user:user, userImage:userImage};
                            // console.log("CHAT - ChatMessages id: ", chat.id)
                            // console.log("id: ", chat.id, "userImage: ", userImage);
                            return (
                                <Message 
                                    key={chat.id}
                                    message={chat.get("message")}
                                    timestamp={timestamp}
                                    user={user}
                                    userImage={userImage}
                                />
                            );
                        })
                        // <p>{roomMessages.length}</p>
                    } */}
                    {/* this to handle backend data */}
                    { 
                        // roomMessages could be undefined because async, 
                        // so only executed if available, otherwise it will throw error
                        roomMessages?.map((chat) => {
                            // doc.data() is never undefined for query doc snapshots
                            // const {message, user_id, room_id, username, user_image, timestamp} = chat.data();
                            // const chatMessage = {id:doc.id, message:message, timestamp:timestamp, user:user, userImage:userImage};
                            // console.log("CHAT - ChatMessages id: ", chat.id)
                            // console.log("id: ", chat.id, "userImage: ", userImage);
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