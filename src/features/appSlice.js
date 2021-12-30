import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    roomId: null,
    roomName: "",
    roomMessages: {},
    
  },
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    enterRoom: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      state.roomId = action.payload.roomId;
      state.roomName = action.payload.roomName;
      console.log("appSlice-state.roomId: " + state.roomId)
      console.log("appSlice-state.roomName: " + state.roomName)
    },
    appendMessage: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      // action.payload.roomId
      // action.payload.newMsg
      console.log("appSlice-state.roomMessages payload roomId: " + action.payload.roomId)
      console.log("appSlice-state.roomMessages payload newMsg: " + action.payload.newMsg)
      // don't need to create room, has been handle by createRoom action
      // if (!state.roomMessages.hasOwnProperty(action.payload.roomId)){
      //   console.log("create room with roomId... ")
      //   state.roomMessages[action.payload.roomId] = new Array()
      // }
      if (state.roomMessages.hasOwnProperty(action.payload.roomId)){
        // console.log("room with roomId created... ")
        // console.log("type: ", typeof state.roomMessages[action.payload.roomId])
        // console.log("type array: ", Array.isArray(state.roomMessages[action.payload.roomId]))
        // console.log("current array: ", state.roomMessages[action.payload.roomId])
        // state.roomMessages[action.payload.roomId] = []
        state.roomMessages[action.payload.roomId].push(action.payload.newMsg);
        // console.log("length: ", state.roomMessages[action.payload.roomId].length)
        // state.roomMessages[action.payload.roomId].map((elmt, index)=>{
        //   console.log("index:", index, " each element: ", elmt)
        // })
      }
      // state.roomMessages.push(action.payload.newMsg);
      console.log("appSlice-state.roomMessages ", action.payload.roomId)
      console.log(state.roomMessages[action.payload.roomId])
      // console.log("appSlice-state.roomName: "+state.roomName)
    },
    createRoom: (state, action) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
      // action.payload.roomId
      // action.payload.newMsg
      state.roomMessages[action.payload.roomId] = new Array()
      console.log("appSlice-state.createRoom: ", state.roomMessages[action.payload.roomId])
      // console.log("appSlice-state.roomName: "+state.roomName)
    },

  },
});

export const { enterRoom, createRoom, appendMessage } = appSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectRoomId = (state) => state.app.roomId;
export const selectRoomName = (state) => state.app.roomName;
export const selectRoomMessage = (state) => state.app.roomMessages;

export default appSlice.reducer;
