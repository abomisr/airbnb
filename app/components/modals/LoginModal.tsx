"use client";
import { signIn } from "next-auth/react"

import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import {
    FieldValues,
    SubmitHandler,
    useForm
} from "react-hook-form"

import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";

import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import { toast } from "react-hot-toast";
import Button from "../Button";
import { useRouter } from "next/navigation";

const LoginModal = () => {
    const router = useRouter();
    const loginModal = useLoginModal();
    const registerModal = useRegisterModal();
    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
        defaultValues: {
            email: '',
            password: ''
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true);

        signIn("credentials", {
            ...data,
            redirect: false
        }).then((callback) => {
            setIsLoading(false)

            if (callback?.error) {
                return toast.error(callback.error)
            }

            if (callback?.ok) {if (callback?.error) {
                toast.error(callback.error)
            }
                toast.success("Logged in successfully!")
                router.refresh();
                loginModal.onClose();
            }

        })

    }

    const bodyContent = (
        <div className="flex flex-col gap-4">
            <Heading title="Welcome back!"
                subtitle="Login to your account."
            />
            <Input
                id="email"
                label="Email"
                type="email"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />

            <Input
                id="password"
                label="Password"
                type="password"
                disabled={isLoading}
                register={register}
                errors={errors}
                required
            />
        </div>
    )

    const toggle = useCallback(() => {
        registerModal.onOpen()
        loginModal.onClose()
    }, [registerModal, loginModal])

    const footerContent = (
        <div className="flex flex-col gap-4 mt-3">
            <hr />
            <Button outline label="Continue with Google" icon={FcGoogle} onClick={() => signIn("google")} />
            <Button outline label="Continue with Github" icon={AiFillGithub} onClick={() => signIn("github")} />
            <div className="mt-4 font-light text-center text-neutral-500">
                <div className="justify-center flex items-center gap-2 flow-row">
                    <div>
                        New to Airbnb?
                    </div>
                    <div className="text-neutral-800 cursor-pointer hover:underline" onClick={toggle}>
                        Sign up
                    </div>
                </div>
            </div>
        </div>
    )
    return (
        <Modal
            body={bodyContent} disabled={isLoading} isOpen={loginModal.isOpen} title="Login" footer={footerContent} actionLabel="Continue" onClose={loginModal.onClose} onSubmit={handleSubmit(onSubmit)} />
    )
}

export default LoginModal