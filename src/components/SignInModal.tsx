import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { FaDiscord, FaGoogle } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export const SignInModal = ({
    isOpen,
    onCloseHandler,
    error,
}: {
    isOpen: boolean;
    onCloseHandler: () => void;
    error: string | string[] | undefined;
}) => {
    const router = useRouter();
    const buttons = [
        {
            text: "Sign in with Google",
            background: "#ea4335",
            icon: <FaGoogle size={24} />,
            onClickHandler: () => {
                router.push("/", undefined, { shallow: true });
                signIn("google");
            },
        },
        {
            text: <span className="">{"Sign in with Discord"}</span>,
            background: "#5865F2",
            icon: <FaDiscord size={24} />,
            onClickHandler: () => {
                router.push("/", undefined, { shallow: true });
                signIn("discord");
            },
        },
    ];
    return (
        <Transition
            show={isOpen}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
            as={Fragment}
        >
            <Dialog
                onClose={onCloseHandler}
                className="relative z-50"
            >
                {/*BACKDROP*/}
                <div
                    className="fixed inset-0 bg-black/30 backdrop-blur-sm"
                    aria-hidden="true"
                />
                {/*BACKDROP END*/}

                <div className="fixed inset-0 flex flex-col items-center justify-center p-4">
                    {error && (
                        <div className="w-80 rounded border p-6 text-center font-bold leading-6 dark:border-ecored-600 dark:bg-ecored-600/60">
                            {makeErrorMessage(error)}
                        </div>
                    )}
                    <Dialog.Panel className="flex w-80 flex-col items-center justify-center rounded p-10 dark:bg-primarydark-200">
                        {buttons.map((button, index) => (
                            <SignInButton
                                key={index}
                                text={button.text}
                                background={button.background}
                                icon={button.icon}
                                onClickHandler={button.onClickHandler}
                            />
                        ))}
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
};
const makeErrorMessage = (error: string | string[] | undefined) => {
    if (Array.isArray(error)) {
        return error.join(" ");
    }

    switch (error) {
        case "OAuthAccountNotLinked":
            return (
                <div className="flex flex-col">
                    {"Your email is associated with a different method"}
                    <span className="mt-4 font-thin">{"Please log-in using the original method."}</span>
                </div>
            );
        default:
            return (
                <div className="flex flex-col">
                    {"Error while trying to sign in"}
                    <span className="mt-4 font-thin">{"Please try a different method."}</span>
                </div>
            );
    }
};

const SignInButton = ({
    text,
    background,
    icon,
    onClickHandler,
}: {
    text: any;
    background: string;
    icon: JSX.Element;
    onClickHandler: () => void;
}) => {
    return (
        <button
            className={`m-1 flex w-56 flex-row items-center justify-center rounded p-2 font-normal dark:text-primary-100`}
            style={{ background: background }}
            onClick={onClickHandler}
        >
            <div className="mr-4">{icon}</div>
            {text}
        </button>
    );
};
