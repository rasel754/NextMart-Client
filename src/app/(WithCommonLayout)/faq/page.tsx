"use client";

import NMContainer from "@/components/ui/core/NMContainer";
import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQPage() {
  const faqs = [
    {
      question: "How can I purchase products from NextMart?",
      answer: "Browse our Products page, add the desired items to your shopping cart, verify the shipping address, and proceed to checkout to complete your transaction via online payment options.",
    },
    {
      question: "What are the shipping charges?",
      answer: "We offer dynamic shipping calculations. Deliveries within Dhaka are flat ৳50, and deliveries outside Dhaka are flat ৳100. This is automatically updated when you fill in your city during checkout.",
    },
    {
      question: "Can I sell my own products on NextMart?",
      answer: "Yes! Once you register an account, click the 'Create Shop' button in the navbar to create and verify your virtual vendor shop. After approval, you can easily list and manage products through your dashboard.",
    },
    {
      question: "What payment options are accepted?",
      answer: "We support secure payments through SSLCommerz, accepting credit/debit cards, mobile banking apps (bKash, Nagad, Rocket), and general online bank transfers.",
    },
    {
      question: "How do I request a refund or return an item?",
      answer: "Contact customer support or submit an order dispute ticket within 7 days of receiving the item. Products must be unused and in original packaging to qualify for refund validation.",
    },
    {
      question: "How do flash sales work?",
      answer: "Flash sales are time-limited events where products are sold at major discount percentages. Once the countdown timer ends, items revert to their normal retail pricing.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <NMContainer>
      <div className="py-12 md:py-20 max-w-4xl mx-auto px-4">
        {/* Banner */}
        <div className="text-center mb-16 flex flex-col items-center">
          <div className="p-3 bg-primary/10 rounded-full text-primary mb-4">
            <HelpCircle className="w-12 h-12" />
          </div>
          <h1 className="text-4xl font-black mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground max-w-md">
            Find quick answers to common queries regarding ordering, shop creation, payments, and standard delivery policies.
          </p>
        </div>

        {/* FAQs List */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div
                key={idx}
                className="bg-card border border-border/60 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFAQ(idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-semibold text-lg text-foreground focus:outline-none hover:bg-muted/30 transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                      isOpen ? "transform rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen ? "max-h-96 opacity-100 border-t border-border/50" : "max-h-0 opacity-0 pointer-events-none"
                  }`}
                >
                  <p className="p-6 text-muted-foreground text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </NMContainer>
  );
}
