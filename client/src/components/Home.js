import React from 'react'
import { InputInfo } from './InputInfo'
import { CarFilter } from './CarFilter'
import { Header } from './Header'

export const Home = () => {
    return (
        <>
        <Header />
        <div id="Home">
            <InputInfo />
            <CarFilter />
        </div>
        </>
    )
}