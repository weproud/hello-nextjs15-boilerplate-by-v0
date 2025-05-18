declare namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_BASE_URL: string;
    NEXT_PUBLIC_API_URL: string;

    DATABASE_URL: string;
    DIRECT_URL: string;

    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
    NEXT_PUBLIC_SUPABASE_BUCKET_URL: string;
    NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET: string;
    SUPABASE_SERVICE_ROLE_KEY: string;

    AUTH_URL: string;
    AUTH_SECRET: string;
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;

    DISCORD_WEBHOOK_URL: string;
  }

  interface Window {
    gtag: any;
  }
}
