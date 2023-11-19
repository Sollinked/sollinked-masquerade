'use client';
import { ChangeEvent, useCallback, useMemo, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { cloneObj } from '../../common/utils';
import { useSollinked } from '@sollinked/sdk';

const Page = () => {
    return (
        <div 
			className={`
				flex flex-col p-3
				dark:bg-slate-700 bg-white rounded
				dark:text-slate-300 text-black
				md:text-xs lg:text-base
				shadow
			`}
		>
        </div>
    );
}

export default Page;