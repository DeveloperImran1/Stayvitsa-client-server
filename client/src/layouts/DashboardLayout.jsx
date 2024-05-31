import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
    return (
        <div className="relative min-h-screen md:flex" >
            {/* sidebar */}
            <div>
                <Sidebar></Sidebar>
            </div>



            {/* Outlet ---> Dynamic content  */}
            <div className="flex-1 md:ml-64" >
                <div className="p-5" >
                    <Outlet></Outlet>
                </div>
            </div>
            
        </div>
    );
};

export default DashboardLayout;