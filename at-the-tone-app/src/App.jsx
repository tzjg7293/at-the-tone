import { useState, useRef } from 'react'
import AudioRecorder from "../src/AudioRecorder";
import './App.css'

const App = () => {

  return (
      <div>
          <h1>At the Tone</h1>
          <p>Anonymous voice memos... A safe and free space to vent and share stories, thoughts and life experiences.</p>
          <div>
              {<AudioRecorder/>}
          </div>
      </div>
  );
};
export default App;
