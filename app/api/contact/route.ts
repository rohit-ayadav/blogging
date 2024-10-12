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
        data: contact,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}
