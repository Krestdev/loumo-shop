"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useTranslations } from "next-intl";
import { Category } from "@/types/types";
import { Slider } from "@/components/ui/slider";

interface FilterProps {
    categories: Category[];
    selectedCategories: Category[];
    setSelectedCategories: (categories: Category[]) => void;
    price: number;
    setPrice: (price: number) => void;
    minPrice: number;
    setMinPrice: (price: number) => void;
    availableOnly: boolean;
    setAvailableOnly: (value: boolean) => void;
    maxPrice: number;
}

export default function Filter({
    price,
    setPrice,
    minPrice,
    setMinPrice,
    availableOnly,
    setAvailableOnly,
    maxPrice,
    categories,
    selectedCategories,
    setSelectedCategories,
}: FilterProps) {
    const t = useTranslations("Catalog.Filters");

    const handleCategoryChange = (category: Category) => {
        const isSelected = selectedCategories.some((cat) => cat.id === category.id);
        if (isSelected) {
            setSelectedCategories(
                selectedCategories.filter((cat) => cat.id !== category.id)
            );
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    return (
        <aside className="max-w-[240px] w-full border border-input rounded-md">
            <div className="flex gap-2 px-5 py-2">
                <p className="text-lg font-semibold">{t("filters")}</p>
            </div>
            <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue="item-1"
            >
                {/* Prix */}
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-black flex gap-2 px-5 py-2">
                        {t("priceRange")}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-2 px-5 py-2">
                        <p className="mb-1 text-sm text-gray-600">
                            {minPrice.toLocaleString()} – {price.toLocaleString()} FCFA
                        </p>

                        <Slider
                            min={0}
                            max={maxPrice}
                            step={500}
                            defaultValue={[minPrice, price]}
                            value={[minPrice, price]}
                            onValueChange={([min, max]) => {
                                setMinPrice(min);
                                setPrice(max);
                            }}
                            className="relative w-full h-4"
                            // thumbClassName="w-4 h-4 bg-red-600 border border-white rounded-full shadow" 
                            // trackClassName="bg-gray-200 h-1 rounded-full"
                            // rangeClassName="bg-red-500 h-1 rounded-full"
                        />

                        {/* <div className="flex items-center justify-between gap-2">
              <Input
                type="number"
                min={0}
                max={price}
                value={minPrice}
                onChange={(e) => setMinPrice(Number(e.target.value))}
                className="w-1/2 h-8 text-sm px-2"
              />
              <Input
                type="number"
                min={minPrice}
                max={maxPrice}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-1/2 h-8 text-sm px-2"
              />
            </div> */}
                    </AccordionContent>
                </AccordionItem>

                {/* Catégories */}
                <AccordionItem value="item-2">
                    <AccordionTrigger className="text-black flex gap-2 px-5 py-2">
                        {t("category")}
                    </AccordionTrigger>
                    <AccordionContent className="flex flex-col gap-[6px] px-5 py-2">
                        {categories
                            .filter((category) =>
                                category.products?.some(
                                    (product) => product.variants && product.variants.length > 0
                                )
                            )
                            .map((category) => (
                                <label
                                    key={category.id}
                                    className="flex items-center gap-2 text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.some(
                                            (cat) => cat.id === category.id
                                        )}
                                        onChange={() => handleCategoryChange(category)}
                                    />
                                    {category.name}
                                </label>
                            ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            {/* Disponibilité */}
            <div className="flex gap-2 px-5 py-2 items-center text-sm border-t">
                <input
                    type="checkbox"
                    checked={availableOnly}
                    onChange={(e) => setAvailableOnly(e.target.checked)}
                />
                <label htmlFor="availableOnly">{t("show")}</label>
            </div>
        </aside>
    );
}
