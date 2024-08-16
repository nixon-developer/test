import dynamic from 'next/dynamic';

const ItemGroups = dynamic(() => import('@/components/items/ItemGroups'), {
  loading: () => <p>Loading...</p>,
});

function ItemGroupsPage() {
  return (
    <div className="">
        <ItemGroups />
    </div>
  )
}

export default ItemGroupsPage