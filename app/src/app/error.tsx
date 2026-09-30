"use client";
export default function ErrorPage({reset}:{reset:()=>void}){return <main className="min-h-screen bg-paper p-8 text-forest"><h1>We could not open the workspace.</h1><button onClick={reset}>Try again</button></main>;}

