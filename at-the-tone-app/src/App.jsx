import { useState, useRef } from 'react'
import AudioRecorder from "../src/AudioRecorder";
import './App.css'

const App = () => {
  let [recordOption, setRecordOption] = useState("audio");
  const toggleRecordOption = (type) => {
      return () => {
          setRecordOption(type);
      };
  };
  return (
      <div>
          <h1>React Media Recorder</h1>
          <div className="button-flex">
              <button onClick={toggleRecordOption("audio")}>
                Record Audio
              </button>
          </div>
          <div>
              {<AudioRecorder/>}
          </div>
      </div>
  );
};
export default App;
