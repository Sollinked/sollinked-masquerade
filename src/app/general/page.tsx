'use client';
import { ChangeEvent, useCallback, useMemo, useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { cloneObj, getGeneralPubKey, getRPCEndpoint, getTransactions, getTx, sendSOLWithMemo } from '../../common/utils';
import { useSollinked } from '@sollinked/sdk';
import useAutosizeTextArea from '@/hooks/useAutosizeTextArea';
import { HomepageUser } from './types';
import Image from 'next/image';
import logo from '../../../public/logo.png';
import moment from 'moment';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, ParsedInstruction, PublicKey } from '@solana/web3.js';

type Message = { 
    message: string; 
    address: string;
    block_timestamp: number;
};

const Page = () => {
    const { user, account } = useSollinked();
    const wallet = useWallet();
    const [text, setText] = useState("");
    const [users, setUsers] = useState<{ [address: string]: HomepageUser }>({});
    const [addresses, setAddresses] = useState<string[]>([]);
    const [toggler, setToggler] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const prevMessageLength = useRef(0);
    const messages = useRef<Message[]>([]);
    const txIds = useRef<string[]>([]);
    const hasInterval = useRef<boolean>(false);
    const connection = useMemo(() => {
        // load the env variables and store the cluster RPC url
        const CLUSTER_URL = getRPCEndpoint();

        // create a new rpc connection, using the ReadApi wrapper
        return new Connection(CLUSTER_URL, "confirmed");
    }, []);
  
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
            <div className={`flex flex-row ${shouldDisplayDetails? 'mt-5' : ''}`}>
                {
                    shouldDisplayDetails?
                    <a href={user? `https://app.sollinked.com/${user.username}` : "#"} target='_blank' rel="noopener noreferer">
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
                        </div>
                    </a> :
                    <div className='mr-3'>
                        <div className='w-10'></div>
                    </div>
                }
                <div>
                    {
                        shouldDisplayDetails &&
                        <>
                            {
                                user?
                                <a href={`https://app.sollinked.com/${user.username}`} target='_blank' rel="noopener noreferer" className="flex flex-row items-end">
                                    <span className='text-sm text-white'>{displayName}</span>
                                    <span className='ml-3 text-xs'>{displayDate}</span>
                                </a> :
                                <div className="flex flex-row items-end">
                                    <span className='text-sm text-white'>{displayName}</span>
                                    <span className='ml-3 text-xs'>{displayDate}</span>
                                </div> 
                            }
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

    const getData = useCallback(async() => {
        let newMessages = cloneObj(messages.current);
        let newTxIds = cloneObj(txIds.current);
        let transactionList = await getTransactions(getGeneralPubKey(), 100);

        let signatures = transactionList.reverse().map(x => x.signature);
        let newSignatures = signatures.filter(x => !newTxIds.includes(x));
        if(newSignatures.length === 0) {
            return;
        }

        txIds.current = [...txIds.current, ...newSignatures];
        let txs = await connection.getParsedTransactions(newSignatures, "confirmed");
        let newAddresses: string[] = addresses;
        
        txs.forEach(async(tx, i) => {
            if(!tx || !tx.blockTime) {
                return;
            }

            // only 2 transactions
            let address = "";
            let memo = "";

            switch(tx.transaction.message.instructions.length) {
                case 2:
                    address = (tx.transaction.message.instructions[0] as ParsedInstruction).parsed.info.source;
                    memo = (tx.transaction.message.instructions[1] as ParsedInstruction).parsed;
                    break;
                case 4:
                    address = (tx.transaction.message.instructions[2] as ParsedInstruction).parsed.info.source;
                    memo = (tx.transaction.message.instructions[3] as ParsedInstruction).parsed;
                    break;
                default:
                    break;
            }

            if(!memo) {
                return;
            }

            newMessages.push({
                block_timestamp: tx.blockTime * 1000,
                message: memo,
                address
            });

            messages.current = newMessages;
            setToggler(!toggler);
            if(!newAddresses.includes(address)) {
                newAddresses.push(address);
                setAddresses(cloneObj(newAddresses));
            }
        });
    }, [ connection, toggler, addresses ])

    const sendMessage = useCallback(async() => {
        let sendText = text.trim();
        if(!sendText) {
            return;
        }

        if(!wallet || !wallet.publicKey) {
            toast.error("Unable to get wallet");
            return;
        }

        try {
            await sendSOLWithMemo(wallet, wallet.publicKey, new PublicKey(getGeneralPubKey()), sendText);
            setText("");
            getData();
            toast.success('Message sent');
        }

        catch {
            toast.error("Unable to send message, please try again");
            return;
        }
    }, [ wallet, text, getData ]);

    useEffect(() => {
        if(hasInterval.current) {
            return;
        }

        hasInterval.current = true;

        setInterval(() => {
            getData();
        }, 1000);
    }, [ getData ]);

    useEffect(() => {

        if(!account) {
            return;
        }

        const getUserData = async() => {
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
                setUsers(cloneObj(newUsers));
            });
        }

        getUserData();
    }, [ addresses, users, account ]);

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
                    messages.current.map((x, index) => (
                        <ChatMessage
                            key={`message-${index}`}
                            message={x}
                            previousAddress={index === 0? "" : messages.current[index - 1].address}
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
                        onClick={sendMessage}
                    >
                        { user.address? 'Send' : 'Login To Send' }
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Page;