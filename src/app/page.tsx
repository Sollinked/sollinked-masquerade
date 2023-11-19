'use client';
import { useSollinked } from '@sollinked/sdk';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { ellipsizeThis } from '@/common/utils';
import logo from '../../public/logo.png';

const Page = () => {

	return (
		<div className={'min-h-[80vh] px-2 pb-10 flex flex-col align-center justify-center vw-100 text-center'}>
        <h1 className='text-4xl'>Welcome to Masquerade by Sollinked!</h1>
        <div
          className='mt-5'
        >
          <Link
            href={"/general"}
            className='rounded bg-green-400 dark:bg-green-600 px-3 py-2'
          >
            Click here to go to the General Chat
          </Link>
        </div>
    </div>
	);
};

export default Page;
