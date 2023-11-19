'use client';
import { ChangeEvent, useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { cloneObj } from '../../common/utils';
import { useSollinked } from '@sollinked/sdk';
import useAutosizeTextArea from '@/hooks/useAutosizeTextArea';
import { HomepageUser } from 'sdk/dist/src/Account/types';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import moment from 'moment';

type Message = { 
    message: string; 
    address: string;
    block_timestamp: number;
};

const Page = () => {
    const { user, account } = useSollinked();
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [users, setUsers] = useState<{ [address: string]: HomepageUser }>({});
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const prevMessageLength = useRef(0);
  
    useAutosizeTextArea(textAreaRef.current, text);

    const ChatMessage = useCallback(({ message: {message, address, block_timestamp}, previousAddress }: { message: Message, previousAddress: string }) => {
        const user = users?.[address] ?? null;
        let displayName = address;
        if(user) {
            displayName = user.display_name ?? `${user.username}@sollinked.com`;
        }

        let chatDate = moment(block_timestamp);
        let displayDate = "";
        let todayStart = moment().startOf('D');
        let chatStartDate = moment(block_timestamp).startOf('D');
        if(chatStartDate.isSame(todayStart)) {
            displayDate = "Today at" + chatDate.format(' hh:mm A');
        }

        else {
            displayDate = chatDate.format('YYYY-MM-DD hh:mm A');
        }

        let shouldDisplayDetails = previousAddress !== address;

        return (
            <div className='flex flex-row'>
                {
                    shouldDisplayDetails?
                    <div className='mr-3'>
                        <Image
                            src={user?.profile_picture? user.profile_picture : logo}
                            alt="null"
                            width={30}
                            height={30}
                            className={`
                                h-10 w-10 rounded-full dark:border-none border-2 border-black bg-slate-700
                            `}
                        />
                    </div> :
                    <div className='mr-3'>
                        <div className='w-10'></div>
                    </div>
                }
                <div>
                    {
                        shouldDisplayDetails &&
                        <>
                            <div className="flex flex-row items-end">
                                <span className='text-sm text-white'>{displayName}</span>
                                <span className='ml-3 text-xs'>{displayDate}</span>
                            </div>
                            {
                                user?.tags?
                                <div className="mt-1 mb-2">
                                {
                                    user?.tags?.map((tag, index) => (
                                        <div className={`
                                            w-[100px] 
                                            flex items-center justify-center
                                            px-1 py-1 
                                            dark:bg-yellow-600 bg-yellow-400 
                                            rounded 
                                            text-xs dark:text-white text-black
                                            `} key={`tag-${index}`}>
                                            {tag.name}
                                        </div>
                                    ))
                                }
                                </div>
                                : <></>
                            }
                        </>
                    }
                    <span className='text-white'>{message}</span>
                </div>
            </div>
        );
    }, [ users ]);

    useEffect(() => {
        setTimeout(() => {
            setMessages([
                {
                    block_timestamp: 1700374614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700374615000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700375614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700376614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700374614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700374615000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700375614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700376614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700374614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700374615000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700375614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700376614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700374614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700374615000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700375614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700376614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700374614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700374615000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700375614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700376614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700374614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700374615000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700375614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700376614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700374614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700374615000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700375614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
                {
                    block_timestamp: 1700376614000,
                    message: 'hihi',
                    address: 'BFVoLdTw1hd6Ly9KTAPWYie9NeFcbce5evKFRQqpgxvm',
                },
        ]);
        }, 5000);
    }, []);

    useEffect(() => {
        if(!account) {
            return;
        }

        if(messages.length === prevMessageLength.current) {
            return;
        } 

        prevMessageLength.current = messages.length;

        const getUserData = async() => {
            let addresses = messages.map(x => x.address);
            let knownAddresses = Object.keys(users);
            let queriedAddresses: string[] = [];
            let unknownAddresses = addresses.filter(x => !knownAddresses.includes(x));
            let newUsers = cloneObj(users);
            unknownAddresses.forEach(async address => {
                if(queriedAddresses.includes(address)) {
                    return;
                }
                queriedAddresses.push(address);
                let user = await account.searchAddress(address);
                if(typeof user === "string") {
                    return;
                }
                newUsers[address] = user;
                queriedAddresses.push(address);
                setUsers(newUsers);
            });
        }

        getUserData();
    }, [ messages, users, account ]);

    return (
        <div 
			className={`
				flex flex-col p-3
				dark:bg-slate-700 bg-white rounded
				dark:text-slate-300 text-black
				md:text-xs lg:text-base
                h-[85vh]
			`}
		>
            <div className='h-full overflow-y-auto'>
                {
                    messages.map((x, index) => (
                        <ChatMessage
                            key={`message-${index}`}
                            message={x}
                            previousAddress={index === 0? "" : messages[index - 1].address}
                        />
                    ))
                }
            </div>
            <div className='flex flex-col items-end relative'>
                <textarea
                    ref={textAreaRef}
                    placeholder={'Enter Message'}
                    value={text} 
                    onChange={({target}) => setText(target.value)}
                    className={`
                        w-full min-h-[60px]
                        text-xs dark:text-white text-black dark:bg-slate-800 dark:border-none border-[1px] border-slate-200
                        pl-3 py-3
                        focus:outline-none
                    `}
                />
                <div className='md:absolute md:right-1 md:bottom-1 md:w-[unset] w-full md:mt-0 mt-3'>
                    <button
                        className={`
                            border-[1px] mt-3
                            text-[20px] px-3 py-1 md:w-[unset] w-full
                            rounded
                            flex items-center justify-center justify-self-end
                            dark:text-white text-white text-xs
                            disabled:cursor-not-allowed
                            ${user.address? 'bg-green-500' : 'bg-green-800'}
                            border-none
                        `}
                        disabled={!user.address}
                    >
                        { user.address? 'Send' : 'Login To Send' }
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Page;