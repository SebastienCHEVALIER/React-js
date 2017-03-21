/* ROOT Component of your App  */

import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import './index.css'

import defaultPicture from './components/img/default.jpg'

const Materialize = window.Materialize

const APP_TITLE = 'Awesome App'
//update document title (displayed in the opened browser tab)
document.title = APP_TITLE

//web api utils
import { get, ENDPOINTS } from './utils/api'

//components
import WeatherCard from './components/WeatherCard'


class App extends Component {

    /* React state initialization DOCUMENTATION : https://facebook.github.io/react/docs/react-without-es6.html#setting-the-initial-state */

    constructor( props ) {
        super( props )
        this.state = {
            weather: undefined,
            city: ''
        }
    }


    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1>{ APP_TITLE }</h1>
                    <img src={ logo } className="App-logo" alt="logo" />
                </div>

                <div className="App-content">
                    <div className="center-align">

                        <form onSubmit={ this.fetchWeather }>



                            <button type="submit" className="waves-effect waves-light btn">
                                Get Enlight
                            </button>

                        </form>

                    </div>
                    <center>
                    <div className='mdl-shadow--2dp'>
                        <div >
                            <p><b><div id="quote" ></div></b></p>
                        </div>
                        <div >
                            <div id="img" ></div>
                        </div>

                    </div>
                    </center>
                </div>

            </div>
        )
    }



    handleChange = ( event ) => {
        this.setState( {
            city: event.target.value
        } )
    }


    //method triggered by onSubmit event of the form or by onClick event of the "Weather?" button
    /* Arrow function syntax used for Autobinding, see details here : https://facebook.github.io/react/docs/react-without-es6.html#autobinding */
    fetchWeather = async ( event ) => {

        event.preventDefault()

        /* ASYNC - AWAIT DOCUMENTATION : https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Op%C3%A9rateurs/await */

        try {

            var request = require('request-promise');

            var options = {
              headers: {'X-Mashape-Key':'cgPedB2E1OmshCAeBlmOZpZmEZi8p1wZ9Zhjsn4tSnwJURy00F'},
              url: 'https://matchilling-tronald-dump-v1.p.mashape.com/random/quote',
              dataType:'json',
              type:'GET',
            };

            request.get(options).then(function(body){
            var json = JSON.parse(body);
            document.getElementById("quote").innerHTML ="<i>" +json.value+"</i>";
            })


            var options2 = {
              headers: {'Api-Key':'ckscdk5myhphnt37xsr7vz7p'},
              url: 'https://api.gettyimages.com/v3/search/images?phrase=trump',
              dataType:'json',
              type:'GET',
            };

            request.get(options2).then(function(body){
            var json2 = JSON.parse(body);
            var i = Math.floor(Math.random() * 30)
            document.getElementById("img").innerHTML = "<img src="+json2.images[i].display_sizes[0].uri+ " />";
            })







        }
        catch ( error ) {
            Materialize.toast( error, 8000, 'error-toast' )
            console.log( 'Failed fetching data: ', error )
        }

    }

    //will fetch a picture with the name of the city fetched by the weather API
    //will return an updated weather object (same object + one image)
    fetchPicture = async ( weather ) => {
        try {

            const pictures = await get( ENDPOINTS.PIXABAY_API_URL, {
                //YOU NEED TO PROVIDE YOUR "PIXABAY" API KEY HERE (see /utils/api.js file to grab the DOCUMENTATION link)
                key: '3658891-beeef4fdb6b8a762ab78e1cf9',
                q: weather.location.name + '+city',
                image_type: 'all',
                safesearch: true
            } )

            //if we have results
            if ( pictures.hits.length ) {
                //saving the first picture of the results in our weather object
                weather.pixabayPicture = pictures.hits[ 0 ].webformatURL
            }
            //else we save a defalut picture in our weather object
            else {
                weather.pixabayPicture = defaultPicture
            }

        }
        //same default picture is saved if the image request fails
        catch ( error ) {

            weather.pixabayPicture = defaultPicture

            Materialize.toast( error, 8000, 'error-toast' )
            console.log( 'Failed fetching picture: ', error )
        }

        return weather
    }


    //handle display of the received weather object
    displayWeatherInfo = () => {
        const weather = this.state.weather

        /*
            DATA FORMAT SENT BY THE API LOKKS LIKE THIS :

            {
                "pixabayPicture": string, //CUSTOM ADD VIA PIXABAY API CALL
                "location": {
                    "name": string,
                    "region": string,
                    "country": string,
                    "lat": number,
                    "lon": number,
                    "tz_id": string,
                    "localtime_epoch": number,
                    "localtime": string
                },
                "current": {
                    "temp_c": number,
                    "is_day": boolean,
                    "condition": {
                        "text": string,
                        "icon": string
                    },
                    "wind_kph": number
                }
            }

        */

        if ( weather ) {

            const locationName = weather.location.name
            const temperature = weather.current.temp_c
            const weatherConditionText = weather.current.condition.text
            const weatherConditionIcon = weather.current.condition.icon
            const windSpeed = weather.current.wind_kph
            const picture = weather.pixabayPicture

            return (
                <WeatherCard
                    locationName={ locationName }
                    temperature={ temperature }
                    weatherConditionText={ weatherConditionText }
                    weatherConditionIcon={ weatherConditionIcon }
                    windSpeed={ windSpeed }
                    picture={ picture } />
            )
        }

        return null
    }

}

export default App
