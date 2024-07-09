import Hero from "@/components/ui/hero";
import Body from "@/components/ui/body";
import Features from "@/components/ui/features";
import { Extended } from "@/components/ui/featuresextended";
import Faq from "@/components/ui/faq";

export default function Home() {
  return (
    <>
      <Hero />
      <Body />
      <Features />
      <Extended />
      <Faq />
    </>
  );
}
