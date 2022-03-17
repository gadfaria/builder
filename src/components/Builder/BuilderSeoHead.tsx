import React from "react";
import Head from "next/head";

interface SeoHead {
  pageName: string;
  pageDescription?: string;
}

export default function SeoHead({ pageName, pageDescription }: SeoHead) {
  return (
    <Head>
      <title>{pageName}</title>
      <meta property="og:title" content={`${pageName}`} />
      <meta
        name="description"
        content={pageDescription ? pageDescription : "Description."}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  );
}
