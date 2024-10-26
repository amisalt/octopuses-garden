import { AuthPage } from "../../pages/Auth/AuthPage"

export const privateRoutes = [
    // {path:"/posts", element:PostsPage, exact:true},
    // {path:"/posts/:postId", element:PostPage, exact:true},
    // {path:"/", element:MainPage, exact:false},
    {path:"/auth", element:AuthPage, exact:true},
]
export const publicRoutes = [
    // {path:"/", element:MainPage, exact:false},
    {path:"/", element:AuthPage, exact:true},
]