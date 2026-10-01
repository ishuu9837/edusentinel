import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "@fontsource/newsreader/400.css";
import "@fontsource/newsreader/400-italic.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata:Metadata={title:"Edusentiel | Learning Observatory",description:"Explore student learning patterns, search your cohort, and read the research paper.",robots:{index:false,follow:false}};
export default function Layout({children}:{children:ReactNode}){return <html lang="en"><body>{children}</body></html>;}

