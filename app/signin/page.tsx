"use client"

import { Suspense} from "react"
import SignInPage from "../_components/SignInPage/signpage"



export default function SignIn() {

    return (
        <Suspense>
            <SignInPage/>
        </Suspense>
    )
}

