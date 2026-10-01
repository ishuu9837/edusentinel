'use client';
export default function Error({reset}: {reset:()=>void}) { return <main className="loading-screen"><h1>Let’s try that again.</h1><p>The workspace could not load.</p><button className="button primary" onClick={reset}>Reopen workspace</button></main>; }
