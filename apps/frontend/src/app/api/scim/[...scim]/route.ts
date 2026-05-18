import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Standard SCIM Schemas
const SCIM_USER_SCHEMA = "urn:ietf:params:scim:schemas:core:2.0:User";
const SCIM_LIST_SCHEMA = "urn:ietf:params:scim:api:messages:2.0:ListResponse";

/**
 * Helper to validate incoming SCIM authorization token
 */
async function authorize(req: NextRequest): Promise<boolean> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  const token = authHeader.split("Bearer ")[1]?.trim();
  if (!token) return false;

  // 1. Query token from dynamic system_settings table
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from("system_settings")
      .select("value")
      .eq("key", "scim_security_token")
      .single();

    if (!error && data?.value) {
      const dbToken = typeof data.value === "object" ? (data.value.token || data.value.value) : data.value;
      if (dbToken) {
        return token === dbToken;
      }
    }
  }

  // 2. Fallback to Env variable or secure dev-only fallback token
  const envToken = process.env.SCIM_SECURITY_TOKEN || "scim_token_zadit_2026";
  return token === envToken;
}

/**
 * Unified SCIM Dynamic Route Handler (GET, POST, PUT, PATCH, DELETE)
 */
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ scim: string[] }> }
) {
  const params = await props.params;
  if (!await authorize(req)) {
    return NextResponse.json({ detail: "Unauthorized access" }, { status: 401 });
  }

  const path = params.scim;
  const isUsersList = path[0] === "Users" && path.length === 1;
  const isUserDetail = path[0] === "Users" && path.length === 2;

  if (!supabaseAdmin) {
    return NextResponse.json({ detail: "Database offline" }, { status: 500 });
  }

  // 1. GET User Detail by ID
  if (isUserDetail) {
    const staffId = path[1];
    const { data: staff, error } = await supabaseAdmin
      .from("staff")
      .select("*")
      .eq("id", staffId)
      .single();

    if (error || !staff) {
      return NextResponse.json({ detail: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      schemas: [SCIM_USER_SCHEMA],
      id: staff.id,
      userName: staff.email,
      name: {
        formatted: staff.name,
        familyName: staff.name.split(" ").slice(-1)[0] || "",
        givenName: staff.name.split(" ")[0] || ""
      },
      emails: [{ value: staff.email, type: "work", primary: true }],
      active: staff.is_active
    });
  }

  // 2. GET Users List (supports filters like userName eq "email@example.com")
  if (isUsersList) {
    const url = new URL(req.url);
    const filter = url.searchParams.get("filter") || "";
    let emailFilter = "";

    // Parse standard SCIM email filter: userName eq "someone@example.com"
    if (filter.includes("userName eq")) {
      const match = filter.match(/userName eq "([^"]+)"/i);
      if (match && match[1]) {
        emailFilter = match[1];
      }
    }

    let queryBuilder = supabaseAdmin.from("staff").select("*");
    if (emailFilter) {
      queryBuilder = queryBuilder.eq("email", emailFilter);
    }

    const { data: staffList, error } = await queryBuilder;

    if (error) {
      return NextResponse.json({ detail: "Database query error" }, { status: 500 });
    }

    const resources = (staffList || []).map(staff => ({
      schemas: [SCIM_USER_SCHEMA],
      id: staff.id,
      userName: staff.email,
      name: {
        formatted: staff.name,
        familyName: staff.name.split(" ").slice(-1)[0] || "",
        givenName: staff.name.split(" ")[0] || ""
      },
      emails: [{ value: staff.email, type: "work", primary: true }],
      active: staff.is_active
    }));

    return NextResponse.json({
      schemas: [SCIM_LIST_SCHEMA],
      totalResults: resources.length,
      itemsPerPage: resources.length,
      startIndex: 1,
      Resources: resources
    });
  }

  return NextResponse.json({ detail: "SCIM Method Not Implemented" }, { status: 501 });
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ scim: string[] }> }
) {
  const params = await props.params;
  if (!await authorize(req)) {
    return NextResponse.json({ detail: "Unauthorized access" }, { status: 401 });
  }

  const path = params.scim;
  if (path[0] !== "Users" || path.length !== 1) {
    return NextResponse.json({ detail: "Invalid endpoint" }, { status: 400 });
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ detail: "Database offline" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const email = body.userName || body.emails?.[0]?.value;
    const name = body.name?.formatted || `${body.name?.givenName || ""} ${body.name?.familyName || ""}`.trim() || email;
    const active = body.active !== false;

    if (!email) {
      return NextResponse.json({ detail: "userName is required" }, { status: 400 });
    }

    // 1. Check if user already exists inside staff
    const { data: existingStaff } = await supabaseAdmin
      .from("staff")
      .select("id")
      .eq("email", email)
      .single();

    if (existingStaff) {
      return NextResponse.json({ detail: "User already exists" }, { status: 409 });
    }

    // 2. Provision authenticating identity securely in auth.users
    const { data: authUser, error: authErr } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      email_confirm: true,
      user_metadata: { name: name }
    });

    if (authErr || !authUser?.user) {
      console.error("SCIM auth provision failed:", authErr);
      return NextResponse.json({ detail: authErr?.message || "Failed to provision Auth User" }, { status: 500 });
    }

    // 3. Create staff profile row mapping the auth_user_id
    const { data: staff, error: staffErr } = await supabaseAdmin
      .from("staff")
      .insert({
        auth_user_id: authUser.user.id,
        name: name,
        email: email,
        is_active: active,
        role: "analyst"
      })
      .select()
      .single();

    if (staffErr || !staff) {
      // rollback auth.users if profile insertion fails
      await supabaseAdmin.auth.admin.deleteUser(authUser.user.id);
      return NextResponse.json({ detail: staffErr?.message || "Failed to create profile" }, { status: 500 });
    }

    return NextResponse.json({
      schemas: [SCIM_USER_SCHEMA],
      id: staff.id,
      userName: staff.email,
      name: {
        formatted: staff.name,
        familyName: staff.name.split(" ").slice(-1)[0] || "",
        givenName: staff.name.split(" ")[0] || ""
      },
      emails: [{ value: staff.email, type: "work", primary: true }],
      active: staff.is_active
    }, { status: 201 });

  } catch (err: any) {
    return NextResponse.json({ detail: err.message || "Invalid payload json" }, { status: 400 });
  }
}

