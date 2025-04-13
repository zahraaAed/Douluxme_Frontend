import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-[#892D20] text-white py-6 px-6 text-sm mt-10">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div>
          <h5 className="font-bold mb-2">LOGO</h5>
        </div>
        <div>
          <h5 className="font-bold mb-2">NAVIGATION</h5>
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-2">PLATFORMS</h5>
          <ul className="flex flex-col items-center md:items-start gap-1">
            <li className="flex items-center gap-2">
              <FaEnvelope /> Email
            </li>
            <li className="flex items-center gap-2">
              <FaInstagram /> Instagram
            </li>
            <li className="flex items-center gap-2">
              <FaWhatsapp /> WhatsApp
            </li>
          </ul>
        </div>
      </div>
      <p className="text-center mt-4">copyright &copy; all rights reserved</p>
    </div>
  );
};

export default Footer;
