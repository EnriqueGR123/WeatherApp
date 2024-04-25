import { WiHumidity } from "react-icons/wi"
import { BsFillSunFill, BsCloudyFill, BsCloudFog2Fill, BsFillCloudRainFill } from "react-icons/bs"
import axios from "axios";
import { type ReactNode,  useEffect, useState } from "react";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { RiLoaderFill } from "react-icons/ri";

type dataWeatherProps={
    name:string;
    main:{
        temp:number,
        humidity:number
    },
    sys:{
        country:string
    },
    weather:{
        main:string
    }[];
    
}




export default function WeatherScreen() {

const apiKey = '0cc86d16bf572f78cdc96c096c7627e5';
const apiEndPoint = 'https://api.openweathermap.org/data/2.5/';
const [data, setData] = useState <dataWeatherProps | null>(null);
const [loading, setLoading]= useState(true);
const [search, setSearch]= useState<string>("");
const WeatherFetchData = async (lon:number, lat: number) =>{
    const url = `${apiEndPoint}weather?lat=${lat}&lon=${lon}&appid=${apiKey}&unit=metric`
    const response = await axios.get(url);
    return response.data;
}

useEffect (()=>{
    navigator.geolocation.getCurrentPosition((position) =>{
        const {latitude, longitude} = position.coords;
        Promise.all([WeatherFetchData(longitude, latitude)]).then(
            ([currentWeather]) =>{
                setData(currentWeather)
                console.log(currentWeather)
                setLoading(true);
            }
        )
    }) 
},[]);



const fetchDataSearch = async (city:string)=>{
    try{
        const url=`${apiEndPoint}weather?q=${city}&appid=${apiKey}&unit=metric`
        const response = await axios.get(url);
        const currentSearchResults:dataWeatherProps = response.data;
        return(currentSearchResults)
    }catch(error){
        console.error("Error");
        throw error;
    }
}

const handleClick = async()=>{
    if(search.trim()===""){
        return;
    }
    try{
        const  currentSearchResults  = await fetchDataSearch(search)
        setData(currentSearchResults)
    }
    catch(error){
        console.error("Error")
    }

}


function iconChange(weather:string){
    let iconElement: ReactNode;
    switch(weather){
        case 'Rain':
            iconElement=<BsFillCloudRainFill/>
        break;
        case 'Clear':
            iconElement=<BsFillSunFill/>
        break;
        case 'Clouds':
            iconElement=<BsCloudyFill/>
        break;
        case 'Mist':
            iconElement=<BsCloudFog2Fill/>
        break;
        default:
            iconElement=<TiWeatherPartlySunny/>
        break;
    }
    
    return(
        <span>
            {iconElement}
        </span>
    )
}


  return (
    <div className="container">

        <div className="container-xl pt-4  text-center text-light " id="container">
            <div className="row">

            <div className="col-md-12 d-flex ">
                <input type="text" className="form-control text-center " placeholder="Enter city" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                />
                <i id="search" className="bi  bi-search display-6 position-absolute text-black mx-3" onClick={handleClick}></i>
                <br /><br />
            </div>
            {data && loading? (
                <>
                <div className="weatherInfo">
                    <h1>{data.name}</h1>
                    <span>{data.sys.country}</span>
                    <div className="display-1">{iconChange(data.weather[0].main)}</div>
                    <h3>{data.main.temp.toFixed(0)}</h3>
                    <span>{data.weather[0].main}</span>
                </div>
           
                <div className="infoArea">
                    <WiHumidity className="display-1"/>
                    <div className="infoHumid">
                        <h4>{data.main.humidity}%</h4>
                        <p>humidity</p>
                    </div>
                </div>
                </>
               
            ):(
                <div className="col-md-12">
                    <RiLoaderFill>
                    <h1>
                        Loading... Wait a minute
                    </h1>
                    </RiLoaderFill>
                </div>
                
            )}
            </div>
         
        </div>
        </div>

  )
}
