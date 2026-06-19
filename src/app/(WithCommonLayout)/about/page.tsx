import NMContainer from "@/components/ui/core/NMContainer";
import { ShieldCheck, Sparkles, Users, Award } from "lucide-react";
import Image from "next/image";

export default function AboutPage() {
  const stats = [
    { label: "Products Sold", value: "1.2M+" },
    { label: "Happy Customers", value: "99.9%" },
    { label: "Active Vendors", value: "5,000+" },
    { label: "Offices Globally", value: "4" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Trust & Security",
      description: "We guarantee secure transactions, validated merchants, and data privacy across all layers.",
    },
    {
      icon: Sparkles,
      title: "Innovation First",
      description: "Constantly upgrading our platform features to offer the most intuitive shopping flows.",
    },
    {
      icon: Users,
      title: "Community Focused",
      description: "Empowering local vendors, small businesses, and buyers to connect in a unified marketplace.",
    },
    {
      icon: Award,
      title: "Quality Standard",
      description: "Every brand showcased undergoes thorough quality validation to match customer standards.",
    },
  ];

  const team = [
    {
      name: "Sarah Jenkins",
      role: "CEO & Co-Founder",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    },
    {
      name: "Marcus Chen",
      role: "Chief Technology Officer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    },
    {
      name: "Amina Al-Jamil",
      role: "VP of Product Strategy",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    },
  ];

  return (
    <NMContainer>
      <div className="py-12 md:py-20 max-w-6xl mx-auto px-4">
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent dark:to-indigo-400">
            About NextMart
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            NextMart is a next-generation decentralized multi-vendor marketplace designed to connect quality brands and active buyers globally. We combine cutting-edge technology with rigorous standard procedures to deliver an unparalleled digital shopping experience.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 bg-card border border-border/65 rounded-2xl shadow-sm text-center transform transition duration-300 hover:scale-105"
            >
              <h3 className="text-3xl md:text-4xl font-extrabold text-primary mb-2">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Core Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div
                  key={idx}
                  className="bg-card border border-border/65 p-6 rounded-2xl flex flex-col items-center text-center transition hover:shadow-md"
                >
                  <div className="p-3 bg-primary/10 rounded-full mb-4 text-primary">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Leadership</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, idx) => (
              <div
                key={idx}
                className="bg-card border border-border/65 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition text-center p-6"
              >
                <div className="relative w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-2 border-primary/20">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-bold text-foreground">{member.name}</h3>
                <p className="text-sm font-medium text-primary mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NMContainer>
  );
}
