import { connectDB } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import Contact from "@/models/contact.models";

export async function POST(request: NextRequest): Promise<NextResponse> {
  await connectDB();
  const { name, email, subject, message } = await request.json();
  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { message: "Please fill in all fields" },
      { status: 400 }
    );
  }
  try {
    const contact = await Contact.create({ name, email, subject, message });
    return NextResponse.json(
      {
        message: "Message sent successfully",
        data: contact
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

// GET request to get all data
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    await connectDB();
    const contacts = await Contact.find();
    return NextResponse.json({ data: contacts, success: true });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
