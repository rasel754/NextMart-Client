"use client";

import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import NMContainer from "@/components/ui/core/NMContainer";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { useState } from "react";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async () => {
    try {
      // Mock API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Thank you! Your message has been sent successfully.");
      setIsSuccess(true);
      form.reset();
    } catch {
      toast.error("Failed to send the message. Please try again.");
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: "+880 1234 567890",
      subText: "Mon-Fri from 9am to 6pm",
    },
    {
      icon: Mail,
      title: "Email Support",
      details: "support@nextmart.com",
      subText: "We reply within 24 hours",
    },
    {
      icon: MapPin,
      title: "Visit Office",
      details: "Gulshan-2, Dhaka, Bangladesh",
      subText: "Come say hello in person",
    },
  ];

  return (
    <NMContainer>
      <div className="py-12 md:py-20 max-w-6xl mx-auto px-4">
        {/* Banner */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-black mb-4">Contact Our Team</h1>
          <p className="text-muted-foreground">
            Have questions about vendor registration, order tracking, or platform operations? Get in touch with us.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          {/* Info Column */}
          <div className="space-y-8 lg:col-span-1">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <div key={idx} className="flex gap-4 items-start bg-card border border-border/60 p-6 rounded-2xl">
                  <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                    <p className="text-foreground font-semibold text-sm">{info.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">{info.subText}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Form Column */}
          <div className="lg:col-span-2 bg-card border border-border/60 p-8 rounded-3xl shadow-sm">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mb-4 animate-bounce" />
                <h2 className="text-2xl font-bold mb-2">Message Sent!</h2>
                <p className="text-muted-foreground text-sm max-w-sm mb-6">
                  Thank you for reaching out. A NextMart representative will contact you via email shortly.
                </p>
                <Button onClick={() => setIsSuccess(false)} variant="outline" className="rounded-full">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="Partnership Opportunity" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            rows={5}
                            placeholder="Tell us details about your request..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full rounded-full flex gap-2 items-center justify-center"
                  >
                    {form.formState.isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </div>
    </NMContainer>
  );
}
