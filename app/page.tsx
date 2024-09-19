import { Button, Rate } from "antd";
import axios from "axios";
import { cookies } from 'next/headers';
import Image from 'next/image';
import AddToCartBtn from "./components/AddToCartBtn";
import Link from "next/link";
import { ProductInterface } from "@/interfaces";
import Filters from "./components/Filters";


const styles = {
  productCard: {
    display: 'flex' as const,
    flexDirection: 'column' as const,
    justifyContent: 'space-between' as const,
    height: '100%',
    padding: '16px',
    border: '1px solid #ccc',
  },
  productName: {
    maxHeight: '3em', // Limits the name height to 2 lines
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  productFooter: {
    display: 'flex' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginTop: 'auto' as const, // Pushes this section to the bottom
  }
};

async function getProducts(searchParams: any) {
  try {
    const cookiStore = cookies();
    const token = cookiStore.get('token')?.value;
    const category = searchParams.category || "";
    const search = searchParams.search || "";
    const endPoint = `${process.env.domain}/api/product?category=${category}&search=${search}`;
    const response = await axios.get(endPoint, {
      headers: {
        cookie: `token=${token}`,
      },
    });
    return response.data.data || [];
  } catch (error: any) {
    console.log(error.message);
    return [];
  }
}

export default async function Home({ searchParams }: { searchParams: any }) {
  const products = await getProducts(searchParams);
  return (
    <div>
      <Filters />

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5 mt-5">
        {products.map((product: ProductInterface) => (
          <div key={product._id} style={styles.productCard}>
            <Link href={`/product/${product._id}`}>
              <div className="text-center">
                <Image src={product.images[0]} alt="" height={150} width={150} />
              </div>

              <div className="flex flex-col mt-5">
                <span className="text-sm" style={styles.productName}>{product.name}</span>
              </div>

              <div className="flex justify-between items-center mt-2">
                <Rate
                  disabled
                  defaultValue={product.rating || 0}
                  style={{ color: "#26577C" }}
                  allowHalf
                />
                <span className="text-gray-500">
                  {product.countInStock > 0 ? `${product.countInStock} in Stock` : "Out of Stock"}
                </span>
              </div>
            </Link>

            <div style={styles.productFooter}>
              <h1 className="text-xl font-semibold">$ {product.price}</h1>
              <AddToCartBtn product={product} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


  // return (
  //   <div>
  //     {/* filters purpose */}
  //     <div className="grid grid-cols-4 gap-5">
  //       {products.map((product: any) => (
  //         <div
  //           key={product.id}
  //           className="p-4 flex flex-col gap-1 border border-solid border-gray-300"
  //         >
  //           <div className="text-center">
  //             <Image src={product.images[0]} alt="" height={180} width={180} />
  //           </div>
  //           <h1 className="text-sm">{product.name}</h1>
  //           <h1 className="text-xl font-semibold">$ {product.price}</h1>
  //           <div className="flex justify-between items-center">
  //             <Rate disabled defaultValue={product.rating || 0} />
  //             <AddToCartBtn product={product} />
  //           </div>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );


// }
