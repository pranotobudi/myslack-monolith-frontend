import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '@mui/material';
import { useSelector } from "react-redux"
import { selectRoomId, selectRoomName } from '../features/appSlice'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

export default function ChatInput({channelName, channelId, chatRef, websocket, userMongo}) {
    const [user] = useAuthState(auth);
    const [input, setInput] = useState("");
    const roomId = useSelector(selectRoomId);
    const roomName = useSelector(selectRoomName);

    console.log("ChatInput-selectRoomId: ", roomId);    
    console.log("ChatInput-channelName: ", channelName);    
    console.log("ChatInput-channelId: ", channelId);    
    console.log("ChatInput-websocket: ", websocket);    
    console.log("ChatInput-userMongo: ", userMongo);    


    const sendToBackend = () => {
        console.log("inside sendToBackend...")
        try {
            websocket.send(JSON.stringify({
                "message": input,
                "room_id": roomId,
                "user_id": userMongo.id,
                "username":userMongo.username,
                "user_image": userMongo.user_image,
                "timestamp": new Date().toISOString(),
            }));
        } catch (e) {
            console.error("Error adding document: .", e);

        }
    }

    const sendMessage = async (e) => {
        channelId=roomId
        console.log("input: ", input)
        console.log("channelID: ", channelId)
        e.preventDefault(); // prevent refresh
        if (!channelId){
            return false;
        }
        
        sendToBackend();

        chatRef.current.scrollIntoView({
            behavior: "smooth",
        });
    
        setInput("");
    };

    return (
        <ChatInputContainer>
            <form>
                <input 
                    value={input} 
                    onChange={(e)=>setInput(e.target.value)}
                    placeholder={`Message #${roomName}`} 
                />
                <Button hidden type="submit" onClick={sendMessage}>
                    SEND
                </Button>
            </form>
        </ChatInputContainer>
    )
}

const ChatInputContainer = styled.div`
    border-radius: 20px;
    > form {
        position: relative;
        display: flex;
        justify-content: center;
    }

    > form > input {
        position : fixed;
        bottom: 30px;
        width: 60%;
        border: 1px solid gray;
        border-radius: 3px;
        padding: 20px;
        outline: none;
    }

    > form > button {
        display: none !important;
    }
`;