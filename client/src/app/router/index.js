import { AuthPage } from "../../pages/Auth/AuthPage"
import { GamePage } from "../../pages/Game/GamePage"
import { MainPage } from "../../pages/Main/MainPage"
import { SettingsPage } from "../../pages/Settings/SettingsPage"

export const privateRoutes = [
    // {path:"/posts/:postId", element:PostPage, exact:true},
    // TODO make page for account
    {path:"/account", element:AuthPage, exact:true, icon:undefined, desc:"Account"},
    {path:"/cave", element:SettingsPage, exact:true, icon:undefined, desc:"Cave"},
    {path:"/", element:GamePage, exact:true, icon:undefined, desc:"Start"},
    {path:"/garden", element:SettingsPage, exact:true, icon:undefined, desc:"Garden"},
    {path:"/settings", element:SettingsPage, exact:true, icon:undefined, desc:"Settings"},
    {path:"/level/:levelId", element:GamePage, exact:true, icon:undefined, desc:"Game"}
]
export const publicRoutes = [
    {path:"/auth", element:AuthPage, exact:true, icon:undefined, desc:"Log In"},
    {path:"/settings", element:SettingsPage, exact:true, icon:undefined, desc:"Settings"}
]