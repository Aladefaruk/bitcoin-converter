/** @format */

import LogoImg from "../assets/logo/bitcoin.png";


interface LogoProps {
  size: 'sm' | 'md' | 'lg'; // Restrict size to only these values
}
const Logo: React.FC<LogoProps> = ({ size }) => {
  return(
  <div className = " flex items-center" >
    <img src={LogoImg} alt="logo" width={size === "sm" ? "30px" : size === "md" ? "50px" : "100px"} height={size === "sm" ? "30px" : size === "md" ? "50px" : "100px"} />
    <h1 className="text-[black] font-[500] px-2">Bitcoin Converter</h1>
  </div >
  );
};

export default Logo;