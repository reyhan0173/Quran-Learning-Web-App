import {BrowserRouter as Router, Outlet, Route, Routes} from "react-router-dom";
import Header from "../components/Header";
import Sidebar, {SidebarItem} from "../components/Sidebar";
import {BarChart2, LayoutDashboard} from "lucide-react";
import {BiBook, BiCalendar, BiChalkboard, BiGroup, BiMale} from "react-icons/bi";
import React from "react";

export default function Root(){

    return (
        <div className="App">
            <Header/>
            <div className="App-body">
                <Sidebar>
                    <SidebarItem to="/" icon={<LayoutDashboard size={40}/>} text="Dashboard" alert/>
                    <SidebarItem to="/analytics" icon={<BarChart2 size={40}/>} text="Analytics" active/>
                    <SidebarItem to="/homework" icon={<BiChalkboard size={40}/>} text="Homeword Cards" active/>
                    <SidebarItem to="/quran-explorer" icon={<BiBook size={40}/>} text="Quran Explorer" active/>
                    <SidebarItem to="/class-list" icon={<BiGroup size={40}/>} text="Tables" active/>
                    <SidebarItem to="/attendance" icon={<BiCalendar size={40}/>} text="Attendance" active/>
                    <SidebarItem to="/profile" icon={<BiMale size={40}/>} text="Profile" active/>
                </Sidebar>
                <main>
                </main>
            </div>
            <div id="detail">
                <Outlet/>
            </div>
        </div>
    );
}