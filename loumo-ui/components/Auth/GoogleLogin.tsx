"use client"

import { useLocale } from "next-intl";
import { useEffect } from "react"

type GoogleLoginResponse = {
    credential: string;
    select_by?: string;
};

export default function GoogleLogin() {
    const locale = useLocale();

    useEffect(() => {
        // Initialise Google Sign-In
        window.google?.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: handleCredentialResponse,
        })
        console.log(locale);
        
        window.google?.accounts.id.renderButton(
            document.getElementById("google-button")!,
            {
                locale: locale,
                theme: "outline",
                size: "large",
                text: "continue_with",
            }
        ) 
    }, [locale])


    const handleCredentialResponse = async (response: GoogleLoginResponse) => {
        const token = response.credential

        // Décode le token JWT pour obtenir l'email
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(function (c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                })
                .join('')
        )
        const userData = JSON.parse(jsonPayload)
        console.log(userData);

    }

    return <div id="google-button"></div>
}
