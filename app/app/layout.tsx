import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
export const metadata:Metadata={title:"Edusentiel | Learning Observatory",description:"Explore learning patterns through an adjustable review threshold and local CSV data.",robots:{index:false,follow:false}};
export default function Layout({children}:{children:ReactNode}){return <html lang="en"><body>{children}</body></html>;}

