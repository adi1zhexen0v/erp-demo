export function allocateDeliveryCost(totalDelivery: number, itemsCount: number): number[] {
  if (itemsCount === 0 || totalDelivery === 0) {
    return new Array(itemsCount).fill(0);
  }

  const deliveryPerItem = totalDelivery / itemsCount;
  const roundedDeliveryPerItem = Math.round(deliveryPerItem * 100) / 100;

  const allocations: number[] = [];
  let allocated = 0;

  for (let i = 0; i < itemsCount; i++) {
    const isLast = i === itemsCount - 1;
    if (isLast) {
      allocations.push(totalDelivery - allocated);
    } else {
      allocations.push(roundedDeliveryPerItem);
      allocated += roundedDeliveryPerItem;
    }
  }

  return allocations;
}

