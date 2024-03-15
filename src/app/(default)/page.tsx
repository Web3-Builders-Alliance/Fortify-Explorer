import Image from "next/image";
import Hero from "@/components/ui/hero";
import Body from "@/components/ui/body";
import Features from "@/components/ui/features";
import { Extended } from "@/components/ui/featuresextended";
import Faq from "@/components/ui/faq";
import Newsletter from "@/components/ui/newsletter";


export default function Home() {
  return (
    <>
      <Hero />
      <Body />
      <Features />
      <Extended/>
      <Faq/>
      <Newsletter/>
    </>
  );
}
