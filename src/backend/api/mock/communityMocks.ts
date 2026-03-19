import type { BlogPost, CareerData } from "@/backend/models";

export const MOCK_BLOG_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Essential Post-Operative Care Tips for Families",
    excerpt: "Recovering from surgery is a critical phase. Learn how you can support your loved ones at home with these professional medical insights...",
    author: "Dr. Farhana Ahmed",
    date: "Mar 12, 2026",
    cat: "Health Guide",
    img: "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: "2",
    title: "Managing Chronic Hypertension in the Elderly",
    excerpt: "Maintaining blood pressure is not just about medicine. Explore dietary and lifestyle adjustments that make a real difference in geriatric care...",
    author: "Prof. Jamal Haque",
    date: "Mar 10, 2026",
    cat: "Chronic Care",
    img: "https://images.unsplash.com/photo-1527137342181-19aab11a8ee1?auto=format&fit=crop&q=80&w=600&h=400",
  },
  {
    id: "3",
    title: "Digital Health: How CareNet is Changing Lives",
    excerpt: "Technology is bringing professional healthcare to the doorsteps of millions in Bangladesh. Discover the impact of real-time monitoring...",
    author: "CareNet Editorial",
    date: "Mar 05, 2026",
    cat: "Platform News",
    img: "https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=600&h=400",
  },
];

export const MOCK_CAREER_DATA: CareerData = {
  stats: [{ label: "Open Positions", val: "12" }, { label: "Departments", val: "6" }, { label: "Remote Roles", val: "4" }, { label: "Avg Response", val: "48h" }],
  jobs: [
    { id: "j1", title: "Senior React Developer", dept: "Engineering", location: "Dhaka / Remote", type: "Full-time", posted: "Mar 10" },
    { id: "j2", title: "UX/UI Designer", dept: "Design", location: "Dhaka", type: "Full-time", posted: "Mar 08" },
    { id: "j3", title: "Community Manager", dept: "Marketing", location: "Remote", type: "Contract", posted: "Mar 05" },
    { id: "j4", title: "DevOps Engineer", dept: "Engineering", location: "Dhaka", type: "Full-time", posted: "Mar 01" },
    { id: "j5", title: "Customer Support Lead", dept: "Support", location: "Dhaka", type: "Full-time", posted: "Feb 28" },
  ],
};