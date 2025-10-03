
import React from 'react';
import { CategoryCard } from './CategoriaCard';
import { SectionHeader } from './SeccionHeader';
import { id } from 'zod/v4/locales';

export function FoodCategoriesSection() {
  const categories = [
    {
    
      image: "https://png.pngtree.com/png-clipart/20231020/original/pngtree-mexican-food-grilled-chicken-on-plate-with-fork-and-knife-png-image_13378825.png",
      title: "Main Dishes",
      itemCount: 50
    },
    {
      image: "https://tse1.mm.bing.net/th/id/OIP.vXVxmXTFVxTkg2OHf9EbhAHaFR?rs=1&pid=ImgDetMain&o=7&rm=3",
      title: "Salads",
      itemCount: 20
    },
    {
      image: "https://tse2.mm.bing.net/th/id/OIP.jATvuRGUqZ_eRr_vGnk09gHaHX?rs=1&pid=ImgDetMain&o=7&rm=3",
      title: "Appetizers",
      itemCount: 12
    },
    {
      image: "https://www.pngall.com/wp-content/uploads/5/Beverage-Transparent.png",
      title: "Beverages",
      itemCount: 40
    }
  ];

    return (
        <section className="py-16 lg:py-24 bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
        <div className="container mx-auto px-6 lg:px-12">
            <SectionHeader 
            subtitle="Our Offerings"
            title="Food Categories We Serve"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {categories.map((category) => (
                <CategoryCard
                image={category.image}
                title={category.title}
                itemCount={category.itemCount}
                />
            ))
            }
            </div>
        </div>
        </section>
    );
}