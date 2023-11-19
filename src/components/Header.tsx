'use client';
import { VERIFY_MESSAGE } from '@/common/constants';
import { BarsOutlined } from '@ant-design/icons';
import { useWallet } from '@solana/wallet-adapter-react';
import { useSollinked } from '@sollinked/sdk';
import BigNumber from 'bignumber.js';
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { Connection, PublicKey } from '@solana/web3.js';
import { getMd5, getRPCEndpoint } from '@/common/utils';
import Image from 'next/image';
import logo from '../../public/logo.png';

type HeaderParams = {
    onMenuClick: () => void;
    onHeaderVisibilityChange: (isHidden: boolean) => void;
}

const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { ssr: false }
);

const hideInPaths = [
    '/settings',
];

const hidePathPattern = [
    /\/.*\/content/g,
];

const Header = ({onMenuClick, onHeaderVisibilityChange}: HeaderParams) => {
    const wallet = useWallet();
    const { user, init, account, calendar, mail } = useSollinked();
    const [isUpdatingTags, setIsUpdatingTags] = useState(false);
    const pathname = usePathname();
    const shouldHide = useMemo(() => {
        if(hideInPaths.includes(pathname)) {
            return true;
        }

        for(const [key, value] of hidePathPattern.entries()) {
            if(pathname.search(value) !== -1) {
                return true;
            }
        }
        return false;
    }, [ pathname ]);

    const connection = useMemo(() => {
      return new Connection(getRPCEndpoint());
    }, []);

    useEffect(() => {
        onHeaderVisibilityChange(shouldHide && user.id > 0);
    }, [shouldHide, user, onHeaderVisibilityChange]);

    useEffect(() => {
        if(!wallet) {
            return;
        }

        if(!wallet.signMessage) {
            console.error('Verification error: no sign message function');
            return;
        }

        if(user && user.id != 0) {
            return;
        }

        if(!init) {
            return;
        }

        const askForSignature = async() => {
            let res = await init();
            // has initialized
            if(res) {
                return;
            }

            if(!wallet.signMessage) {
                console.error('Verification error: no sign message function');
                return;
            }

            // ask for signature
            const toSign = VERIFY_MESSAGE;
            let signature = "";

            // For historical reasons, you must submit the message to sign in hex-encoded UTF-8.
            // This uses a Node.js-style buffer shim in the browser.
            const msg = Buffer.from(toSign);
            let signed = await wallet.signMessage(msg);
            signature = Buffer.from(signed).toString("base64");
            init(signature);
        }

        askForSignature();
    }, [user, init, wallet]);

	// user tags
	const onRefreshUserTag = useCallback(async() => {
        if(!account) {
            return;
        }

		if(!user.address) {
            toast.error('Please connect your wallet');
            return;
		}

		try {        
            await account.me();

			setTimeout(() => {
				toast.success("Refreshed");
				// getData();
				setIsUpdatingTags(false);
			}, 300);
		}

        catch(e: any) {
            setTimeout(() => {
                toast.error("Error saving data");
                setIsUpdatingTags(false);
            }, 300);
            return;
        }
	}, [ account, user ]);

    return (
      <div className={`
        ${shouldHide && user.id > 0? 'hidden' : ''}
        ${user.address? 'justify-between' : 'justify-end' }
        flex flex-row px-5 items-center 
        h-[60px]
        fixed top-2 ${shouldHide? '' : 'left-0 '} md:right-3 right-1
        z-[11]
      `}>
        {
            user.address &&
            <div className="flex flex-row items-center">
                <Image
                    src={user.profile_picture? user.profile_picture : logo}
                    alt="null"
                    width={30}
                    height={30}
                    className={`
                        h-10 w-10 rounded-full dark:border-none border-2 border-black bg-slate-700
                    `}
                />
                <div className='ml-3 mr-3'>{user.display_name ?? `${user.username}@sollinked.com`}</div>
                <button
                    className={`
                        mr-3 my-auto border-[1px]
                        h-7 w-7 text-[20px]
                        rounded
                        flex items-center justify-center
                        dark:text-white text-white bg-green-500
                        border-none
                    `}
                    onClick={onRefreshUserTag}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                        className={`w-4 h-4 ${isUpdatingTags? 'animate-spin' : ''}`}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </button>
                <a
                    className={`
                        mr-3 my-auto border-[1px]
                        px-3 h-7
                        text-[20px]
                        rounded
                        flex items-center justify-center
                        dark:text-white text-white bg-green-500 text-xs
                        border-none
                    `}
                    href="https://app.sollinked.com/settings"
                    target="_blank"
                    rel="noopener noreferer"
                >
                    Edit Profile
                </a>
            </div>
        }
        <div className='dark:bg-slate-700 rounded border-slate-500 border-[1px] shadow'>
            <WalletMultiButtonDynamic />
        </div>
      </div>
    )
}

export default Header;