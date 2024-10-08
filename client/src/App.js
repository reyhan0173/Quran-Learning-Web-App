import React from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import AyahList from './components/AyahList';
import AudioRecorder from './components/AudioRecorder';
import AudioPlayer from './components/AudioPlayer';
import { AudioPlayerProvider } from './components/AudioPlayerContext';
import Sidebar from "./components/Sidebar";
import { SidebarItem } from "./components/Sidebar";
import { BarChart2, LayoutDashboard } from "lucide-react";
import Approve from "./components/Approve";
import Assign from "./components/Assign";
import {BiBook, BiMale, BiCalendar, BiGroup, BiChalkboard} from 'react-icons/bi';
import HomeworkCard from "./components/HomeworkCard";
import Table from "./components/Table";
import ClassPlacement from "./components/ClassPlacement";
import MistakeButtons from "./components/MistakeButtons";
import Login from "./components/Login";

const Tables = () => (
  <Table />
)

const HomeworkCards = () => (
  <HomeworkCard />
);

const Dashboard = () => (
  <ClassPlacement />
);

const Analytics = () => <div>Analytics Page</div>;
const QuranExplorer = () => (
  <AudioPlayerProvider>
    <Approve studentId={1111115} courseId={123} startPos={"108:1"} endPos={"110:3"} />
    <Assign studentId={1111115} courseId={123} />
    <AyahList studentId={1111115} courseId={123} />
    <MistakeButtons />
    <AudioRecorder />
    <AudioPlayer />
  </AudioPlayerProvider>
);

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <div className="App-body">
          <Sidebar>
            <SidebarItem to="/" icon={<LayoutDashboard size={40} />} text="Dashboard" alert />
            <SidebarItem to="/analytics" icon={<BarChart2 size={40} />} text="Analytics" active />
            <SidebarItem to="/homework-cards" icon={<BiChalkboard size={40} />} text="Homeword Cards" active />
            <SidebarItem to="/quran-explorer" icon={<BiBook size={40} />} text="Quran Explorer" active />
            <SidebarItem to="/tables" icon={<BiGroup size={40} />} text="Tables" active />
            <SidebarItem to="/attendance" icon={<BiCalendar size={40} />} text="Attendance" active />
            <SidebarItem to="/profile" icon={<BiMale size={40} />} text="Profile" active />
          </Sidebar>
          <main>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/quran-explorer" element={<QuranExplorer />} />
              <Route path="/homework-cards" element={<HomeworkCards />} />
              <Route path="/tables" element={<Tables />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
