import Layout from '@/components/Layout';
import React from 'react';
import './globals.css'
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL("https://sollinked.com"),
  title: 'Masquerade | Chat for anons',
  description: 'Chat anonymously while revealing your holdings using zk proofs.',
  keywords: "sollinked, solana, solana social media, solana chat",
  openGraph: {
    title: "Masquerade",
    description: "Chat for anons.",
    images: [
        {
          url: '/logo.png',
          width: 512,
          height: 512,
          alt: 'Sollinked Logo',
          type: 'image/jpeg',
        },
    ],
    siteName: "Masquerade | Chat for anons",
    url: "https://masquerade.sollinked.com",
    type: "website",
  },
  twitter: {
    site: '@Sollinked_com',
    title: "Masquerade | Chat for anons",
    creator: "@darksoulsfanlol",
    description: "Earning from contents have never been easier.",
    images: [
      {
        url: '/logo.png',
        width: 512,
        height: 512,
        alt: 'Sollinked Logo',
        type: 'image/jpeg',
      },
    ],
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className='dark'>
      <Head>
        <link
          rel="canonical"
          href="https://masquerade.sollinked.com"
          key="canonical"
        />
      </Head>
      <body className={`
        ${inter.className} 
        flex flex-row dark:bg-black dark:text-white bg-white text-black
      `}>
          <Layout>
            {children}

            <ToastContainer
              position="bottom-left"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover={false}
              theme={'colored'}
            />
          </Layout>
      </body>
    </html>
  )
}
