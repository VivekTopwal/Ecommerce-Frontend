import React from "react";
import Image from "next/image";
import Link from "next/link";


const Category = () => {
  return (
    <section>
      <div className="py-2 px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 sm:gap-6 gap-4">
          <Link href="/category/skin-care">
            <div className="p-3 rounded-lg overflow-hidden cursor-pointer relative">
              <div className="rounded-full overflow-hidden mx-auto">
                <Image
                  src="/images/skin-collection-icon.webp"
                  alt="product1"
                  width={100}
                  height={100}
                  className="h-full w-full object-cover object-top rounded-lg"
                />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-slate-900 text-[16px]">Skin Care</h4>
              </div>
            </div>
          </Link>

          <Link href="/category/hair-care">
            <div className="p-3 rounded-lg overflow-hidden cursor-pointer relative">
              <div className="rounded-full overflow-hidden mx-auto">
                <Image
                  src="/images/hair.webp"
                  alt="product1"
                  width={100}
                  height={100}
                  className="h-full w-full object-cover object-top rounded-lg"
                />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-slate-900 text-[16px]">Hair Care</h4>
              </div>
            </div>
          </Link>

          <Link href="/category/fragrance">
            <div className="p-3 rounded-lg overflow-hidden cursor-pointer relative">
              <div className="rounded-full overflow-hidden mx-auto">
                <Image
                  src="/images/Fragrance.webp"
                  alt="product1"
                  width={100}
                  height={100}
                  className="h-full w-full object-cover object-top rounded-lg"
                />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-slate-900 text-[16px]">Perfume Lovers</h4>
              </div>
            </div>
          </Link>

          <Link href="/category/combos">
            <div className="p-3 rounded-lg overflow-hidden cursor-pointer relative">
              <div className="rounded-full overflow-hidden mx-auto">
                <Image
                  src="/images/combos.webp"
                  alt="product1"
                  width={100}
                  height={100}
                  className="h-full w-full object-cover object-top rounded-lg"
                />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-slate-900 text-[16px]">
                  Cost-Saving Combos
                </h4>
              </div>
            </div>
          </Link>

          <Link href="/category/crystals">
            <div className="p-3 rounded-lg overflow-hidden cursor-pointer relative">
              <div className="rounded-full overflow-hidden mx-auto">
                <Image
                  src="/images/crystals.webp"
                  alt="product1"
                  width={100}
                  height={100}
                  className="h-full w-full object-cover object-top rounded-lg"
                />
              </div>
              <div className="mt-3 text-center">
                <h4 className="text-slate-900 text-[16px]">Crystals</h4>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Category;
