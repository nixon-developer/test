import { NextResponse } from 'next/server';
import connectToDB from '@/utils/db';
import ItemGroup from '@/models/item/ItemGroup';
import ItemCategory from '@/models/item/ItemCategory';

export async function GET(req, { params }) {
  await connectToDB();
  const { id } = params;
  const itemGroup = await ItemGroup.findById(id);
  if (!itemGroup) {
    return NextResponse.json({ message: 'ItemGroup not found' }, { status: 404 });
  }
  return NextResponse.json(itemGroup);
}

export async function PUT(req, { params }) {
  await connectToDB();
  const { id } = params;
  const { name, active } = await req.json();

  // Check if any category references this group
  const linkedCategories = await ItemCategory.findOne({ groupId: id });
  if (linkedCategories) {
    return NextResponse.json({ message: 'Cannot edit group as it is linked to one or more categories.' }, { status: 400 });
  }

  const itemGroup = await ItemGroup.findByIdAndUpdate(id, { name, active }, { new: true });
  if (!itemGroup) {
    return NextResponse.json({ message: 'ItemGroup not found' }, { status: 404 });
  }
  return NextResponse.json(itemGroup);
}

// export async function DELETE(req, { params }) {
//   await connectToDB();
//   const { id } = params;

//   // Check if any category references this group
//   const linkedCategories = await ItemCategory.findOne({ groupId: id });
//   if (linkedCategories) {
//     return NextResponse.json({ message: 'Cannot delete group as it is linked to one or more categories.' }, { status: 400 });
//   }

//   const itemGroup = await ItemGroup.findByIdAndDelete(id);
//   if (!itemGroup) {
//     return NextResponse.json({ message: 'ItemGroup not found' }, { status: 404 });
//   }
//   return new NextResponse(null, { status: 204 });
// }


export async function DELETE(req, { params }) {
  await connectToDB();
  const { id } = params;

  // Check if any category references this group
  const linkedCategories = await ItemCategory.findOne({ groupId: id });
  if (linkedCategories) {
    return NextResponse.json({ message: 'Cannot delete group as it is linked to one or more categories.' }, { status: 400 });
  }

  const itemGroup = await ItemGroup.findByIdAndDelete(id);
  if (!itemGroup) {
    return NextResponse.json({ message: 'ItemGroup not found' }, { status: 404 });
  }

  return NextResponse.json({ message: 'Group deleted successfully!' }, { status: 200 });
}
