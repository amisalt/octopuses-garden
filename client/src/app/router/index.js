import { AuthPage } from "../../pages/Auth/AuthPage"
import { MainPage } from "../../pages/Main/MainPage"
import { SettingsPage } from "../../pages/Settings/SettingsPage"

export const privateRoutes = [
    // {path:"/posts", element:PostsPage, exact:true},
    // {path:"/posts/:postId", element:PostPage, exact:true},
    // {path:"/", element:MainPage, exact:false},
    {path:"/settings", element:SettingsPage, exact:true},
    {path:"/auth", element:AuthPage, exact:true},
    {path:"/", element:MainPage, exact:true}
]
export const publicRoutes = [
    // {path:"/", element:MainPage, exact:false},
    {path:"/settings", element:SettingsPage, exact:true},
    {path:"/auth", element:AuthPage, exact:true},
]