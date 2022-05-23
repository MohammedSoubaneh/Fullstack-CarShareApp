import React from "react"
import { Button } from 'antd';
import { Link } from "react-router-dom";


export const Header = () => {
    
    return(
        <>
            <Link to="register">
                <Button role='button' type="primary">
                    Register
                </Button>
            </Link>
            <Link to="/login">    
                <Button role='button' type="primary" >
                        Login
                </Button>
            </Link>
        </>
    )
}
