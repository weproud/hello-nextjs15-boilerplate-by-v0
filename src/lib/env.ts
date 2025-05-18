export const Envs = {
  nodeEnv: process.env.NODE_ENV,

  databaseUrl: process.env.DATABASE_URL,
  publicBaseUrl: process.env.NEXT_PUBLIC_BASE_URL!,

  publicApiUrl: process.env.NEXT_PUBLIC_API_URL!,

  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,

  publicSupabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  publicSupabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  publicSupabaseBucketUrl: process.env.NEXT_PUBLIC_SUPABASE_BUCKET_URL,
  publicSupabaseImageBucket: process.env.NEXT_PUBLIC_SUPABASE_IMAGE_BUCKET!,

  authUrl: process.env.AUTH_URL!,
  authSecret: process.env.AUTH_SECRET!,
  authGoogleId: process.env.AUTH_GOOGLE_ID!,
  authGoogleSecret: process.env.AUTH_GOOGLE_SECRET!,

  // discordWebhookUrl: process.env.DISCORD_WEBHOOK_URL!,
} as const;
