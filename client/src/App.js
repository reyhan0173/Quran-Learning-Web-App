import React from 'react';
import Header from './components/Header';
import AyahList from './components/AyahList';
import AudioRecorder from './components/AudioRecorder';
import AudioPlayer from './components/AudioPlayer';
import { AudioPlayerProvider } from './components/AudioPlayerContext';
import 'font-awesome/css/font-awesome.min.css';
import './App.css';
import './main.css';
import Sidebar from "./components/Sidebar";
import { SidebarItem } from "./components/Sidebar";
import {
  Lifebuoy,
  Receipt,
  Boxes,
  Package,
  UserCircle,
  BarChart2,
  LayoutDashboard,
  Settings,
} from "lucide-react";

function App() {
  return (
    <AudioPlayerProvider>
      <div className="App">
        <Header />
        <div className="App-body">
          <Sidebar>
            <SidebarItem icon={<LayoutDashboard size={20} />} text="Dashboard" alert />
            <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active />
            <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active />
            <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active />
            <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active />
            <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active />
            <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active />
            <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active />
            <SidebarItem icon={<BarChart2 size={20} />} text="Analytics" active />
          </Sidebar>

          <main className="App-main">
            <AyahList start_pos="5:8" end_pos="5:31" />
            <AudioRecorder />
            <AudioPlayer />
          </main>
        </div>
      </div>
    </AudioPlayerProvider>
  );
}

export default App;
