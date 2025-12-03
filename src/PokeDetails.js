import { useEffect, useState } from "react"
import axios from "axios"
import { ChevronLeft, AlertCircle } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"
import { TypeBadge } from "./utils"
import StatBar from "./StatBar"

const PokeDetails = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [poke, setPoke] = useState({})
    const [imageLoaded, setImageLoaded] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        params.id && getDetails(params.id)
    }, [params.id])


    const getDetails = (id) => {
        setIsLoading(true)
        setIsError(false)
        axios.all(
            [axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
                .then(res => {
                    const { id, name, types, sprites, height, weight, base_experience, abilities, stats } = res.data
                    const image = sprites?.other?.["official-artwork"]?.front_default;
                    setPoke(prev => ({ ...prev, id, name, height, weight, abilities, stats, baseExperience: base_experience, types: types.map(type => type.type.name), image }))
                }
                ).catch(err => {
                    setIsError(true)
                    console.err(err)
                }),
            axios.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
                .then(res => {
                    const { flavor_text_entries, capture_rate } = res.data
                    const flavorText = flavor_text_entries.find(entry => entry.language.name === 'en')?.flavor_text.replace(/\f/g, ' ') || 'No description available.';
                    setPoke(prev => ({ ...prev, flavorText, captureRate: capture_rate }))

                }).catch(err => {
                    setIsError(true)
                    console.err(err)
                })]
        )
            .finally(() => setIsLoading(false))
    }

    return (

        <div className="min-h-screen bg-gray-50 p-8" >
            <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition mb-6"
            >
                <ChevronLeft className="w-5 h-5" />
                <span className="font-medium">Back to Table</span>
            </button>
            {isError ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <AlertCircle className="w-12 h-12 text-red-600 mb-4" />
                    <div className="text-red-600 text-xl font-semibold mb-2">
                        Fail to load details
                    </div>
                    <button
                        onClick={() => getDetails(params.id)}
                        className="px-5 py-2 bg-blue-400 text-white rounded-lg shadow hover:bg-blue-300 transition-colors"
                    >
                        Retry
                    </button>
                </div>)
                : isLoading ? (
                    <div className="flex justify-center items-center py-10">
                        <div className="w-8 h-8 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin"></div>
                    </div>
                ) :
                    (<div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="p-6 bg-gradient-to-r from-blue-400 to-purple-300">
                            <div className="flex items-center gap-6">
                                <img
                                    onLoad={() => setImageLoaded(true)}
                                    src={imageLoaded ? poke.image : "https://pngimg.com/uploads/pokeball/pokeball_PNG21.png"}
                                    alt={poke.name}
                                    className="w-48 h-48 object-contain bg-white/20 rounded-lg p-4"
                                />

                                <div className="flex flex-col gap-2">
                                    <h1 className="text-3xl font-bold capitalize text-slate-800">
                                        {poke.name}
                                    </h1>

                                    <span className="text-slate-800 font-mono">
                                        #{String(poke.id).padStart(3, "0")}
                                    </span>

                                    <div className="flex gap-2 flex-wrap">
                                        {poke.types?.map((type) => (
                                            <TypeBadge key={type} type={type} />
                                        ))}
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="p-8 space-y-8">
                            <div>
                                <h2 className="text-2xl font-bold mb-3 text-gray-800">Description</h2>
                                <p className="text-gray-600 leading-relaxed">{poke.flavorText}</p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Height</p>
                                    <p className="text-2xl font-bold text-gray-800">{(poke.height / 10).toFixed(1)}m</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Weight</p>
                                    <p className="text-2xl font-bold text-gray-800">{(poke.weight / 10).toFixed(1)}kg</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Base Experience</p>
                                    <p className="text-2xl font-bold text-gray-800">{poke.baseExperience}</p>
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="text-sm text-gray-500 mb-1">Capture Rate</p>
                                    <p className="text-2xl font-bold text-gray-800">{poke.captureRate}</p>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-gray-800">Abilities</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {poke.abilities?.map((ability) => (
                                        <div key={ability.ability.name} className="bg-blue-50 p-4 rounded-lg">
                                            <p className="font-semibold capitalize text-gray-800">
                                                {ability.ability.name.replace('-', ' ')}
                                                {ability.is_hidden && (
                                                    <span className="ml-2 text-xs bg-purple-500 text-white px-2 py-1 rounded">Hidden</span>
                                                )}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold mb-4 text-gray-800">Base Stats</h2>
                                <div className="space-y-3">
                                    {poke.stats?.map((stat) => (
                                        <StatBar
                                            key={stat.stat.name}
                                            name={stat.stat.name.replace('-', ' ')}
                                            value={stat.base_stat}
                                        />
                                    ))}
                                </div>
                                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-semibold">Total:</span>{' '}
                                        {poke.stats?.reduce((sum, stat) => sum + stat.base_stat, 0)}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>)}
        </div>
    )
}

export default PokeDetails