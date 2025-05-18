import { Outlet } from "react-router-dom"
import Header from "../Components/Header"
import Footer from "../Components/Footer"



const MainRouter = () => {
  return (
    <div>
        <div className="header">
            <Header/>
        </div>
                
        <div className="content">
            <Outlet/>
        </div>
        <div className="footer">
            <Footer/>
        </div>
    </div>
  )
}

export default MainRouter