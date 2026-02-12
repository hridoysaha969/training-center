import "dotenv/config";
import { connectDB } from "@/lib/mongodb";
import { Admin } from "@/models/Admin";
import bcrypt from "bcryptjs";

async function main() {
  const email = process.env.SUPER_ADMIN_EMAIL?.trim().toLowerCase();
  const name = process.env.SUPER_ADMIN_NAME?.trim();
  const password = process.env.SUPER_ADMIN_PASSWORD;

  if (!email || !name || !password) {
    throw new Error(
      "Missing env vars. Please set SUPER_ADMIN_EMAIL, SUPER_ADMIN_NAME, SUPER_ADMIN_PASSWORD.",
    );
  }

  await connectDB();

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log("✅ Super admin already exists:", email);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 12);

  await Admin.create({
    name,
    email,
    password: hashed,
    role: "SUPER_ADMIN",
    isActive: true,
  });

  console.log("🎉 Super admin created successfully:", email);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Seed failed:", err.message);
    process.exit(1);
  });
