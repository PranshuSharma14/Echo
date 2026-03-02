"use client";

import {  useAtomValue, useSetAtom } from "jotai";
import { contactSessionIdAtomFamily, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";

import { WidgetHeader } from "../components/widget-header";
import { useEffect, useState } from "react";
import { LoaderIcon } from "lucide-react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";


type InitStep =  "org" | "session" | "c" | "settings" | "vapi" | "done";




export const WidgetLoadingScreen = ({organizationId}:{organizationId: string | null})=>{
    const [step, setStep] = useState<InitStep> ("org"); 
    
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setLoadingMessage = useSetAtom(loadingMessageAtom);
    const loadingMessage = useAtomValue(loadingMessageAtom);
    const [sessionValid, setSessionValid] = useState(false);
    const setScreen = useSetAtom(screenAtom);
    const setOrganizationId = useSetAtom(organizationIdAtom);
    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""));
    const validateOrganization = useAction(api.public.organizations.validate);


    //validate organization
    useEffect(() => {
     if(step != "org"){
        return;
     }

     setLoadingMessage("Finding Organization ID...");

     if(!organizationId){
        setErrorMessage("Organization Id is required");
        setScreen("error")
        return;
     }

     setLoadingMessage("Verifying Organization...");
     validateOrganization({organizationId})
     .then((result)=>{
        if(result.valid && organizationId){
            setOrganizationId(organizationId);
            setStep("session");
        }
        else{
            setErrorMessage(result.reason || "Invalid Configuration");
            setScreen("error");
        }
     })
     .catch(()=>{
        setErrorMessage("Unable to verify organization");
        setScreen("error");
     })
    }, [step,organizationId,setErrorMessage,setScreen,setOrganizationId,setStep,validateOrganization,setLoadingMessage])


    //validate session

    const validateContactSession = useMutation(api.contactSessions.validate);

    useEffect(() => {
        if(step!="session"){
            return;
        }

        setLoadingMessage("Finding contact session ID...")


        if(!contactSessionId){
            setSessionValid(false);
            setStep("done");
            return;
        }

        setLoadingMessage("Validating Session...")

        validateContactSession({contactSessionId})

        .then((result) =>{
            setSessionValid(result.valid)
            setStep("done");
        })

        .catch(()=>{
            setSessionValid(false);
            setStep("settings")
        })

    }, [step,contactSessionId,validateContactSession,setLoadingMessage])


    useEffect(() => {
        if(step!== "done"){
            return;
        }
        const hasValidSession = contactSessionId && sessionValid;
        setScreen(hasValidSession ? "selection" : "auth");

    }, [step,contactSessionId,sessionValid,setScreen])


    return(
        <>
            <WidgetHeader>
                <div className="flex flex-col gap-y-2 px-2 py-6 font-semibold">
                    <p className="text-3xl">Hi there!</p>
                    <p className="text-lg">Let&apos;s get you started</p>
                </div>
            </WidgetHeader>

            <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 text-muted-foreground">
                <LoaderIcon className="animate-spin"/>
                <p className="text-sm">
                    {loadingMessage || "Loading..."}
                </p>
            </div>
        
        </>
    )

}