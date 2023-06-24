import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";
import { baseURL } from "../utils/Config";

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
        try {
            await axios.post(`${baseURL}/collection`, {
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

    const onSubmit = (e) => {
        e.preventDefault();
        createCollection();
    };

    return (
        <div className="bg-neutral-900 h-full">
            <div className="w-full max-w-[1100px] mx-auto h-screen flex items-center justify-center text-white">
                <nav className="w-full max-w-4xl h-24 flex items-center justify-between fixed top-0 z-50">
                    <h1 className="text-2xl  font-medium">Roketo</h1>
                </nav>
                <div className="flex flex-col items-center gap-8 my-20 justify-center z-40">
                    <h1 className="text-center font-bold text-[6rem] leading-[88px] text-gray-300">
                        Mock APIs <br /> Ship on time
                    </h1>
                    <h2 className="text-gray-400 text-lg">Create an collection and configure endpoint in no time</h2>
                    <form className="flex items-center border rounded" onSubmit={onSubmit}>
                        <input className="w-64 px-4 py-2 rounded-md bg-transparent focus:outline-none" required type="text" minLength={5} maxLength={30} placeholder="Your collection name" onChange={(e) => setCollectionId(e.target.value)} />
                        <button type="submit" className="px-4 py-2 bg-white text-black whitespace-nowrap flex items-center gap-2" disabled={isCreateLoading}>
                            {isCreateLoading && <Spinner className="w-5 h-5" />} Get started
                        </button>
                    </form>
                    {collections.length > 0 && <div className="flex flex-col items-center gap-3">
                        <p className="text-gray-400">Your collections</p>
                        <div className="flex items-center gap-2">
                            {collections.map((collectionSlug) => <div className="px-4 py-2 rounded-full border border-neutral-400 text-neutral-400 hover:border-white hover:bg-white hover:text-black transition-colors duration-150 cursor-pointer" onClick={() => openCollection(collectionSlug)}>{collectionSlug}</div>)}
                        </div>
                    </div>}
                </div>
            </div>
        </div>
    );
};
export default Home;