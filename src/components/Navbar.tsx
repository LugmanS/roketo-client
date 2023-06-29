import { FiGithub } from "react-icons/fi";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.svg";
import { githubURL } from "../utils/Config";


const Navbar = () => {
    return (
        <nav className="w-full h-16 px-4 border-b border-neutral-800 bg-neutral-950 fixed top-0">
            <div className="flex items-center justify-between max-w-5xl mx-auto h-full">
                <div className="flex items-center gap-1.5">
                    <Link to="/" className="flex items-center gap-1">
                        <img src={Logo} className="w-5 h-5" />
                        <h1 className="text-lg font-medium text-gray-400">Roketo</h1>
                    </Link>
                </div>
                <Link to={githubURL} target="_blank">
                    <FiGithub className="text-gray-400 hover:text-white duration-150 transition-colors h-5 w-5" />
                </Link>
            </div>
        </nav>
    );
};
export default Navbar;