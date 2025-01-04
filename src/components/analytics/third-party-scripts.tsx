"use client";

import Script from "next/script";

export function ThirdPartyScripts() {
  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-M08NN7869T" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-M08NN7869T');
        `}
      </Script>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6572203520543320"
        crossOrigin="anonymous"
      />
    </>
  );
}
