import Sidebar from "./components/sidebar";
import "./App.css";
import {SidebarItem} from "./components/sidebar";
import{
    Lifebuoy,
    Receipt,
    Boxes,
    Package,
    UserCircle,
    BarChart2,
    LayoutDashboard,
    Settings,
} from "lucide-react";

export default function App() {
  return (
      <main className="App">
          <Sidebar>
              <SidebarItem
                  icon={<LayoutDashboard size={20} />}
                  text="Dashboard"
                  alert
              />
              <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active/>
              <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active/>
              <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active/>
              <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active/>
              <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active/>
              <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active/>
              <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active/>
              <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active/>
              
          </Sidebar>
      </main>
  );
}