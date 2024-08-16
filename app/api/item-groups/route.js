import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';
import ItemGroup from '@/models/item/ItemGroup';

export async function GET() {
  await connectToDB();
  const itemGroups = await ItemGroup.find({});
  return NextResponse.json(itemGroups);
}

export async function POST(req) {
  await connectToDB();
  const { name, active } = await req.json();

  // Check if group with the same name already exists
  const existingGroup = await ItemGroup.findOne({ name: name.trim() });
  if (existingGroup) {
    return NextResponse.json({ message: 'Group with this name already exists.' }, { status: 400 });
  }

  const newItemGroup = new ItemGroup({ name: name.trim(), active });
  await newItemGroup.save();
  return NextResponse.json(newItemGroup, { status: 201 });
}