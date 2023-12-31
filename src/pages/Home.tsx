import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { baseURL, githubURL } from "../utils/Config";
import Logo from "../assets/logo.svg";
import { FiGithub } from "react-icons/fi";
import GlowImage from "../assets/glow.svg";

const Home = () => {

    const navigate = useNavigate();

    const [collectionId, setCollectionId] = useState("");
    const [collections, setCollections] = useState([]);
    const [isCreateLoading, setCreateLoading] = useState(false);

    useEffect(() => {
        const storedCollectionSlugs = localStorage.getItem('collectionSlugs');
        storedCollectionSlugs && setCollections(JSON.parse(storedCollectionSlugs));
    }, []);

    const createCollection = async () => {
        setCreateLoading(true);
        if (collections.length > 0) {
            const collectionExists = collections.findIndex((collectionSlug) => collectionSlug === collectionId);
            if (collectionExists !== -1) {
                return navigate(`/collections/${collectionId}`);
            }
        }
        try {
            await axios.post(`${baseURL}/collections`, {
                collectionId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            setCreateLoading(false);
            localStorage.setItem('collectionSlugs', JSON.stringify([...collections, collectionId]));
            navigate(`/collections/${collectionId}`);
        } catch (error) {
            console.log(error);
        }
    };

    const openCollection = (slug: string) => {
        navigate(`/collections/${slug}`);
    };

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createCollection();
    };

    return (
        <div className="bg-neutral-950 h-full">
            <div className="w-full max-w-4xl mx-auto h-screen flex flex-col items-center justify-center text-white relative">
                <img src={GlowImage} className="absolute top-0 w-full h-full" />
                <nav className="w-full max-w-4xl h-20 flex items-center justify-between fixed top-0 z-50">
                    <div className="flex items-center gap-1 text-gray-400">
                        <img src={Logo} alt="logo" className="w-5 h-5" />
                        <h1 className="text-lg font-medium">Roketo</h1>
                    </div>
                </nav>
                <div className="flex flex-col items-center gap-8 my-20 justify-center z-40">
                    <h1 className="text-center font-bold text-[6rem] leading-[88px] text-gray-300">
                        Mock APIs <br /> Ship on time
                    </h1>
                    <h2 className="text-gray-400 text-lg">Create an collection and configure endpoint in no time</h2>
                    <form className="flex items-center border rounded" onSubmit={onSubmit}>
                        <input className="w-64 px-4 py-2 rounded-md bg-transparent focus:outline-none" pattern="[a-zA-Z0-9]+" title="Only alphabets and numbers are allowed" required type="text" minLength={5} maxLength={30} placeholder="Your collection name" onChange={(e) => setCollectionId(e.target.value)} />
                        <button type="submit" className="px-4 py-2 bg-white text-black whitespace-nowrap flex items-center gap-2" disabled={isCreateLoading}>
                            {isCreateLoading && <Spinner className="w-5 h-5" />} Get started
                        </button>
                    </form>
                    {collections.length > 0 && <div className="flex flex-col items-center gap-3">
                        <p className="text-gray-400">Your previous collections</p>
                        <div className="flex items-center flex-wrap justify-center gap-3">
                            {collections.map((collectionSlug) => <div className="px-4 py-2 rounded-full border border-neutral-400 text-neutral-400 hover:border-white hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer" onClick={() => openCollection(collectionSlug)}>{collectionSlug}</div>)}
                        </div>
                    </div>}
                </div>
                <footer className="flex items-center justify-between fixed bottom-0 h-14 w-full max-w-4xl mx-auto">
                    <p className="text-xs text-gray-500">© {new Date().getFullYear()} All rights reserved.</p>
                    <Link to={githubURL} target="_blank" className="text-gray-400 hover:text-white duration-150 transition-colors">
                        <FiGithub className="" />
                    </Link>
                </footer>
            </div>
        </div>
    );
};
export default Home;