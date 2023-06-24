import { FiGithub } from "react-icons/fi";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="w-full h-16 px-4 bg-neutral-800 fixed top-0">
            <div className="flex items-center justify-between max-w-5xl mx-auto h-full">
                <div className="flex items-center gap-1.5">
                    <Link to="/"><h1 className="text-xl font-medium text-white">Roketo</h1></Link>
                </div>
                <Link to="" target="_blank">
                    <FiGithub className="text-white h-6 w-6" />
                </Link>
            </div>
        </nav>
    );
};
export default Navbar;