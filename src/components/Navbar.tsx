import { FiGithub } from "react-icons/fi";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";


const Navbar = () => {
    return (
        <nav className="w-full h-16 px-4 border-b border-neutral-700 bg-neutral-950 bg-opacity-75 fixed top-0">
            <div className="flex items-center justify-between max-w-5xl mx-auto h-full">
                <div className="flex items-center gap-1.5">
                    <Link to="/" className="flex items-center gap-1">
                        <img src={Logo} className="w-5 h-5" />
                        <h1 className="text-lg font-medium text-gray-400">Roketo</h1>
                    </Link>
                </div>
                <Link to="" target="_blank">
                    <FiGithub className="text-gray-400 hover:text-white duration-150 transition-colors h-6 w-6" />
                </Link>
            </div>
        </nav>
    );
};
export default Navbar;