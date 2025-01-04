"use client";

import Loader from "@/lib/Loader";
import { checkUserAuth, logoutUser } from "@/services/auth.service";
import userStore from "@/store/userStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from "./components/Header";



export default function AuthWrapper ({ children }) {
    const { setUser, clearUser } = userStore();
    const router = useRouter();
    const pathName = usePathname();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const isLoginPage = pathName === "/userLogin";

    useEffect(() => {
        
        const checkAuth = async () => {
            try {
                const result = await checkUserAuth();

                if (result.isAuthenticated) {
                    setUser(result.user);
                    setIsAuthenticated(true)
                }else {
                    await handleLogout();
                }

            } catch (error) {
                console.log("Authentication faild", error);
                await handleLogout();
                
            }finally{
                setLoading(false);
            }
        }

        const handleLogout = async () => {
            clearUser();
            setIsAuthenticated(false);

            try {
                await logoutUser()
            } catch (error) {
                console.log("logout faild please try again later", error);
                
            }

            if (!isLoginPage) {
                router.push("/userLogin")
            }

        };


        if (!isLoginPage) {
            checkAuth()
        }else {
            setLoading(false)
        }

    }, [isLoginPage, router, setUser, clearUser]);



    if (loading) {
        return <Loader />;
    }

    if (!isAuthenticated && !isLoginPage) {
        return <Loader />;
    }


    return (
        <>
            { !isLoginPage && isAuthenticated && <Header /> }
            { ( isAuthenticated || isLoginPage ) && children }
        </>
    )

    
};