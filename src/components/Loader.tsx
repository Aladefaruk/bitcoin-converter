/** @format */

import React from "react";
import LoadingImage from "../assets/logo/bitcoin.png"

const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="pulsating-bitcoin">
        <img src={LoadingImage} alt="" width="80px" height="80px" />      </div>
    </div>
  );
};

export default Loader;
