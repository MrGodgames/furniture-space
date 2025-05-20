import React from "react";
import line1 from "./line-1.svg";
import line2 from "./line-2.svg";
import "./strelka.css";

export const Box = () => {
  return (
    <div className="box">
      <div className="group">
        <div className="overlap-group">
          <img className="line" alt="Line" src={line2} />

          <img className="img" alt="Line" src={line1} />
        </div>
      </div>
    </div>
  );
};
