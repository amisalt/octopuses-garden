import { useDispatch, useSelector } from "react-redux";
import { tokenQuery } from "../app/store/slices/AuthSlice";

export async function useDispatchThunksTokenCheck(thunk){
  const dispatch = useDispatch()
  dispatch(tokenQuery())
  dispatch(thunk())
}