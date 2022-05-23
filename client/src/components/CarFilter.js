import React, {useEffect} from 'react'
import {carData} from './mockCarData';

export const CarFilter = () => {
    useEffect(() => {
        fetch('http://127.0.0.1:8000/').then((response) => response.json()).then((data) => console.log(data))
    })
    return (
        <div id="outerFilterContainer">
        {carData.map((cars, i) => (
            <div id="filterContainer" key={i}>
                <img id='carImage' className='displayCar' src={cars.image} width='100%' />
                <span id="carName" className='displayName'>{cars.name} {cars.year}</span>
                <span id="carRating" className='displayRating'>{cars.rating}.0</span> 
                <span id="carTrips" className='displayTrips'>({cars.trips} Trips)</span>
                <span id="carSafety" className='displaySafety'>{cars.safetyCheck}</span>
                <span id="carDelivery" className='displayDelivery' >{cars.freeDelivery}</span>
            </div>
        ))}
        </div>
    )
}

