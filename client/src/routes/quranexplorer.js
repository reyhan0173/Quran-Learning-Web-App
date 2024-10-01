import {AudioPlayerProvider} from "../components/AudioPlayerContext";
import Approve from "../components/Approve";
import Assign from "../components/Assign";
import AyahList from "../components/AyahList";
import MistakeButtons from "../components/MistakeButtons";
import AudioRecorder from "../components/AudioRecorder";
import AudioPlayer from "../components/AudioPlayer";
import React from "react";
import {useParams} from "react-router-dom";

export default function QuranExplorer () {
        const {studentId, courseId} = useParams();

        return (
    <AudioPlayerProvider>
        <Approve studentId={studentId} courseId={courseId} startPos={"108:1"} endPos={"110:3"} />
        <Assign studentId={studentId} courseId={courseId} />
        <AyahList studentId={studentId} courseId={courseId} />
        <MistakeButtons />
        <AudioRecorder />
        <AudioPlayer />
    </AudioPlayerProvider>
);
}