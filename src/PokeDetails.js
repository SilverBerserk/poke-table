import { useEffect,useState } from "react"
import axios from "axios"
import {useParams} from "react-router-dom"

const PokeDetails = () => {
    const params = useParams()
    const [poke,setPoke] = useState({})

    useEffect(() => {
       if(params.id) {

        axios.get(`https://pokeapi.co/api/v2/pokemon/${params.id}`)
        .then(res => console.log(res))
       }
    },[params.id])

    return (
        <div>details here {params.id}</div>
    )
}

export default PokeDetails