export const siteConfig = {
  name: "Expense Tracker",
  description: "Ứng dụng quản lý chi tiêu cá nhân thông minh",
  url: "https://expense-tracker.vercel.app",
  ogImage: "https://expense-tracker.vercel.app/og.jpg",
  links: {
    twitter: "https://twitter.com/expense-tracker",
    github: "https://github.com/expense-tracker/expense-tracker",
  },
  keywords: [
    "expense tracker",
    "quản lý chi tiêu",
    "tài chính cá nhân",
    "ngân sách",
    "theo dõi chi tiêu",
    "personal finance",
    "budget management",
  ],
  authors: [
    {
      name: "Expense Tracker Team",
      url: "https://expense-tracker.vercel.app",
    },
  ],
  creator: "Expense Tracker Team",
  metadataBase: new URL("https://expense-tracker.vercel.app"),
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://expense-tracker.vercel.app",
    title: "Expense Tracker - Quản lý chi tiêu thông minh",
    description: "Ứng dụng quản lý chi tiêu cá nhân với AI, theo dõi ngân sách và phân tích thông minh",
    siteName: "Expense Tracker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Expense Tracker - Quản lý chi tiêu thông minh",
    description: "Ứng dụng quản lý chi tiêu cá nhân với AI, theo dõi ngân sách và phân tích thông minh",
    creator: "@expense-tracker",
  },
}

export type SiteConfig = typeof siteConfig
