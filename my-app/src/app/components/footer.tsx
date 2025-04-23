import { FaWhatsapp, FaInstagram, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <>
      <div className="bg-[#892D20] text-white py-6 px-6 text-sm mt-10 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center mt-10 mb-10">
          <div>
            <h5 className="font-bold mb-2">LOGO</h5>
          </div>
          <div>
            <h5 className="font-bold mb-2">NAVIGATION</h5>
            <ul className="space-y-1">
              <li>Home</li>
              <li>About</li>
              <li>Shop</li>
              <li>Contact</li>
            </ul>
          </div>
          <div>
            <h5 className="font-bold mb-2">PLATFORMS</h5>
            <ul className="flex flex-col items-center gap-1">
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
      </div>

      <p className="text-center text-green-600 text-sm mt-4 mb-4">
      &copy; {new Date().getFullYear()} Douluxme. All rights reserved.
      </p>
    </>
  );
};

export default Footer;
