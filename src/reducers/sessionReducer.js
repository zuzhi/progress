import { createSlice } from "@reduxjs/toolkit"

const sessionSlice = createSlice({
  name: 'session',
  initialState: null,
  reducers: {
    setSession(state, action) {
      return action.payload
    }
  }
})

export default sessionSlice.reducer
export const { setSession } = sessionSlice.actions
