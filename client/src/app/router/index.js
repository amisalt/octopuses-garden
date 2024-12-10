import { AccountPage } from "../../pages/Account/AccountPage"
import { AuthPage } from "../../pages/Auth/AuthPage"
import { GamePage } from "../../pages/Game/GamePage"
import { MainPage } from "../../pages/Main/MainPage"
import { PlaceholderPage } from "../../pages/Placeholder/PlaceholderPage"
import { SettingsPage } from "../../pages/Settings/SettingsPage"
import TutorialPage from "../../pages/Tutorial/TutorialPage"

export const privateRoutes = [
    // {path:"/posts/:postId", element:PostPage, exact:true},
    // TODO make page for account
    {path:"/account", element:AccountPage, exact:true, icon:"/api/image/icons/nav/account.png", desc:"Account"},
    {path:"/cave", element:PlaceholderPage, exact:true, icon:"/api/image/icons/nav/cave.png", desc:"Cave"},
    {path:"/", element:MainPage, exact:true, icon:"/api/image/icons/nav/start.png", desc:"Start"},
    {path:"/garden", element:PlaceholderPage, exact:true, icon:"/api/image/icons/nav/garden.png", desc:"Garden"},
    {path:"/settings", element:SettingsPage, exact:true, icon:"/api/image/icons/nav/settings.png", desc:"Settings"},
    {path:"/tutorial", element:TutorialPage, exact:true, icon:undefined, desc:"Tutorial"},
    {path:"/level/:levelId", element:GamePage, exact:true, icon:undefined, desc:"Game"},
]
export const publicRoutes = [
    {path:"/auth", element:AuthPage, exact:true, icon:"/api/image/icons/nav/account.png", desc:"Log In"},
    {path:"/settings", element:SettingsPage, exact:true, icon:"/api/image/icons/nav/settings.png", desc:"Settings"}
]