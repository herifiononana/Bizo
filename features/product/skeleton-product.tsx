// components/SkeletonProduct.tsx
import React from "react";
import { View } from "react-native";
import { SkeletonProductListItem } from "./product-list-item-skeleton";

const SkeletonProduct = () => {
  return (
    <View>
      <SkeletonProductListItem />
      <SkeletonProductListItem />
      <SkeletonProductListItem />
    </View>
  );
};

export default SkeletonProduct;
