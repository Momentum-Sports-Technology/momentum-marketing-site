import type { Metadata } from "next";
import PageHeader from "@/components/PageHeader";
import { getContent } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Privacy Policy - Momentum Netball",
  description: "How Momentum Netball collects and uses your personal data.",
};

export default async function PrivacyPage() {
  const site = await getContent("site");
  const email = site.contact.email;

  const sections: Array<{ heading: string; body: string[] }> = [
    {
      heading: "Who we are",
      body: [
        "Momentum Netball Ltd runs netball leagues, coaching, and sessions in Hampshire and the surrounding areas. Our website address is https://momentumnetball.co.uk.",
      ],
    },
    {
      heading: "What we collect and why",
      body: [
        "Contact and registration forms: your name, email address, phone number, and message. We use these to reply to you and to place you in a suitable league or session.",
        "Newsletter sign-up: your email address, used only to send you news and events. Every email includes an unsubscribe link.",
        "Bookings: when you book on booking.momentumnetball.co.uk we collect the details needed to run the session and take payment. Card details are handled by Stripe and never touch our servers.",
        "Shop: purchases are completed on Stripe. Stripe collects your payment and delivery details under its own privacy policy.",
      ],
    },
    {
      heading: "Cookies and analytics",
      body: [
        "This website sets no advertising or tracking cookies. The admin area sets a session cookie for staff only. Embedded fixtures from Momentum Sports Technology may set cookies of their own.",
      ],
    },
    {
      heading: "Who we share your data with",
      body: [
        "We share data only with the services that run the site: our email provider to deliver messages, Stripe for payments, and our hosting provider. We never sell your data.",
      ],
    },
    {
      heading: "How long we keep it",
      body: [
        "Form submissions are kept for two years so we can follow up on your enquiry. Booking and payment records are kept for six years to meet accounting rules. Newsletter subscriptions are kept until you unsubscribe.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        `You can ask for a copy of the personal data we hold about you, ask us to correct it, or ask us to delete it. Email ${email} and we will respond within one month.`,
      ],
    },
  ];

  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" subtitle="Last updated September 2026" />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl space-y-10">
          {sections.map((section) => (
            <div key={section.heading}>
              <h2 className="text-2xl font-bold mb-3">{section.heading}</h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-gray-700 leading-relaxed mb-3">
                  {paragraph}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
