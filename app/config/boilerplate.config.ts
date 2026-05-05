import { ImageSourcePropType } from "react-native"

export interface OnboardingSlide {
  title: string
  body: string
  image?: ImageSourcePropType
  imageScale?: number
  imageOffsetY?: number
}

export interface BoilerplateConfigType {
  app: {
    name: string
    supportEmail: string
  }
  onboarding: {
    slides: OnboardingSlide[]
    /** Set to true to request notification permissions on the last slide */
    requestNotifications: boolean
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
    name: "My App",
    supportEmail: "hello@example.com",
  },
  onboarding: {
    slides: [
      {
        title: "Welcome",
        body: "A short description of the first key benefit of your app.",
        image: require("../../assets/onboarding1.png"),
        imageScale: 0.85,
      },
      {
        title: "Key Feature",
        body: "Describe what makes your app unique and how it helps users.",
        image: require("../../assets/onboarding2.png"),
        imageScale: 1.05,
        imageOffsetY: 40,
      },
      {
        title: "Get Started",
        body: "You're all set. Start using the app and see the results for yourself.",
        image: require("../../assets/onboarding3.png"),
        imageScale: 0.95,
      },
    ],
    requestNotifications: false,
  },
  paywall: {
    headline: "Unlock Everything",
    subtitle: "Get full access to all features with a subscription",
    features: [
      "Access all premium features",
      "Sync across devices",
      "Priority support",
    ],
  },
  revenueCat: {
    apiKey: "YOUR_REVENUECAT_API_KEY",
    entitlementName: "premium",
  },
}
