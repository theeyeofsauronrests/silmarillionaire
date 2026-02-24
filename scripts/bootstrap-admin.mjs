import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const adminEmail = process.env.ADMIN_EMAIL;
const adminName = process.env.ADMIN_NAME ?? "Silmarillion Admin";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  process.exit(1);
}

if (!adminEmail) {
  console.error("Missing ADMIN_EMAIL. Example: ADMIN_EMAIL=admin@company.com npm run db:bootstrap-admin");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

function randomPassword(length = 24) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

async function findUserByEmail(email) {
  let page = 1;

  while (true) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });

    if (error) {
      throw new Error(`Failed to list auth users: ${error.message}`);
    }

    const found = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (found) {
      return found;
    }

    if (data.users.length < 200) {
      return null;
    }

    page += 1;
  }
}

async function ensureAuthUser() {
  const existing = await findUserByEmail(adminEmail);
  if (existing) {
    return existing;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: adminEmail,
    password: randomPassword(),
    email_confirm: true,
    user_metadata: { name: adminName }
  });

  if (error || !data.user) {
    throw new Error(`Failed to create admin auth user: ${error?.message ?? "unknown error"}`);
  }

  return data.user;
}

async function bootstrap() {
  const user = await ensureAuthUser();

  const currentAppMetadata = user.app_metadata ?? {};

  const { error: metadataError } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: {
      ...currentAppMetadata,
      role: "admin"
    },
    user_metadata: {
      ...(user.user_metadata ?? {}),
      name: user.user_metadata?.name ?? adminName
    }
  });

  if (metadataError) {
    throw new Error(`Failed to set auth app_metadata role: ${metadataError.message}`);
  }

  const { error: upsertError } = await supabase.from("users").upsert(
    {
      id: user.id,
      email: adminEmail,
      name: user.user_metadata?.name ?? adminName,
      role: "admin",
      status: "active"
    },
    { onConflict: "id" }
  );

  if (upsertError) {
    throw new Error(`Failed to upsert public.users admin row: ${upsertError.message}`);
  }

  console.log(`Admin bootstrap complete for ${adminEmail} (${user.id}).`);
}

bootstrap().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
