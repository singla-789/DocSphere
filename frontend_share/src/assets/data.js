import Testimonials from "../components/landing/Testimonials";

export const features = [
  {
    iconName: "ArrowUpCircle",
    iconColor: "text-purple-500",
    title: "Easy File Upload",
    description:
      "Quickly upload your files with our intuitive drag-and-drop interface.",
  },
  {
    iconName: "Shield",
    iconColor: "text-green-500",
    title: "Secure Storage",
    description:
      "Your files are encrypted and stored securely in our cloud infrastructure.",
  },
  {
    iconName: "Share2",
    iconColor: "text-purple-500",
    title: "Simple Sharing",
    description:
      "Share files with anyone using secure links that you control.",
  },
  {
    iconName: "CreditCard",
    iconColor: "text-orange-500",
    title: "Flexible Credits",
    description:
      "Pay only for what you use with our credit-based system.",
  },
  {
    iconName: "FileText",
    iconColor: "text-red-500",
    title: "File Management",
    description:
      "Organize, preview, and manage your files from any device.",
  },
  {
    iconName: "Clock",
    iconColor: "text-indigo-500",
    title: "Transaction History",
    description:
      "Keep track of all your credit purchases and usage.",
  },
];

export const pricingPlans = [
  {
    name: "Free",
    price: "0",
    description: "Perfect for getting started",
    features: [
      "5 file uploads",
      "Basic file sharing",
      "7-day file retention",
      "Email support"
    ],
    cta: "Get Started",
    highlighted: false
  },
  {
    name: "Premium",
    price: "500",
    description: "For individuals with larger needs",
    features: [
      "500 file uploads",
      "Advanced file sharing",
      "30-day file retention",
      "Priority email support",
      "File analytics"
    ],
    cta: "Go Premium",
    highlighted: true
  },
  {
    name: "Ultimate",
    price: "2500",
    description: "For teams and businesses",
    features: [
      "5000 file uploads",
      "Team sharing capabilities",
      "Unlimited file retention",
      "24/7 priority support",
      "Advanced analytics",
      "API access"
    ],
    cta: "Go Ultimate",
    highlighted: false
  }
];

export const testimonials =  [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "CreativeMinds Inc.",
    image: "https://randomuser.me/api/portraits/women/32.jpg",
    quote:
      "CloudShare has transformed how our team collaborates on creative assets. The secure sharing and intuitive interface save us hours every week.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Freelance Designer",
    company: "Self-employed",
    image: "https://randomuser.me/api/portraits/men/46.jpg",
    quote:
      "As a freelancer, CloudShare gives me complete control over how I share files with clients. Simple, fast, and reliable.",
    rating: 5,
  },
  {
    name: "Aisha Khan",
    role: "Product Manager",
    company: "TechNova Solutions",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
    quote:
      "The file management and analytics features help us understand how assets are used across teams. CloudShare fits perfectly into our workflow.",
    rating: 4,
  },
  {
    name: "Daniel Roberts",
    role: "Startup Founder",
    company: "LaunchBase",
    image: "https://randomuser.me/api/portraits/men/71.jpg",
    quote:
      "Security was our biggest concern, and CloudShare nailed it. The sharing controls and encryption give us real peace of mind.",
    rating: 5,
  },
  {
    name: "Priya Verma",
    role: "Operations Lead",
    company: "BrightWave Media",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
    quote:
      "CloudShare makes collaborating with external partners effortless. Uploading, sharing, and tracking files is incredibly smooth.",
    rating: 4,
  },
];