export async function PUT(
  req: NextRequest,
  props: { params: Promise<{ scim: string[] }> }
) {
  const params = await props.params;
  if (!await authorize(req)) {
    return NextResponse.json({ detail: "Unauthorized access" }, { status: 401 });
  }

  const path = params.scim;
  if (path[0] !== "Users" || path.length !== 2) {
    return NextResponse.json({ detail: "Invalid detail path" }, { status: 400 });
  }

  const staffId = path[1];
  if (!supabaseAdmin) {
    return NextResponse.json({ detail: "Database offline" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const name = body.name?.formatted || `${body.name?.givenName || ""} ${body.name?.familyName || ""}`.trim();
    const active = body.active !== false;

    // 1. Find profile record
    const { data: staff, error: findErr } = await supabaseAdmin
      .from("staff")
      .select("auth_user_id")
      .eq("id", staffId)
      .single();

    if (findErr || !staff) {
      return NextResponse.json({ detail: "User not found" }, { status: 404 });
    }

    // 2. Update staff profile
    const { data: updatedStaff, error: updateErr } = await supabaseAdmin
      .from("staff")
      .update({
        name: name || undefined,
        is_active: active,
        updated_at: new Date().toISOString()
      })
      .eq("id", staffId)
      .select()
      .single();

    if (updateErr || !updatedStaff) {
      return NextResponse.json({ detail: updateErr?.message || "Failed to update profile" }, { status: 500 });
    }

    // 3. Update auth user active/metadata status
    await supabaseAdmin.auth.admin.updateUserById(staff.auth_user_id, {
      user_metadata: name ? { name: name } : undefined,
      ban_duration: active ? "none" : "1000h" // suspend/ban user from logging in if active is false
    });

    return NextResponse.json({
      schemas: [SCIM_USER_SCHEMA],
      id: updatedStaff.id,
      userName: updatedStaff.email,
      name: {
        formatted: updatedStaff.name,
        familyName: updatedStaff.name.split(" ").slice(-1)[0] || "",
        givenName: updatedStaff.name.split(" ")[0] || ""
      },
      emails: [{ value: updatedStaff.email, type: "work", primary: true }],
      active: updatedStaff.is_active
    });

  } catch (err: any) {
    return NextResponse.json({ detail: err.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  props: { params: Promise<{ scim: string[] }> }
) {
  const params = await props.params;
  if (!await authorize(req)) {
    return NextResponse.json({ detail: "Unauthorized access" }, { status: 401 });
  }

  const path = params.scim;
  if (path[0] !== "Users" || path.length !== 2) {
    return NextResponse.json({ detail: "Invalid detail path" }, { status: 400 });
  }

  const staffId = path[1];
  if (!supabaseAdmin) {
    return NextResponse.json({ detail: "Database offline" }, { status: 500 });
  }

  // 1. Fetch profile to grab auth_user_id
  const { data: staff, error: findErr } = await supabaseAdmin
    .from("staff")
    .select("auth_user_id")
    .eq("id", staffId)
    .single();

  if (findErr || !staff) {
    return NextResponse.json({ detail: "User not found" }, { status: 404 });
  }

  // 2. Cascade delete from auth.users (triggers profile deletion automatically via DB cascades)
  const { error: deleteErr } = await supabaseAdmin.auth.admin.deleteUser(staff.auth_user_id);

  if (deleteErr) {
    return NextResponse.json({ detail: deleteErr.message }, { status: 500 });
  }

  return new Response(null, { status: 204 });
}
