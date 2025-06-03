import ManageBrands from '@/components/modules/shop/brand';
import { getAllBrands } from '@/services/Brand';
import React from 'react';

const ProductBrandPage =async () => {
    const {data ,meta} =await getAllBrands()
    return (
        <div>
            <ManageBrands brands={data}></ManageBrands>
        </div>
    );
};

export default ProductBrandPage;