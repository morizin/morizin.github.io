import React from "react";
import Typist from "react-typist";
import "./css/name.css";
import "react-typist/dist/Typist.css";
export default function Name() {
  return (
    <div className="name">
      <Typist
        avgTypingDelay={70}
        stdTypingDelay={5}
        startDelay={3000}
        cursor={{
          show: false,
        }}
      >
        <span>I am Mohammed</span>
        <Typist.Delay ms={1000} />
        <span>
          Riz#n
          <Typist.Backspace count={2} delay={200} />
          in.
        </span>
        <br />
        <Typist.Delay ms={1000} />
        <span>Youngest </span>
        <br />
        <span> Data Scientist.</span>
      </Typist>
    </div>
  );
}
