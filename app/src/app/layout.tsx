import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata:Metadata={title:"Edusentiel | Learning Observatory",description:"Explore student learning patterns, search your cohort, and read the research paper.",robots:{index:false,follow:false}};
export default function Layout({children}:{children:ReactNode}){return <html lang="en"><body>{children}</body></html>;}

