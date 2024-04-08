import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  return (
    <section className="relative bg-white">
      {/* Illustration behind content */}
      <div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -mb-32"
        aria-hidden="true"
      >
        <svg
          width="1760"
          height="518"
          viewBox="0 0 1760 518"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-02"
            >
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g
            transform="translate(0 -3)"
            fill="url(#illustration-02)"
            fillRule="evenodd"
          >
            <circle cx="1630" cy="128" r="128" />
            <circle cx="178" cy="481" r="40" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="max-w-3xl mx-auto mt-20" data-aos="zoom-y-out">
            <div className="flex flex-col gap-12">
              <h2 className="h2 mb-4 mt-12">FAQ</h2>

              <Accordion
                type="single"
                collapsible
                className="text-gray-600 font-medium"
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    Does Fortify offer Web Wallet Services?
                  </AccordionTrigger>
                  <AccordionContent>
                    No, Fortify is not a wallet
                  </AccordionContent>
                </AccordionItem>

                {/* 2 */}
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    What is the wallet health?
                  </AccordionTrigger>
                  <AccordionContent>
                    We perform a scan on your wallet and provide a score based
                    on our findings. The higher the score, the more secure it is
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    How Accurate is Fortify's Data?
                  </AccordionTrigger>
                  <AccordionContent>
                    We get our data from the solana blockchain utilizing tools
                    like Shyft, helius and metaplex
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
