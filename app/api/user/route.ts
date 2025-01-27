import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users.models";
import { getSessionAtHome } from "@/auth";

await connectDB();

export async function GET(request: NextRequest) {
  const SearchParams = request.nextUrl.searchParams;
  const id = SearchParams.get("email");

  if (id) {
    return getUserByEmail(id);
  } else {
    return getAllUsers();
  }
}

export async function PUT(request: NextRequest) {
  const session = await getSessionAtHome();

  const body = await request.json();
  const { email, name, image, bio, username } = body;
  if (!email) {
    return NextResponse.json(
      {
        message: "Email is required",
        success: false
      },
      { status: 400 }
    );
  }
  if (session?.user?.email !== email) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        success: false
      },
      { status: 401 }
    );
  }

  const existingUser = await User.findOne({ username });
  if (existingUser.username !== username) {
    return NextResponse.json(
      {
        message: "Username already exists",
        success: false
      },
      { status: 400 }
    );
  }
  try {
    const user = await User.findOneAndUpdate(
      { email },
      { name, image, bio, username },
      { new: true }
    );
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ user, success: true });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
        success: false
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionAtHome();

  if (!session) {
    return NextResponse.json(
      {
        message: "Unauthorized",
        success: false
      },
      { status: 401 }
    );
  }

  const email = session?.user?.email;
  try {
    const user = await User.findOneAndDelete({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ user, success: true });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
        success: false
      },
      { status: 500 }
    );
  }
}

async function getUserByEmail(email: string) {
  if(!email) {
    return NextResponse.json(
      {
        message: "Email is required",
        success: false
      },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false
        },
        { status: 404 }
      );
    }
    return NextResponse.json({ user, success: true });
  } catch (error: any) {
    console.error("Error fetching user by email:", error);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
        success: false
      },
      { status: 500 }
    );
  }
}

async function getAllUsers() {
  try {
    const user = await User.find();
    if (!user) {
      return NextResponse.json(
        {
          message: "User not found",
          success: false
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ user, success: true });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        message: error.message || "Something went wrong",
        success: false
      },
      { status: 500 }
    );
  }
}
