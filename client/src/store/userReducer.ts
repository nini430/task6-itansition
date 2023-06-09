import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosApiInstance from '../axios';

interface InitialStateInterface {
  userName: string | null;
  userId: string | null;
  users: any;
  usersLoading: boolean;
  messages: null | any;
  messagesLoading: boolean;
  sendMessageLoading: boolean;
  getMessagesLoading: boolean;
}

const initialState: InitialStateInterface = {
  userName: '',
  userId: '',
  users: [],
  usersLoading: false,
  messages: null,
  messagesLoading: false,
  sendMessageLoading: false,
  getMessagesLoading: false,
};

export const sendMessage = createAsyncThunk(
  '/messages/add',
  async (
    {
      from,
      to,
      subject,
      message,
      onSuccess,
    }: {
      from: string;
      to: string;
      subject: string;
      message: string;
      onSuccess: (data: any) => void;
    },
    thunkApi
  ) => {
    try {
      const response = await axiosApiInstance.post('/messages', {
        from,
        to,
        subject,
        message,
      });
      onSuccess && onSuccess(response.data);
      return response.data;
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const getMessages = createAsyncThunk(
  '/messages',
  async ({ from, to }: { from: string; to: string }, thunkApi) => {
    try {
      const response = await axiosApiInstance.get(`/messages/${from}/${to}`);
      console.log(response.data);
      return response.data;
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const addUser = createAsyncThunk(
  '/user/add',
  async ({ name }: { name: string }, thunkApi) => {
    try {
      const response = await axiosApiInstance.post('/user', { name });
      return response.data;
    } catch (err) {
      return thunkApi.rejectWithValue(err);
    }
  }
);

export const getUsers = createAsyncThunk('/users', async (_, thunkApi) => {
  try {
    const response = await axiosApiInstance.get('/user');
    return response.data;
  } catch (err) {
    return thunkApi.rejectWithValue(err);
  }
});

const chatGeneralUpdate = (state: any, action: any) => {
  const conversation = state.messages.find(
    (message: any) => message.convo._id === action.payload.convo._id
  );
  const conversationIndex = state.messages.findIndex(
    (message: any) => message.convo._id === action.payload.convo._id
  );
  const modifiedArray = state.messages.map((message: any) =>
    message.convo._id === action.payload.convo._id
      ? {
          ...message,
          messages: [action.payload.message, ...message.messages],
        }
      : message
  );

  const removedElement = modifiedArray.splice(conversationIndex, 1)[0];

  state.messages = Array.isArray(state.messages)
    ? conversation
      ? [removedElement, ...modifiedArray]
      : [
          { convo: action.payload.convo, messages: [action.payload.message] },
          ...state.messages,
        ]
    : [
        {
          convo: action.payload.convo,
          messages: [action.payload.message],
        },
      ];
};

const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout(state) {
      state.userName = null;
    },
    updateChat: (state, action) => {
      chatGeneralUpdate(state, action);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addUser.fulfilled, (state, action) => {
      state.userName = action.payload.name;
      state.userId = action.payload._id;
    });
    builder.addCase(getUsers.pending, (state) => {
      state.usersLoading = true;
    });
    builder.addCase(getUsers.fulfilled, (state, action) => {
      state.usersLoading = false;
      state.users = action.payload;
    });
    builder.addCase(getUsers.rejected, (state) => {
      state.usersLoading = false;
    });
    builder.addCase(sendMessage.pending, (state) => {
      state.sendMessageLoading = true;
    });
    builder.addCase(sendMessage.fulfilled, (state, action) => {
      state.sendMessageLoading = false;
      chatGeneralUpdate(state, action);
    });
    builder.addCase(sendMessage.rejected, (state) => {
      state.sendMessageLoading = false;
    });
    builder.addCase(getMessages.pending, (state) => {
      state.getMessagesLoading = true;
    });
    builder.addCase(getMessages.fulfilled, (state, action) => {
      state.getMessagesLoading = false;
      state.messages = action.payload;
    });
    builder.addCase(getMessages.rejected, (state) => {
      state.getMessagesLoading = false;
    });
  },
});

export const { logout,updateChat } = userReducer.actions;
export default userReducer.reducer;
