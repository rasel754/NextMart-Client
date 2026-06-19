import NMContainer from "@/components/ui/core/NMContainer";

export default function PrivacyPage() {
  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us when registering accounts, creating shop settings, adding items to your cart, or corresponding with our support channels. This includes your name, email address, password hash, phone number, and physical mailing addresses.",
    },
    {
      title: "2. How We Use Your Data",
      content: "We utilize collected details to validate user accounts, route order details to corresponding shop vendors, process billing actions, and prevent bot abuse through integrated reCAPTCHA checks.",
    },
    {
      title: "3. Cookie Tracking Policy",
      content: "NextMart Client sets secure cookies to store authentication state parameters (JWT tokens). These cookies are transmitted during API requests to authorize server actions and personalize shop structures.",
    },
    {
      title: "4. Sharing Information with Third Parties",
      content: "We do not sell your personal data. We only share necessary customer shipping details with third-party vendors and delivery operators to fulfill logistics requirements.",
    },
    {
      title: "5. Security Safeguards",
      content: "All token authorization headers, passwords, and sessions are encrypted. We implement strict server-side validation and database audits to safeguard system integrity.",
    },
  ];

  return (
    <NMContainer>
      <div className="py-12 md:py-20 max-w-4xl mx-auto px-4">
        <div className="mb-12 border-b pb-6">
          <h1 className="text-4xl font-black mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground text-sm">
            Last Updated: June 18, 2026
          </p>
        </div>

        <div className="space-y-8">
          <p className="text-muted-foreground leading-relaxed">
            Welcome to NextMart Client. We are committed to protecting the personal data of our users, vendors, and customers. This policy details how we handle information across our e-commerce portal.
          </p>

          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-3">
              <h2 className="text-xl font-bold text-foreground">{sec.title}</h2>
              <p className="text-muted-foreground text-sm leading-relaxed text-justify">
                {sec.content}
              </p>
            </div>
          ))}

          <div className="pt-6 border-t">
            <h2 className="text-lg font-bold mb-2">6. Contact Us</h2>
            <p className="text-sm text-muted-foreground">
              If you have any questions regarding this Privacy Policy, feel free to email our compliance team at{" "}
              <a href="mailto:privacy@nextmart.com" className="text-primary hover:underline font-semibold">
                privacy@nextmart.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </NMContainer>
  );
}
