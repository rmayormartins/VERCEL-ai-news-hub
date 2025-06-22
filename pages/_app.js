import '../styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>AI News Hub - Your Real-time AI News Source</title>
        <meta name="description" content="Stay updated with the latest AI news from multiple sources. Real-time artificial intelligence news aggregator with advanced filtering and analytics." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="AI news, artificial intelligence, machine learning, technology news, AI updates" />
        <meta name="author" content="Ramon Mayor Martins" />
        <meta property="og:title" content="AI News Hub - Your Real-time AI News Source" />
        <meta property="og:description" content="Stay updated with the latest AI news from multiple sources" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/ai-news-hub-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AI News Hub" />
        <meta name="twitter:description" content="Your real-time AI news source" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}
