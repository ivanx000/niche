export interface BoilerplateConfigType {
  app: {
    name: string
    supportEmail: string
  }
  paywall: {
    headline: string
    subtitle: string
    features: string[]
  }
  revenueCat: {
    apiKey: string
    entitlementName: string
  }
}

export const BoilerplateConfig: BoilerplateConfigType = {
  app: {
    name: "niche",
    supportEmail: "ivanxie101@gmail.com",
  },
  paywall: {
    headline: "A gentler relationship with the feed.",
    subtitle: "Unlock unlimited intentions, deeper insights, and a calmer daily rhythm.",
    features: [
      "Unlimited custom intentions",
      "Full pause history & weekly trends",
      "Advanced breathing sequences",
      "Offline mode",
    ],
  },
  revenueCat: {
    apiKey: "YOUR_REVENUECAT_API_KEY",
    entitlementName: "premium",
  },
}
